export type Frequency = "daily" | "weekly" | "monthly";
export type SpecialStatus = "active" | "done" | "archived";
export type MessageCategory =
  | "sessions"
  | "parents"
  | "registration"
  | "reminder"
  | "followup"
  | "other";
export type TaskType = "routine" | "scheduled" | "special";
export type StatusType = "pending" | "running" | "done" | "overdue" | "ended";

/** جلسة مرتبطة بفوج ونشاط ورابط Meet خاص بها */
export interface Session {
  id: string;
  group_name: string;
  activity: string;
  /** 0-6 (الأحد=0) للجلسات الأسبوعية المتكررة */
  weekday: number | null;
  /** تاريخ محدد للجلسات لمرة واحدة */
  date: string | null;
  start_time: string;
  end_time: string | null;
  meet_url: string | null;
  message_id: string | null;
  active: boolean;
  sort_order: number;
}

export type RoutineStatus = "active" | "paused";

/** الروتين = قالب مهمة متكررة يُنشئه المستخدم، والمهام تتولد عنه تلقائيًا */
export interface RoutineTask {
  id: string;
  title: string;
  description: string | null;
  frequency: Frequency;
  /** للأسبوعي: أيام الأسبوع 0-6 */
  weekdays: number[];
  /** للشهري: رقم اليوم من الشهر 1-31 */
  month_day: number | null;
  /** الوقت المقترح HH:MM */
  time: string | null;
  /** المسؤول عن التنفيذ */
  owner: string | null;
  steps: string[];
  notes: string | null;
  link_id: string | null;
  message_id: string | null;
  status: RoutineStatus;
  sort_order: number;
}

export interface SpecialTask {
  id: string;
  title: string;
  due_date: string | null;
  due_time: string | null;
  steps: string[];
  notes: string | null;
  status: SpecialStatus;
  link_id: string | null;
  message_id: string | null;
  sort_order: number;
}

export interface ScheduleItem {
  id: string;
  title: string;
  time: string;
  weekdays: number[];
  sort_order: number;
}

export type LinkCategory = "sessions" | "communication" | "files" | "admin";

export interface LinkItem {
  id: string;
  title: string;
  description: string | null;
  url: string;
  icon: string;
  category: LinkCategory;
  sort_order: number;
}

export interface MessageTemplate {
  id: string;
  title: string;
  category: MessageCategory;
  body: string;
  sort_order: number;
}

export interface Instruction {
  id: string;
  content: string;
  important: boolean;
  sort_order: number;
}

export interface GuideSection {
  heading: string;
  steps: string[];
}

export interface Guide {
  id: string;
  title: string;
  icon: string;
  sections: GuideSection[];
  sort_order: number;
}

export interface Issue {
  id: string;
  problem: string;
  steps: string[];
  sort_order: number;
}

export type FileCategory =
  | "sessions"
  | "activities"
  | "announcements"
  | "forms"
  | "other";

export type FileType = "pdf" | "doc" | "sheet" | "image" | "slides" | "link";

export interface FileItem {
  id: string;
  name: string;
  category: FileCategory;
  file_type: FileType;
  url: string;
  updated_at: string;
  sort_order: number;
}

export interface Completion {
  id: string;
  task_key: string;
  completed_date: string;
}

/* ─── التسميات ─── */

export const FREQUENCY_ORDER: Frequency[] = ["daily", "weekly", "monthly"];

export const FREQUENCY_LABEL: Record<Frequency, string> = {
  daily: "يوميًا",
  weekly: "أسبوعيًا",
  monthly: "شهريًا",
};

export const FREQUENCY_STYLE: Record<Frequency, string> = {
  daily: "bg-gradient-to-br from-sky-500 to-cyan-500",
  weekly: "bg-gradient-to-br from-violet-500 to-purple-500",
  monthly: "bg-gradient-to-br from-amber-500 to-orange-500",
};
export const SPECIAL_STATUS_LABEL: Record<SpecialStatus, string> = {
  active: "نشطة",
  done: "منجزة",
  archived: "مؤرشفة",
};

