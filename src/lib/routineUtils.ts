import type { DrawerTask } from "@/components/TaskDrawer";
import { addDays, dayRelativeLabel, isoOfDate } from "./time";
import {
  FREQUENCY_LABEL,
  type LinkItem,
  type MessageTemplate,
  type RoutineTask,
} from "./types";

/** هل ينطبق الروتين على هذا التاريخ؟ (القواعد التي حددها المستخدم فقط) */
export function routineOccursOn(r: RoutineTask, iso: string): boolean {
  if (r.status !== "active") return false;
  const d = new Date(
    Number(iso.slice(0, 4)),
    Number(iso.slice(5, 7)) - 1,
    Number(iso.slice(8, 10)),
  );
  if (r.frequency === "daily") return true;
  if (r.frequency === "weekly") return r.weekdays.includes(d.getDay());
  return r.month_day != null && r.month_day === d.getDate();
}

/** المواعيد القادمة للروتين (تواريخ ISO) بدءًا من تاريخ معين */
export function nextRoutineDates(
  r: RoutineTask,
  count = 8,
  from?: Date,
): string[] {
  const base = from ?? new Date();
  const out: string[] = [];
  for (let i = 0; i < 62 && out.length < count; i++) {
    const iso = isoOfDate(addDays(base, i));
    if (routineOccursOn(r, iso)) out.push(iso);
  }
  return out;
}

/** وصف تكرار الروتين بالعربية */
export function routineRecurrenceText(r: RoutineTask): string {
  if (r.frequency === "daily") return "كل يوم";
  if (r.frequency === "weekly") {
    const names = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    const days = [6, 0, 1, 2, 3, 4, 5]
      .filter((d) => r.weekdays.includes(d))
      .map((d) => names[d]);
    return days.length ? `أسبوعيًا · ${days.join("، ")}` : "أسبوعيًا";
  }
  return r.month_day != null ? `شهريًا · يوم ${r.month_day}` : "شهريًا";
}

/** بناء مهمة Drawer لموعد روتين محدد */
export function routineOccurrenceDrawer(
  r: RoutineTask,
  iso: string,
  done: boolean,
  opts: {
    link?: LinkItem | null;
    message?: MessageTemplate | null;
    onToggleDone: () => void;
  },
): DrawerTask {
  return {
    key: `routine:${r.id}:${iso}`,
    title: r.title,
    timeText: `${dayRelativeLabel(iso)}${r.time ? ` · ${r.time}` : ""}`,
    recurrenceNote: `روتين ${FREQUENCY_LABEL[r.frequency]}`,
    type: "routine",
    status: done ? "done" : "pending",
    desc: r.description,
    steps: r.steps,
    notes: r.notes,
    link: opts.link ? { title: opts.link.title, url: opts.link.url } : null,
    message: opts.message
      ? { title: opts.message.title, body: opts.message.body }
      : null,
    done,
    onToggleDone: opts.onToggleDone,
  };
}
