<<<<<<< HEAD
import { useState } from "react";
import { toast } from "sonner";
import SessionSheet from "@/components/SessionSheet";
import TaskDrawer, { type DrawerTask } from "@/components/TaskDrawer";
import TaskRow from "@/components/TaskRow";
import {
  EmptyState,
  ListContainer,
  LoadingRows,
  PageHeader,
  SegmentedControl,
} from "@/components/shared";
import {
  isRoutineDoneOn,
  useCompletions,
  useMessages,
  useRoutineTasks,
  useSessions,
=======
import { useMemo, useState } from "react";
import { Check, ListChecks } from "lucide-react";
import { Link } from "react-router-dom";
import DayTimeline, { type TimelineEntry } from "@/components/DayTimeline";
import NowCard from "@/components/NowCard";
import TaskDrawer, { type DrawerTask } from "@/components/TaskDrawer";
import { EmptyState, PageHeader, SectionTitle } from "@/components/shared";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  isTaskDone,
  useCompletions,
  useRoutineTasks,
  useScheduleItems,
>>>>>>> c683bf5f3d8ed3a7fc6b1bf2ec146ec0c53ce734
  useSetSpecialStatus,
  useSpecialTasks,
  useToggleRoutineDone,
} from "@/lib/hooks";
<<<<<<< HEAD
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
} from "@/lib/sessionUtils";
import { addDays, isoOfDate, timeMinutes, todayISO } from "@/lib/time";
import {
  specialStatusType,
  specialTaskType,
  type Session,
  type SpecialTask,
  type StatusType,
  type TaskType,
} from "@/lib/types";

type Tab = "today" | "upcoming" | "done" | "special";

interface Row {
  key: string;
  time?: string;
  title: string;
  desc?: string;
  type: TaskType;
  status: StatusType;
  onClick: () => void;
}

function sortSpecials(a: SpecialTask, b: SpecialTask) {
  if (a.due_date && b.due_date) {
    return (
      a.due_date.localeCompare(b.due_date) ||
      timeMinutes(a.due_time) - timeMinutes(b.due_time)
    );
  }
  if (a.due_date) return -1;
  if (b.due_date) return 1;
  return 0;
}

