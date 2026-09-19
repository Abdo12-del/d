import type { DrawerTask } from "@/components/TaskDrawer";
import { dayRelativeLabel, todayISO } from "./time";
import {
  specialStatusType,
  specialTaskType,
  type SpecialTask,
} from "./types";

export function specialToDrawer(
  task: SpecialTask,
  opts: {
    onToggleDone: () => void;
    onArchive?: () => void;
  },
): DrawerTask {
  return {
    key: `special:${task.id}`,
    title: task.title,
    timeText: task.due_date
      ? `${dayRelativeLabel(task.due_date)}${task.due_time ? ` · ${task.due_time}` : ""}`
      : "بدون تاريخ محدد",
    type: specialTaskType(task),
    status: specialStatusType(task, todayISO()),
    steps: task.steps,
    notes: task.notes,
    link: null,
    message: null,
    done: task.status === "done",
    canArchive: true,
    onToggleDone: opts.onToggleDone,
    onArchive: opts.onArchive,
  };
}