export const ROUTINE_STATUS_LABEL: Record<RoutineStatus, string> = {
  active: "نشط",
  paused: "متوقف",
};

export const TASK_TYPE_LABEL: Record<TaskType, string> = {
  routine: "روتينية",
  scheduled: "مجدولة",
  special: "استثنائية",
};

/** نقطة ملونة بجانب النوع — لون واحد أساسي + Accent محدود */
export const TASK_TYPE_DOT: Record<TaskType, string> = {
  routine: "bg-sky-500",
  scheduled: "bg-violet-500",
  special: "bg-amber-500",
};

export const TASK_TYPE_TEXT: Record<TaskType, string> = {
  routine: "text-sky-700",
  scheduled: "text-violet-700",
  special: "text-amber-700",
};

export const STATUS_LABEL: Record<StatusType, string> = {
  pending: "قادمة",
  running: "جارية الآن",
  done: "مكتملة",
  overdue: "متأخرة",
  ended: "منتهية",
};

export const STATUS_STYLE: Record<StatusType, string> = {
  pending: "text-slate-400",
  running: "text-emerald-600",
  done: "text-emerald-600",
  overdue: "text-rose-500",
  ended: "text-slate-300",
};

export const MESSAGE_CATEGORIES: MessageCategory[] = [
  "sessions",
  "parents",
  "registration",
  "reminder",
  "followup",
  "other",
];

export const CATEGORY_LABEL: Record<MessageCategory, string> = {
  sessions: "الجلسات",
  parents: "الأولياء",
  registration: "التسجيل",
  reminder: "التذكير",
  followup: "المتابعة",
  other: "أخرى",
};

<<<<<<< HEAD
export const LINK_CATEGORIES: LinkCategory[] = [
  "sessions",
  "communication",
  "files",
  "admin",
];

export const LINK_CATEGORY_LABEL: Record<LinkCategory, string> = {
  sessions: "الجلسات",
  communication: "التواصل",
  files: "الملفات",
  admin: "الإدارة",
=======
export const CATEGORY_STYLE: Record<MessageCategory, string> = {
  sessions: "bg-sky-50 text-sky-700 ring-sky-200",
  parents: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  registration: "bg-violet-50 text-violet-700 ring-violet-200",
  reminder: "bg-amber-50 text-amber-700 ring-amber-200",
  followup: "bg-cyan-50 text-cyan-700 ring-cyan-200",
  other: "bg-slate-50 text-slate-600 ring-slate-200",
>>>>>>> c683bf5f3d8ed3a7fc6b1bf2ec146ec0c53ce734
};

export const FILE_CATEGORIES: FileCategory[] = [
  "sessions",
  "activities",
  "announcements",
  "forms",
  "other",
];

export const FILE_CATEGORY_LABEL: Record<FileCategory, string> = {
  sessions: "الجلسات",
  activities: "الأنشطة",
  announcements: "الإعلانات",
  forms: "النماذج",
  other: "أخرى",
};

<<<<<<< HEAD
export const FILE_TYPE_LABEL: Record<FileType, string> = {
  pdf: "PDF",
  doc: "مستند",
  sheet: "جدول",
  image: "صورة",
  slides: "عرض",
  link: "رابط",
=======
export const TASK_TYPE_STYLE: Record<TaskType, string> = {
  routine: "bg-sky-50 text-sky-700 ring-sky-200",
  scheduled: "bg-cyan-50 text-cyan-700 ring-cyan-200",
  special: "bg-violet-50 text-violet-700 ring-violet-200",
>>>>>>> c683bf5f3d8ed3a7fc6b1bf2ec146ec0c53ce734
};

export function specialTaskType(task: SpecialTask): TaskType {
  return task.due_date ? "scheduled" : "special";
}

export function specialStatusType(task: SpecialTask, todayIso: string): StatusType {
  if (task.status === "done") return "done";
  if (task.status === "active" && task.due_date && task.due_date < todayIso)
    return "overdue";
  return "pending";
}
