import { Check, ChevronLeft, Clock, ExternalLink, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Owl } from "@/components/Owl";
import SessionSheet from "@/components/SessionSheet";
import TaskDrawer, { type DrawerTask } from "@/components/TaskDrawer";
import TaskRow from "@/components/TaskRow";
import Timeline, { type TimelineItem } from "@/components/Timeline";
import {
  ListContainer,
  SectionLabel,
  TypeChip,
  copyToClipboard,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { iconByName } from "@/lib/icons";
import {
  isRoutineDoneOn,
  useCompletions,
  useInstructions,
  useLinks,
  useMessages,
  useRoutineTasks,
  useSessions,
  useSetSpecialStatus,
  useSpecialTasks,
  useToggleRoutineDone,
} from "@/lib/hooks";
import { specialToDrawer } from "@/lib/taskUtils";
import {
  routineOccurrenceDrawer,
  routineOccursOn,
} from "@/lib/routineUtils";
import {
  compareSessions,
  nextSessionDate,
  renderSessionMessage,
  sessionMessage,
  sessionOccursOn,
  sessionStatus,
  sessionTimeText,
} from "@/lib/sessionUtils";
import {
  formatArabicDate,
  timeMinutes,
  todayISO,
  todayWeekday,
  WEEKDAY_NAMES,
} from "@/lib/time";
import {
  FREQUENCY_LABEL,
  FREQUENCY_ORDER,
  specialStatusType,
  specialTaskType,
  type Frequency,
  type Session,
  type SpecialTask,
} from "@/lib/types";

function greetingText() {
  const h = new Date().getHours();
  if (h < 12) return "صباح الخير";
  if (h < 17) return "طاب يومك";
  return "مساء الخير";
}

function tasksCountText(n: number) {
  if (n === 0) return "لا مهام متبقية اليوم — عمل رائع";
  if (n === 1) return "لديك مهمة واحدة اليوم";
  if (n === 2) return "لديك مهمتان اليوم";
  return `لديك ${n <= 10 ? `${n} مهام` : `${n} مهمة`} اليوم`;
}

export default function Index() {
  const [name] = useState(() => localStorage.getItem("ng_name") ?? "");
  const [special, setSpecial] = useState<DrawerTask | null>(null);
  const [routineTask, setRoutineTask] = useState<DrawerTask | null>(null);
  const [openSession, setOpenSession] = useState<{
    session: Session;
    iso: string;
  } | null>(null);

  const { data: specials = [] } = useSpecialTasks();
  const { data: sessions = [] } = useSessions();
  const { data: routines = [] } = useRoutineTasks();
  const { data: links = [] } = useLinks();
  const { data: messages = [] } = useMessages();
  const { data: completions = [] } = useCompletions();
  const setStatus = useSetSpecialStatus();
  const toggleRoutine = useToggleRoutineDone();

  const today = todayISO();
  const dow = todayWeekday();

  const linkById = Object.fromEntries(links.map((l) => [l.id, l]));
  const msgById = Object.fromEntries(messages.map((m) => [m.id, m]));

  const routineOpen = (r: (typeof routines)[number], iso: string) => {
    const done = isRoutineDoneOn(completions, r.id, iso);
    setRoutineTask(
      routineOccurrenceDrawer(r, iso, done, {
        link: r.link_id ? linkById[r.link_id] : null,
        message: r.message_id ? msgById[r.message_id] : null,
        onToggleDone: () => {
          toggleRoutine.mutate(
            { routineId: r.id, date: iso, makeDone: !done },
            {
              onSuccess: () =>
                toast.success(
                  !done ? "أحسنت! تم إنجاز المهمة" : "تمت الإرجاع للانتظار",
                ),
            },
          );
        },
      }),
    );
  };

  /* ─── أحداث اليوم ─── */
  const sessionsToday = sessions
    .filter((s) => sessionOccursOn(s, today))
    .sort(compareSessions);

  const routinesToday = routines
    .filter((r) => routineOccursOn(r, today))
    .sort((a, b) => timeMinutes(a.time) - timeMinutes(b.time));

  const specialsToday = specials
    .filter((s) => s.status === "active" && s.due_date === today)
    .sort((a, b) => timeMinutes(a.due_time) - timeMinutes(b.due_time));

  const pendingTodayCount =
    sessionsToday.filter((s) => sessionStatus(s, today) === "pending").length +
    routinesToday.filter((r) => !isRoutineDoneOn(completions, r.id, today))
      .length +
    specialsToday.length;

  /* ─── مهمتك الآن: جلسة اليوم ← مهمة خاصة ← روتين اليوم ─── */
  const nextSession = (() => {
    const s = sessionsToday.find((x) => sessionStatus(x, today) !== "ended");
    return s ? { s, iso: today } : null;
  })();
  const upcomingSpecial =
    specials
      .filter((s) => s.status === "active" && s.due_date && s.due_date > today)
      .sort(
        (a, b) =>
          a.due_date!.localeCompare(b.due_date!) ||
          timeMinutes(a.due_time) - timeMinutes(b.due_time),
      )[0] ?? null;
  const nextWeeklySession = useMemo(() => {
    const candidates = sessions
      .map((s) => ({ s, iso: nextSessionDate(s) }))
      .filter(
        (x): x is { s: Session; iso: string } =>
          !!x.iso && x.iso > today && x.s.active,
      )
      .sort((a, b) => a.iso.localeCompare(b.iso));
    return candidates[0] ?? null;
  }, [sessions, today]);

  const currentSession = nextSession ?? nextWeeklySession;
  const currentSpecial = !nextSession ? (specialsToday[0] ?? upcomingSpecial) : null;
  const currentRoutine = !nextSession && !currentSpecial
    ? (routinesToday.find(
        (r) => !isRoutineDoneOn(completions, r.id, today),
      ) ?? null)
    : null;
  const isCurrentLive = !!nextSession;

  /* ─── Timeline اليوم ─── */
  const todayTimeline: TimelineItem[] = [
    ...sessionsToday.map((s) => ({
      id: `s-${s.id}`,
      time: s.start_time,
      title: `${s.activity} — ${s.group_name}`,
      type: "scheduled" as const,
      status: sessionStatus(s, today),
      onClick: () => setOpenSession({ session: s, iso: today }),
    })),
    ...routinesToday.map((r) => ({
      id: `r-${r.id}`,
      time: r.time ?? "—",
      title: r.title,
      type: "routine" as const,
      status: isRoutineDoneOn(completions, r.id, today)
        ? ("done" as const)
        : ("pending" as const),
      onClick: () => routineOpen(r, today),
    })),
    ...specials
      .filter((s) => s.due_date === today && s.status !== "archived")
      .map((s) => ({
        id: `p-${s.id}`,
        time: s.due_time ?? "—",
        title: s.title,
        type: specialTaskType(s),
        status: specialStatusType(s, today),
        onClick: () => setSpecial(specialDrawerOf(s)),
      })),
  ].sort((a, b) => timeMinutes(a.time) - timeMinutes(b.time));

  /* ─── ملخص الروتين (من روتينات المستخدم فقط) ─── */
  const routineSummary = useMemo(
    () =>
      FREQUENCY_ORDER.map((freq) => {
        const list = routines.filter((r) => r.frequency === freq);
        const todayList = list.filter((r) => routineOccursOn(r, today));
        const doneToday = todayList.filter((r) =>
          isRoutineDoneOn(completions, r.id, today),
        ).length;
        const next =
          todayList.find((r) => !isRoutineDoneOn(completions, r.id, today))
            ?.title ?? todayList[0]?.title;
        return { freq, count: list.length, doneToday, todayCount: todayList.length, next };
      }).filter((s) => s.count > 0),
    [routines, completions, today],
  );

  /* ─── شيء مختلف اليوم؟ ─── */
  const differentTasks = specials
    .filter((s) => s.status === "active" && s.due_date !== today)
    .sort(
      (a, b) =>
        (a.due_date ?? "9999").localeCompare(b.due_date ?? "9999") ||
        timeMinutes(a.due_time) - timeMinutes(b.due_time),
    );

  function specialDrawerOf(task: SpecialTask): DrawerTask {
    return specialToDrawer(task, {
      onToggleDone: () => {
        const makeDone = task.status !== "done";
        setStatus.mutate(
          { id: task.id, status: makeDone ? "done" : "active" },
          {
            onSuccess: () =>
              toast.success(
                makeDone ? "أحسنت! تم إنجاز المهمة" : "تمت الإرجاع",
              ),
          },
        );
      },
      onArchive: () => {
        setStatus.mutate(
          { id: task.id, status: "archived" },
          { onSuccess: () => toast.success("تمت الأرشفة") },
        );
        setSpecial(null);
      },
    });
  }

  const currentIso = currentSession
    ? (nextSession ? today : nextWeeklySession!.iso)
    : null;
  const currentMsg = currentSession ? sessionMessage(currentSession.s, messages) : null;

  return (
    <div className="space-y-10">
      {/* ─── الترحيب ─── */}
      <section className="flex items-center gap-5">
        <Owl size={60} className="shrink-0" />
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 sm:text-[28px]">
            {greetingText()}
            {name ? `، ${name}` : ""} 👋
          </h1>
          <p className="mt-1 text-sm font-bold text-slate-400">
            {tasksCountText(pendingTodayCount)} · {WEEKDAY_NAMES[dow]}،{" "}
            {formatArabicDate(today)}
          </p>
        </div>
      </section>

      {/* ─── مهمتك الآن ─── */}
      <section>
        <SectionLabel>مهمتك الآن</SectionLabel>
        {currentSession ? (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-black tracking-wide text-sky-500">
                  {isCurrentLive ? "مهمتك الآن" : "المهمة القادمة"}
                </p>
                <h3 className="mt-1 text-lg font-black leading-snug text-slate-800 sm:text-xl">
                  {currentSession.s.activity}
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-[12px] font-extrabold text-slate-500">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span className="tabular-nums">
                    {sessionTimeText(currentSession.s)}
                  </span>
                </span>
                <TypeChip type="scheduled" />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="flex items-center gap-1.5 rounded-xl bg-violet-50 px-3 py-1.5 text-xs font-extrabold text-violet-700">
                <Users className="h-3.5 w-3.5" />
                الفوج: {currentSession.s.group_name}
              </span>
              <span className="rounded-xl bg-sky-50 px-3 py-1.5 text-xs font-extrabold text-sky-700">
                {WEEKDAY_NAMES[new Date(currentIso ?? today).getDay()] ?? ""} ·{" "}
                {formatArabicDate(currentIso ?? today)}
              </span>
              {currentSession.s.meet_url && (
                <span className="rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-700">
                  رابط الجلسة جاهز ✓
                </span>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              {currentSession.s.meet_url ? (
                <>
                  <Button
                    asChild
                    className="h-10 gap-1.5 rounded-xl bg-sky-500 px-4 text-[13px] font-extrabold text-white hover:bg-sky-600"
                  >
                    <a
                      href={currentSession.s.meet_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      فتح Google Meet
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      const ok = await copyToClipboard(currentSession.s.meet_url!);
                      if (ok) toast.success("تم نسخ رابط الجلسة ✓");
                    }}
                    className="h-10 rounded-xl border-slate-200 px-4 text-[13px] font-extrabold text-slate-600 hover:border-sky-300 hover:text-sky-700"
                  >
                    نسخ الرابط
                  </Button>
                  {currentMsg && (
                    <Button
                      variant="outline"
                      onClick={async () => {
                        const ok = await copyToClipboard(
                          renderSessionMessage(
                            currentMsg.body,
                            currentSession.s,
                            currentIso ?? today,
                          ),
                        );
                        if (ok) toast.success("تم نسخ رسالة الجلسة ✓");
                      }}
                      className="h-10 rounded-xl border-slate-200 px-4 text-[13px] font-extrabold text-slate-600 hover:border-sky-300 hover:text-sky-700"
                    >
                      نسخ رسالة الجلسة
                    </Button>
                  )}
                </>
              ) : (
                <p className="rounded-xl border border-dashed border-amber-300 bg-amber-50/60 px-4 py-2 text-xs font-extrabold text-amber-700">
                  لم يتم ربط رابط بهذه الجلسة — أضفه من إدارة المحتوى
                </p>
              )}
              <button
                onClick={() =>
                  setOpenSession({
                    session: currentSession.s,
                    iso: currentIso ?? today,
                  })
                }
                className="mr-auto flex items-center gap-1 text-xs font-extrabold text-slate-400 transition hover:text-sky-600"
              >
                عرض التفاصيل
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ) : currentSpecial ? (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-black tracking-wide text-sky-500">
                  {specialsToday[0] ? "مهمتك الآن" : "المهمة القادمة"}
                </p>
                <h3 className="mt-1 text-lg font-black leading-snug text-slate-800 sm:text-xl">
                  {currentSpecial.title}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                {currentSpecial.due_time && (
                  <span className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-[12px] font-extrabold text-slate-500">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    {currentSpecial.due_time}
                  </span>
                )}
                <TypeChip type={specialTaskType(currentSpecial)} />
              </div>
            </div>
            {currentSpecial.due_date && (
              <p className="mt-3 text-xs font-extrabold text-slate-400">
                {formatArabicDate(currentSpecial.due_date, { withWeekday: true })}
              </p>
            )}
            {currentSpecial.steps.length > 0 && (
              <div className="mt-5 grid gap-x-10 gap-y-3 sm:grid-cols-2">
                {currentSpecial.steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-6 shrink-0 pt-0.5 text-right text-[13px] font-black tabular-nums text-sky-400">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-semibold leading-relaxed text-slate-600">
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Button
                onClick={() => {
                  const drawer = specialDrawerOf(currentSpecial);
                  drawer.onToggleDone();
                }}
                className="h-10 gap-1.5 rounded-xl bg-sky-500 px-5 text-[13px] font-extrabold text-white hover:bg-sky-600"
              >
                <Check className="h-4 w-4" strokeWidth={3} />
                تم الإنجاز
              </Button>
              <button
                onClick={() => setSpecial(specialDrawerOf(currentSpecial))}
                className="mr-auto flex items-center gap-1 text-xs font-extrabold text-slate-400 transition hover:text-sky-600"
              >
                عرض التفاصيل
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ) : currentRoutine ? (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-black tracking-wide text-sky-500">
                  مهمتك الآن
                </p>
                <h3 className="mt-1 text-lg font-black leading-snug text-slate-800 sm:text-xl">
                  {currentRoutine.title}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                {currentRoutine.time && (
                  <span className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-[12px] font-extrabold tabular-nums text-slate-500">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    {currentRoutine.time}
                  </span>
                )}
                <TypeChip type="routine" />
              </div>
            </div>
            {currentRoutine.description && (
              <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-500">
                {currentRoutine.description}
              </p>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Button
                onClick={() => routineOpen(currentRoutine, today)}
                className="h-10 gap-1.5 rounded-xl bg-sky-500 px-5 text-[13px] font-extrabold text-white hover:bg-sky-600"
              >
                <Check className="h-4 w-4" strokeWidth={3} />
                تنفيذ وإنجاز
              </Button>
              <button
                onClick={() => routineOpen(currentRoutine, today)}
                className="mr-auto flex items-center gap-1 text-xs font-extrabold text-slate-400 transition hover:text-sky-600"
              >
                عرض التفاصيل
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/60 px-6 py-12 text-center">
            <Owl size={68} />
            <p className="mt-3 text-base font-extrabold text-slate-600">
              لا مهام معلقة الآن — كل شيء تحت السيطرة
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-400">
              راجع الجدول أو أنشئ روتينك لتنظيم يومك
            </p>
          </div>
        )}
      </section>

      {/* ─── اليوم ─── */}
      <section>
        <SectionLabel actionTo="/schedule" actionLabel="الجدول الكامل">
          اليوم
        </SectionLabel>
        <div className="rounded-2xl border border-slate-200/80 bg-white px-4 py-2 shadow-soft sm:px-6">
          <Timeline
            items={todayTimeline.slice(0, 6)}
            emptyTitle="لا توجد أحداث اليوم"
          />
        </div>
      </section>

      {/* ─── روتينك (فقط إذا أنشأت روتينات) ─── */}
      {routineSummary.length > 0 && (
        <section>
          <SectionLabel actionTo="/routine">روتينك</SectionLabel>
          <ListContainer>
            {routineSummary.map((s) => (
              <Link
                key={s.freq}
                to="/routine"
                className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-sky-50/40"
              >
                <div className="min-w-0">
                  <p className="text-sm font-black text-slate-800">
                    {FREQUENCY_LABEL[s.freq as Frequency]}
                    <span className="mr-2 text-xs font-bold text-slate-400">
                      {s.count} روتين
                    </span>
                  </p>
                  {s.next && (
                    <p className="mt-0.5 truncate text-xs font-semibold text-slate-400">
                      اليوم: {s.next}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-[11px] font-black tabular-nums text-slate-500">
                    {s.doneToday}/{s.todayCount}
                  </span>
                  <ChevronLeft className="h-4 w-4 text-slate-300" />
                </div>
              </Link>
            ))}
          </ListContainer>
        </section>
      )}

      {/* ─── شيء مختلف اليوم؟ ─── */}
      <section>
        <SectionLabel actionTo="/tasks">شيء مختلف اليوم؟</SectionLabel>
        {differentTasks.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-white/50 px-5 py-6 text-center text-sm font-bold text-slate-400">
            لا توجد مهام خاصة حاليًا.
          </p>
        ) : (
          <ListContainer>
            {differentTasks.slice(0, 4).map((s) => (
              <TaskRow
                key={s.id}
                time={s.due_time ?? "—"}
                title={s.title}
                desc={s.due_date ?? "بدون تاريخ محدد"}
                type={specialTaskType(s)}
                status={specialStatusType(s, today)}
                onClick={() => setSpecial(specialDrawerOf(s))}
              />
            ))}
          </ListContainer>
        )}
      </section>

      {/* ─── Quick Actions ─── */}
      {links.length > 0 && (
        <section>
          <SectionLabel actionTo="/links">إجراءات سريعة</SectionLabel>
          <div className="no-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {links.map((link) => {
              const Icon = iconByName(link.icon);
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex w-44 shrink-0 items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3.5 shadow-soft transition hover:border-sky-300 sm:w-auto"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 transition group-hover:bg-sky-100">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-extrabold text-slate-700">
                      {link.title}
                    </span>
                    {link.description && (
                      <span className="block truncate text-[11px] font-semibold text-slate-400">
                        {link.description}
                      </span>
                    )}
                  </span>
                </a>
              );
            })}
          </div>
        </section>
      )}

      <TaskDrawer task={special} onClose={() => setSpecial(null)} />
      <TaskDrawer task={routineTask} onClose={() => setRoutineTask(null)} />
      <SessionSheet
        session={openSession?.session ?? null}
        iso={openSession?.iso ?? null}
        message={openSession ? sessionMessage(openSession.session, messages) : null}
        onClose={() => setOpenSession(null)}
      />
    </div>
  );
}
