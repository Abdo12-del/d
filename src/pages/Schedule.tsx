import { useState } from "react";
import { toast } from "sonner";
import SessionSheet from "@/components/SessionSheet";
import TaskDrawer, { type DrawerTask } from "@/components/TaskDrawer";
import Timeline, { type TimelineItem } from "@/components/Timeline";
import {
  PageHeader,
  SegmentedControl,
  TypeChip,
} from "@/components/shared";
import {
  isRoutineDoneOn,
  useCompletions,
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
  sessionMessage,
  sessionOccursOn,
  sessionStatus,
  sessionTimeText,
} from "@/lib/sessionUtils";
import {
  addDays,
  formatArabicDate,
  isoOfDate,
  timeMinutes,
  todayISO,
  todayWeekday,
  WEEKDAY_NAMES,
  weekStart,
} from "@/lib/time";
import {
  specialStatusType,
  specialTaskType,
  type Session,
  type SpecialTask,
} from "@/lib/types";
import { cn } from "@/lib/utils";

type View = "today" | "week" | "month";

export default function Schedule() {
  const [view, setView] = useState<View>("today");
  const [openSession, setOpenSession] = useState<{
    session: Session;
    iso: string;
  } | null>(null);
  const [special, setSpecial] = useState<DrawerTask | null>(null);
  const [routineTask, setRoutineTask] = useState<DrawerTask | null>(null);

  const { data: sessions = [] } = useSessions();
  const { data: specials = [] } = useSpecialTasks();
  const { data: routines = [] } = useRoutineTasks();
  const { data: completions = [] } = useCompletions();
  const { data: messages = [] } = useMessages();
  const setStatus = useSetSpecialStatus();
  const toggleRoutine = useToggleRoutineDone();

  const today = todayISO();
  const dow = todayWeekday();

  const openSpecial = (task: SpecialTask) => {
    setSpecial(
      specialToDrawer(task, {
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
      }),
    );
  };

  const entriesForDate = (iso: string): TimelineItem[] => [
    ...sessions
      .filter((s) => sessionOccursOn(s, iso))
      .sort(compareSessions)
      .map((s) => ({
        id: `s-${s.id}`,
        time: s.start_time,
        title: `${s.activity} — ${s.group_name}`,
        type: "scheduled" as const,
        status: sessionStatus(s, iso),
        onClick: () => setOpenSession({ session: s, iso }),
      })),
    ...routines
      .filter((r) => routineOccursOn(r, iso))
      .sort((a, b) => timeMinutes(a.time) - timeMinutes(b.time))
      .map((r) => ({
        id: `r-${r.id}`,
        time: r.time ?? "—",
        title: r.title,
        type: "routine" as const,
        status: isRoutineDoneOn(completions, r.id, iso)
          ? ("done" as const)
          : ("pending" as const),
        onClick: () => {
          const done = isRoutineDoneOn(completions, r.id, iso);
          setRoutineTask(
            routineOccurrenceDrawer(r, iso, done, {
              onToggleDone: () => {
                toggleRoutine.mutate(
                  { routineId: r.id, date: iso, makeDone: !done },
                  {
                    onSuccess: () =>
                      toast.success(
                        !done
                          ? "أحسنت! تم إنجاز المهمة"
                          : "تمت الإرجاع للانتظار",
                      ),
                  },
                );
              },
            }),
          );
        },
      })),
    ...specials
      .filter((s) => s.due_date === iso && s.status !== "archived")
      .map((s) => ({
        id: `p-${s.id}`,
        time: s.due_time ?? "—",
        title: s.title,
        type: specialTaskType(s),
        status: specialStatusType(s, iso),
        onClick: () => openSpecial(s),
      })),
    ].sort((a, b) => timeMinutes(a.time) - timeMinutes(b.time));

  const start = weekStart(new Date());
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(start, i));

  const monthPrefix = today.slice(0, 7);
  const monthDated = [
    ...sessions
      .filter((s) => s.date && s.date.startsWith(monthPrefix))
      .map((s) => ({ kind: "session" as const, s, iso: s.date! })),
    ...specials
      .filter(
        (s) =>
          s.due_date &&
          s.due_date.startsWith(monthPrefix) &&
          s.status !== "archived",
      )
      .map((s) => ({ kind: "special" as const, s, iso: s.due_date! })),
  ].sort((a, b) => a.iso.localeCompare(b.iso));

  const recurringSessions = sessions
    .filter((s) => s.active && s.weekday != null)
    .sort(compareSessions);

  return (
    <div className="space-y-6">

      <PageHeader
        title="الجدول الزمني"
        desc="متى أفعل الأشياء؟ جلساتك ومهامك مرتبة زمنيًا — كل جلسة برابطها الخاص."
      />

      <SegmentedControl
        value={view}
        onChange={setView}
        options={[
          { value: "today", label: "اليوم" },
          { value: "week", label: "هذا الأسبوع" },
          { value: "month", label: "هذا الشهر" },
        ]}
      />

      {view === "today" && (
        <>
          <p className="text-xs font-extrabold text-slate-400">
            {WEEKDAY_NAMES[dow]}، {formatArabicDate(today, { withYear: true })}
          </p>
          <div className="rounded-2xl border border-slate-200/80 bg-white px-4 py-2 shadow-soft sm:px-6">
            <Timeline
              items={entriesForDate(today)}
              emptyTitle="لا توجد جلسات مجدولة اليوم"
            />
          </div>
        </>
      )}

      {view === "week" && (
        <div className="space-y-6">
          {weekDays.map((day) => {
            const iso = isoOfDate(day);
            const entries = entriesForDate(iso);
            const isToday = iso === today;
            return (
              <section key={iso}>
                <div className="mb-2.5 flex items-center gap-2.5 px-1">
                  <h3
                    className={cn(
                      "text-sm font-black",
                      isToday ? "text-sky-600" : "text-slate-600",
                    )}
                  >
                    {WEEKDAY_NAMES[day.getDay()]}
                  </h3>
                  <span className="text-[11px] font-bold text-slate-400">
                    {formatArabicDate(iso)}
                  </span>
                  {isToday && (
                    <span className="rounded-md bg-sky-500 px-1.5 py-0.5 text-[10px] font-black text-white">
                      اليوم
                    </span>
                  )}
                </div>
                <div
                  className={cn(
                    "rounded-2xl border px-4 py-2 sm:px-6",
                    entries.length
                      ? "border-slate-200/80 bg-white shadow-soft"
                      : "border-dashed border-slate-200/70 bg-white/40",
                  )}
                >
                  <Timeline
                    items={entries}
                    emptyTitle="لا جلسات في هذا اليوم"
                  />
                </div>
              </section>
            );
          })}
        </div>
      )}

      {view === "month" && (
        <div className="space-y-6">
          <section>
            <h3 className="mb-2.5 px-1 text-sm font-black text-slate-600">
              مواعيد هذا الشهر
            </h3>
            <div className="rounded-2xl border border-slate-200/80 bg-white px-4 py-2 shadow-soft sm:px-6">
              <Timeline
                items={monthDated.map((x) =>
                  x.kind === "session"
                    ? {
                        id: `s-${x.s.id}`,
                        time: x.s.start_time,
                        title: `${x.s.activity} — ${x.s.group_name}`,
                        type: "scheduled" as const,
                        status: sessionStatus(x.s, x.iso),
                        onClick: () =>
                          setOpenSession({ session: x.s, iso: x.iso }),
                      }
                    : {
                        id: `p-${x.s.id}`,
                        time: x.s.due_time ?? "—",
                        title: x.s.title,
                        type: specialTaskType(x.s),
                        status: specialStatusType(x.s, today),
                        onClick: () => openSpecial(x.s),
                      },
                )}
                emptyTitle="لا مواعيد محددة بهذا الشهر"
              />
            </div>
          </section>

          {recurringSessions.length > 0 && (
            <section>
              <h3 className="mb-2.5 px-1 text-sm font-black text-slate-600">
                جلسات تتكرر أسبوعيًا
              </h3>
              <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft">
                <div className="divide-y divide-slate-100">
                  {recurringSessions.map((s) => (
                    <button
                      key={s.id}
                      onClick={() =>
                        setOpenSession({
                          session: s,
                          iso: nextDateOf(s.weekday!),
                        })
                      }
                      className="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-right transition hover:bg-sky-50/40"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-[13px] font-black tabular-nums text-slate-700">
                          {sessionTimeText(s)}
                        </span>
                        <span className="text-sm font-extrabold text-slate-700">
                          {s.activity} — {s.group_name}
                        </span>
                      </div>
                      <span className="flex items-center gap-3">
                        <TypeChip type="scheduled" />
                        <span className="text-[11px] font-extrabold text-slate-300">
                          كل {WEEKDAY_NAMES[s.weekday!]}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      )}

      <SessionSheet
        session={openSession?.session ?? null}
        iso={openSession?.iso ?? null}
        message={
          openSession ? sessionMessage(openSession.session, messages) : null
        }
        onClose={() => setOpenSession(null)}
      />
      <TaskDrawer task={special} onClose={() => setSpecial(null)} />
      <TaskDrawer task={routineTask} onClose={() => setRoutineTask(null)} />
    </div>
  );
}

function nextDateOf(weekday: number): string {
  const today = new Date();
  for (let i = 0; i < 8; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() === weekday) {
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    }
  }
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}