export default function Tasks() {
  const [tab, setTab] = useState<Tab>("today");
  const [special, setSpecial] = useState<DrawerTask | null>(null);
  const [routineTask, setRoutineTask] = useState<DrawerTask | null>(null);
  const [openSession, setOpenSession] = useState<{
    session: Session;
    iso: string;
  } | null>(null);

  const { data: specials = [], isLoading } = useSpecialTasks();
  const { data: sessions = [] } = useSessions();
  const { data: routines = [] } = useRoutineTasks();
  const { data: completions = [] } = useCompletions();
  const { data: messages = [] } = useMessages();
  const toggleRoutine = useToggleRoutineDone();
  const setStatus = useSetSpecialStatus();

  const today = todayISO();

  const openSpecialDrawer = (task: SpecialTask) => {
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

  const openRoutineOccurrence = (
    r: (typeof routines)[number],
    iso: string,
  ) => {
    const done = isRoutineDoneOn(completions, r.id, iso);
    setRoutineTask(
      routineOccurrenceDrawer(r, iso, done, {
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

  /* ─── اليوم: جلسات + روتين اليوم + مهام خاصة ─── */
  const sessionsToday = sessions
    .filter((s) => sessionOccursOn(s, today))
    .sort(compareSessions);

  const routinesToday = routines
    .filter((r) => routineOccursOn(r, today))
    .sort((a, b) => timeMinutes(a.time) - timeMinutes(b.time));

  const todayRows: Row[] = [
    ...sessionsToday.map((s) => ({
      key: `s-${s.id}`,
      time: s.start_time,
      title: `${s.activity} — ${s.group_name}`,
      desc: "جلسة مجدولة · الفوج " + s.group_name,
      type: "scheduled" as const,
      status: sessionStatus(s, today),
      onClick: () => setOpenSession({ session: s, iso: today }),
    })),
    ...routinesToday.map((r) => ({
      key: `r-${r.id}`,
      time: r.time ?? "—",
      title: r.title,
      desc: "روتين متكرر",
      type: "routine" as const,
      status: isRoutineDoneOn(completions, r.id, today)
        ? ("done" as const)
        : ("pending" as const),
      onClick: () => openRoutineOccurrence(r, today),
    })),
    ...specials
      .filter((s) => s.due_date === today && s.status !== "archived")
      .map((s) => ({
        key: `p-${s.id}`,
        time: s.due_time ?? "—",
        title: s.title,
        desc: "مهمة خاصة اليوم",
        type: specialTaskType(s),
        status: specialStatusType(s, today),
        onClick: () => openSpecialDrawer(s),
      })),
  ].sort((a, b) => timeMinutes(a.time) - timeMinutes(b.time));

  /* ─── القادمة: 7 أيام القادمة (جلسات + روتين) + مهام مؤرخة ─── */
  const upcomingDays = Array.from({ length: 7 }, (_, i) =>
    isoOfDate(addDays(new Date(), i + 1)),
  );

  const upcomingRows: Row[] = [
    ...upcomingDays.flatMap((iso) => [
      ...sessions
        .filter((s) => sessionOccursOn(s, iso))
        .sort(compareSessions)
        .map((s) => ({
          key: `u-${iso}-s-${s.id}`,
          time: s.start_time,
          title: `${s.activity} — ${s.group_name}`,
          desc: iso,
          type: "scheduled" as const,
          status: sessionStatus(s, iso),
          onClick: () => setOpenSession({ session: s, iso }),
        })),
      ...routines
        .filter((r) => routineOccursOn(r, iso))
        .sort((a, b) => timeMinutes(a.time) - timeMinutes(b.time))
        .map((r) => ({
          key: `u-${iso}-r-${r.id}`,
          time: r.time ?? "—",
          title: r.title,
          desc: iso,
          type: "routine" as const,
          status: ("pending" as const) satisfies StatusType,
          onClick: () => openRoutineOccurrence(r, iso),
        })),
    ]),
    ...specials
      .filter((s) => s.status === "active" && s.due_date && s.due_date > today)
      .sort(sortSpecials)
      .map((s) => ({
        key: `u-${s.id}`,
        time: s.due_time ?? "—",
        title: s.title,
        desc: s.due_date!,
        type: specialTaskType(s),
        status: specialStatusType(s, today),
        onClick: () => openSpecialDrawer(s),
      })),
  ];

  /* ─── المكتملة: مهام خاصة منجزة + مهام روتين أنجزت اليوم ─── */
  const routineById = Object.fromEntries(routines.map((r) => [r.id, r]));

  const doneRows: Row[] = [
    ...specials
      .filter((s) => s.status === "done")
      .map((s) => ({
        key: `d-${s.id}`,
        time: s.due_time ?? "—",
        title: s.title,
        desc: s.due_date ?? "",
        type: specialTaskType(s),
        status: "done" as StatusType,
        onClick: () => openSpecialDrawer(s),
      })),
    ...completions
      .filter(
        (c) =>
          c.completed_date === today && c.task_key.startsWith("routine:"),
      )
      .map((c): Row | null => {
        const id = c.task_key.split(":")[1];
        const r = routineById[id];
        if (!r) return null;
        return {
          key: `dr-${id}`,
          time: r.time ?? undefined,
          title: r.title,
          desc: "روتين — أُنجز اليوم",
          type: "routine" as const,
          status: "done" as StatusType,
          onClick: () => openRoutineOccurrence(r, today),
        };
      })
      .filter((r): r is Row => r !== null),
  ];

  /* ─── الخاصة ─── */
  const specialRows: Row[] = specials
    .filter((s) => s.status === "active")
    .sort(sortSpecials)
    .map((s) => ({
      key: `sp-${s.id}`,
      time: s.due_time ?? "—",
      title: s.title,
      desc: s.due_date ?? "بدون تاريخ محدد",
      type: specialTaskType(s),
      status: specialStatusType(s, today),
      onClick: () => openSpecialDrawer(s),
    }));

  const tabs: { value: Tab; label: string; badge: number; rows: Row[] }[] = [
    { value: "today", label: "اليوم", badge: todayRows.length, rows: todayRows },
    {
      value: "upcoming",
      label: "القادمة",
      badge: upcomingRows.length,
      rows: upcomingRows,
    },
    { value: "done", label: "المكتملة", badge: doneRows.length, rows: doneRows },
    {
      value: "special",
      label: "الخاصة",
      badge: specialRows.length,
      rows: specialRows,
    },
  ];

  const activeTab = tabs.find((t) => t.value === tab)!;

  return (
    <div className="space-y-5">
      <PageHeader
        title="المهام"
        desc="ما المهام التي يجب تنفيذها؟ اضغط أي مهمة لفتح تفاصيلها وإجراءاتها."
      />

      <SegmentedControl
        value={tab}
        onChange={setTab}
        options={tabs.map((t) => ({
          value: t.value,
          label: t.label,
          badge: t.badge,
        }))}
      />

      {isLoading ? (
        <LoadingRows />
      ) : activeTab.rows.length === 0 ? (
        <EmptyState
          title={
            tab === "today"
              ? "لا توجد مهام اليوم"
              : tab === "upcoming"
                ? "لا توجد مهام قادمة"
                : tab === "done"
                  ? "لا توجد مهام مكتملة بعد"
                  : "لا توجد مهام خاصة حاليًا"
          }
          hint={
            tab === "today" || tab === "upcoming"
              ? "أضف جلسات أو أنشئ روتينًا ليتولّد تلقائيًا"
              : tab === "special"
                ? "المهام الاستثنائية تُضاف من صفحة إدارة المحتوى"
                : undefined
          }
        />
      ) : (
        <ListContainer>
          {activeTab.rows.map((row) => (
            <TaskRow
              key={row.key}
              time={row.time}
              title={row.title}
              desc={row.desc}
              type={row.type}
              status={row.status}
              onClick={row.onClick}
            />
          ))}
        </ListContainer>
      )}

      <TaskDrawer task={special} onClose={() => setSpecial(null)} />
      <TaskDrawer task={routineTask} onClose={() => setRoutineTask(null)} />
      <SessionSheet
        session={openSession?.session ?? null}
        iso={openSession?.iso ?? null}
        message={
          openSession ? sessionMessage(openSession.session, messages) : null
        }
        onClose={() => setOpenSession(null)}
      />
=======
import {
  formatArabicDate,
  nowMinutes,
  timeMinutes,
  todayISO,
  todayWeekday,
  WEEKDAY_NAMES,
} from "@/lib/time";
import { scheduleForDay } from "@/lib/commands";

/** صفحة «المهام» — كل ما يخص اليوم فقط: الآن، الخط الزمني، وقائمة اليومية */
export default function Tasks() {
  const { data: specials = [] } = useSpecialTasks();
  const { data: schedule = [] } = useScheduleItems();
  const { data: routines = [] } = useRoutineTasks();
  const { data: completions = [] } = useCompletions();
  const toggleDone = useToggleRoutineDone();
  const setStatus = useSetSpecialStatus();

  const [drawerTask, setDrawerTask] = useState<DrawerTask | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const today = todayISO();
  const dow = todayWeekday();

  const timeline: TimelineEntry[] = useMemo(
    () => [
      ...scheduleForDay(schedule, dow).map((i) => ({
        id: i.id,
        time: i.time,
        title: i.title,
        kind: "routine" as const,
        past: timeMinutes(i.time) < nowMinutes(),
      })),
      ...specials
        .filter((s) => s.status === "active" && s.due_date === today)
        .map((s) => ({
          id: s.id,
          time: s.due_time ?? "—",
          title: s.title,
          kind: "special" as const,
          isSpecial: true,
          past: !!s.due_time && timeMinutes(s.due_time) < nowMinutes(),
        })),
    ].sort((a, b) => timeMinutes(a.time) - timeMinutes(b.time)),
    [schedule, specials, dow, today],
  );

  const daily = routines.filter((r) => r.frequency === "daily");
  const dailyDone = daily.filter((r) => isTaskDone(completions, r.id, r.frequency)).length;

  return (
    <div className="space-y-7">

      <PageHeader
        icon={ListChecks}
        title="مهام اليوم"
        desc={`${WEEKDAY_NAMES[dow]}، ${formatArabicDate(today)} — كل ما يُنتظر منك اليوم في مكان واحد.`}
      />

      <NowCard />

      <section>
        <SectionTitle
          emoji="◷"
          title="الخط الزمني لليوم"
          desc="المحطات بالترتيب — المعتاد 🔄 والخاص ⭐"
          actionTo="/schedule"
          actionLabel="الجدول الأسبوعي"
        />
        <DayTimeline
          entries={timeline}
          onOpen={(entry) => {
            setDrawerTask({
              kind: entry.isSpecial ? "special" : "scheduled",
              id: entry.id,
              title: entry.title,
              time: entry.time,
              date: today,
              steps: [],
              done: entry.past,
            });
            setDrawerOpen(true);
          }}
        />
      </section>

      <section>
        <SectionTitle
          emoji="✓"
          title="قائمة اليومية"
          desc="علّم على ما تنجزه — البومة تتابع معك"
          actionTo="/routine"
          actionLabel="كل الروتين"
        />
        {daily.length === 0 ? (
          <EmptyState
            title="لا مهام يومية بعد"
            hint="أضفها من صفحة الإدارة ليبدأ عدّاد إنجازك"
          />
        ) : (
          <>
            <div className="card-soft mb-3 flex items-center gap-3 p-3.5">
              <Progress
                value={(dailyDone / daily.length) * 100}
                className="h-2.5 flex-1 bg-slate-100"
              />
              <span className="font-display text-xs font-extrabold text-emerald-600">
                {dailyDone} / {daily.length}
              </span>
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {daily.map((task) => {
                const done = isTaskDone(completions, task.id, task.frequency);
                return (
                  <button
                    key={task.id}
                    onClick={() => toggleDone.mutate({ task, makeDone: !done })}
                    className={cn(
                      "press flex items-center gap-3 rounded-2xl border bg-white p-3.5 text-right shadow-soft-sm transition hover:bg-sky-50/40",
                      done ? "border-emerald-200 bg-emerald-50/40" : "border-sky-100",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition",
                        done
                          ? "animate-check-pop bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-soft-sm"
                          : "border-2 border-dashed border-sky-200 text-transparent",
                      )}
                    >
                      <Check className="h-4 w-4" strokeWidth={3.5} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          "block truncate font-display text-sm font-extrabold",
                          done ? "text-emerald-700 line-through decoration-emerald-300" : "text-sky-950",
                        )}
                      >
                        {task.title}
                      </span>
                      {task.when_note && (
                        <span className="block truncate text-[11px] font-semibold text-slate-400">
                          {task.when_note}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </section>

      <TaskDrawer
        task={drawerTask}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onComplete={(task) => {
          if (task.kind === "special") {
            setStatus.mutate({ id: task.id, status: "done" });
          }
          setDrawerOpen(false);
        }}
      />

      <p className="pb-2 text-center text-[11px] font-bold text-slate-300">
        NG Academy — مركز مهام المساعد
      </p>
>>>>>>> c683bf5f3d8ed3a7fc6b1bf2ec146ec0c53ce734
    </div>
  );
}
