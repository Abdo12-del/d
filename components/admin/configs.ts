import { QUERY_KEYS, TABLES } from "@/lib/data";
import { ICON_KEYS } from "@/lib/icons";
import {
  CATEGORY_LABEL,
  FILE_CATEGORY_LABEL,
  FILE_CATEGORIES,
  FILE_TYPE_LABEL,
  LINK_CATEGORIES,
  LINK_CATEGORY_LABEL,
  MESSAGE_CATEGORIES,
  SPECIAL_STATUS_LABEL,
  type FileCategory,
  type FileType,
  type LinkCategory,
  type MessageCategory,
  type SpecialStatus,
} from "@/lib/types";
import { WEEKDAY_NAMES } from "@/lib/time";

export type FieldType =
  | "text"
  | "textarea"
  | "steps"
  | "select"
  | "switch"
  | "date"
  | "time"
  | "weekdays"
  | "sections"
  | "url"
  | "message-select";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Row = Record<string, any>;

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  placeholder?: string;
  hint?: string;
  required?: boolean;
  /** تحويل القيمة إلى رقم صحيح عند الحفظ (لحقول اليوم الأسبوعي) */
  coerceInt?: boolean;
}

export interface ResourceConfig {
  key: string;
  label: string;
  emoji: string;
  table: string;
  queryKey: readonly unknown[];
  singular: string;
  fields: FieldDef[];
  defaults: Row;
  rowTitle: (row: Row) => string;
  rowSubtitle?: (row: Row) => string | null;
  rowBadge?: (row: Row) => string | null;
  badgeClass?: (row: Row) => string;
}

const iconOptions = ICON_KEYS.map((k) => ({ value: k, label: k }));
const guideIconOptions = [
  "book-open",
  "video",
  "message-circle",
  "list-checks",
  "clipboard-list",
  "sparkles",
  "star",
].map((k) => ({ value: k, label: k }));

export const RESOURCES: Record<string, ResourceConfig> = {
<<<<<<< HEAD
=======
  routine: {
    key: "routine",
    label: "المهام المعتادة",
    emoji: "🔄",
    table: TABLES.routine,
    queryKey: QUERY_KEYS.routine,
    singular: "مهمة معتادة",
    fields: [
      { key: "title", label: "اسم المهمة", type: "text", required: true, placeholder: "مثال: متابعة الرسائل الواردة" },
      {
        key: "frequency",
        label: "التكرار",
        type: "select",
        options: (["daily", "weekly", "monthly"] as Frequency[]).map((f) => ({
          value: f,
          label: FREQUENCY_LABEL[f],
        })),
      },
      { key: "when_note", label: "متى تُنفّذ؟", type: "text", placeholder: "مثال: أول ساعة من الدوام — 09:00" },
      { key: "what_note", label: "ماذا أفعل؟", type: "textarea", placeholder: "وصف مختصر لما تقوم به في هذه المهمة" },
      { key: "steps", label: "الخطوات", type: "steps" },
    ],
    defaults: { title: "", frequency: "daily", when_note: "", what_note: "", steps: [] },
    rowTitle: (r) => r.title,
    rowSubtitle: (r) => r.when_note || null,
    rowBadge: (r) => FREQUENCY_LABEL[r.frequency as Frequency] ?? null,
    badgeClass: (r) =>
      r.frequency === "daily"
        ? "bg-sky-100 text-sky-700"
        : r.frequency === "weekly"
          ? "bg-violet-100 text-violet-700"
          : "bg-amber-100 text-amber-700",
  },

>>>>>>> c683bf5f3d8ed3a7fc6b1bf2ec146ec0c53ce734
  special: {
    key: "special",
    label: "المهام الخاصة",
    emoji: "⭐",
    table: TABLES.special,
    queryKey: QUERY_KEYS.special,
    singular: "مهمة خاصة",
    fields: [
      { key: "title", label: "اسم المهمة", type: "text", required: true, placeholder: "مثال: إعلان دورة جديدة" },
      { key: "due_date", label: "التاريخ", type: "date", hint: "اتركه فارغًا إذا لم يكن مرتبطًا بتاريخ" },
      { key: "due_time", label: "الوقت", type: "time", hint: "اختياري" },
      {
        key: "status",
        label: "الحالة",
        type: "select",
        options: (["active", "done", "archived"] as SpecialStatus[]).map((s) => ({
          value: s,
          label: SPECIAL_STATUS_LABEL[s],
        })),
      },
      { key: "steps", label: "خطوات التنفيذ", type: "steps" },
      { key: "notes", label: "ملاحظات", type: "textarea", placeholder: "سياق إضافي يظهر للمساعد (اختياري)" },
    ],
    defaults: { title: "", due_date: null, due_time: null, status: "active", steps: [], notes: "" },
    rowTitle: (r) => r.title,
    rowSubtitle: (r) => (r.due_date ? `${r.due_date}${r.due_time ? ` — ${r.due_time}` : ""}` : "بدون تاريخ"),
    rowBadge: (r) => SPECIAL_STATUS_LABEL[r.status as SpecialStatus] ?? null,
    badgeClass: (r) =>
      r.status === "active"
        ? "bg-amber-50 text-amber-600"
        : r.status === "done"
          ? "bg-emerald-50 text-emerald-600"
          : "bg-slate-100 text-slate-400",
  },

  /* الروتين يُدار بالكامل من صفحة "روتيني" — لا يوجد هنا */

  sessions: {
    key: "sessions",
    label: "الجلسات",
    emoji: "🎥",
    table: TABLES.sessions,
    queryKey: QUERY_KEYS.sessions,
    singular: "جلسة",
    fields: [
      { key: "group_name", label: "الفوج", type: "text", required: true, placeholder: "مثال: المستوى الأول" },
      { key: "activity", label: "النشاط / البرنامج", type: "text", required: true, placeholder: "مثال: القراءة" },
      {
        key: "weekday",
        label: "اليوم الأسبوعي (تكرار أسبوعي)",
        type: "select",
        coerceInt: true,
        options: [
          { value: "none", label: "— لا يتكرر (بتاريخ محدد) —" },
          ...[6, 0, 1, 2, 3, 4, 5].map((d) => ({
            value: String(d),
            label: WEEKDAY_NAMES[d],
          })),
        ],
        hint: "إذا اخترت يومًا أسبوعيًا فالجلسة تتكرر كل أسبوع في هذا اليوم",
      },
      { key: "date", label: "أو تاريخ محدد (لمرة واحدة)", type: "date", hint: "اتركه فارغًا للجلسات الأسبوعية المتكررة" },
      { key: "start_time", label: "وقت البداية", type: "time", required: true },
      { key: "end_time", label: "وقت النهاية", type: "time" },
      { key: "meet_url", label: "رابط Google Meet الخاص بهذه الجلسة", type: "url", placeholder: "https://meet.google.com/xxx-xxxx-xxx", hint: "لكل جلسة رابطها الخاص — لا تستخدم رابطًا مشتركًا" },
      { key: "message_id", label: "الرسالة المرتبطة", type: "message-select", hint: "تُنسخ معبأة ببيانات هذه الجلسة تلقائيًا" },
      { key: "active", label: "الجلسة مفعلة", type: "switch" },
    ],
    defaults: { group_name: "", activity: "", weekday: null, date: null, start_time: "", end_time: null, meet_url: "", message_id: null, active: true },
    rowTitle: (r) => `${r.activity} — ${r.group_name}`,
    rowSubtitle: (r) =>
      `${r.weekday != null ? `كل ${WEEKDAY_NAMES[r.weekday]}` : r.date ?? "بدون موعد"} · ${r.start_time}${r.end_time ? ` — ${r.end_time}` : ""}`,
    rowBadge: (r) => (r.meet_url ? "برابط ✓" : "بدون رابط"),
    badgeClass: (r) =>
      r.meet_url ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600",
  },

  links: {
    key: "links",
    label: "الروابط",
    emoji: "🔗",
    table: TABLES.links,
    queryKey: QUERY_KEYS.links,
    singular: "رابط",
    fields: [
      { key: "title", label: "الاسم", type: "text", required: true, placeholder: "مثال: Google Meet" },
      { key: "description", label: "الوصف", type: "text", placeholder: "مثال: فتح الاجتماعات" },
      { key: "url", label: "الرابط", type: "url", required: true, placeholder: "https://..." },
      {
        key: "category",
        label: "التصنيف",
        type: "select",
        options: LINK_CATEGORIES.map((c) => ({
          value: c,
          label: LINK_CATEGORY_LABEL[c as LinkCategory],
        })),
      },
      { key: "icon", label: "الأيقونة", type: "select", options: iconOptions },
    ],
    defaults: { title: "", description: "", url: "", category: "admin", icon: "link" },
    rowTitle: (r) => r.title,
    rowSubtitle: (r) => r.url,
    rowBadge: (r) => LINK_CATEGORY_LABEL[r.category as LinkCategory] ?? null,
    badgeClass: () => "bg-sky-50 text-sky-600",
  },

  messages: {
    key: "messages",
    label: "الرسائل",
    emoji: "💬",
    table: TABLES.messages,
    queryKey: QUERY_KEYS.messages,
    singular: "رسالة",
    fields: [
      { key: "title", label: "عنوان الرسالة", type: "text", required: true, placeholder: "مثال: رسالة إرسال رابط الجلسة" },
      {
        key: "category",
        label: "التصنيف",
        type: "select",
        options: MESSAGE_CATEGORIES.map((c) => ({ value: c, label: CATEGORY_LABEL[c as MessageCategory] })),
      },
      { key: "body", label: "نص الرسالة", type: "textarea", required: true, placeholder: "اكتب نص الرسالة...", hint: "القوالب المتاحة: {{group}} الفوج · {{activity}} النشاط · {{date}} التاريخ · {{time}} الوقت · {{link}} رابط الجلسة — تُستبدل تلقائيًا عند النسخ من الجلسة" },
    ],
    defaults: { title: "", category: "sessions", body: "" },
    rowTitle: (r) => r.title,
    rowBadge: (r) => CATEGORY_LABEL[r.category as MessageCategory] ?? null,
    badgeClass: () => "bg-sky-50 text-sky-600",
  },

  files: {
    key: "files",
    label: "الملفات",
    emoji: "📁",
    table: TABLES.files,
    queryKey: QUERY_KEYS.files,
    singular: "ملف",
    fields: [
      { key: "name", label: "اسم الملف", type: "text", required: true, placeholder: "مثال: دليل جلسات القراءة" },
      {
        key: "category",
        label: "التصنيف",
        type: "select",
        options: FILE_CATEGORIES.map((c) => ({
          value: c,
          label: FILE_CATEGORY_LABEL[c as FileCategory],
        })),
      },
      {
        key: "file_type",
        label: "نوع الملف",
        type: "select",
        options: (Object.keys(FILE_TYPE_LABEL) as FileType[]).map((t) => ({
          value: t,
          label: FILE_TYPE_LABEL[t],
        })),
      },
      { key: "url", label: "الرابط", type: "url", required: true, placeholder: "https://drive.google.com/..." },
    ],
    defaults: { name: "", category: "other", file_type: "link", url: "" },
    rowTitle: (r) => r.name,
    rowSubtitle: (r) => r.url,
    rowBadge: (r) => FILE_CATEGORY_LABEL[r.category as FileCategory] ?? null,
    badgeClass: () => "bg-slate-100 text-slate-500",
  },

  instructions: {
    key: "instructions",
    label: "التعليمات",
    emoji: "📌",
    table: TABLES.instructions,
    queryKey: QUERY_KEYS.instructions,
    singular: "تعليم",
    fields: [
      { key: "content", label: "نص التعليم", type: "textarea", required: true },
      { key: "important", label: "مهم جدًا (يظهر بإبراز خاص)", type: "switch" },
    ],
    defaults: { content: "", important: false },
    rowTitle: (r) => String(r.content).slice(0, 60),
    rowBadge: (r) => (r.important ? "مهم" : null),
    badgeClass: () => "bg-amber-50 text-amber-600",
  },

  guides: {
    key: "guides",
    label: "الدليل",
    emoji: "📖",
    table: TABLES.guides,
    queryKey: QUERY_KEYS.guides,
    singular: "فصل دليل",
    fields: [
      { key: "title", label: "عنوان الفصل", type: "text", required: true, placeholder: "مثال: قبل الجلسة" },
      { key: "icon", label: "الأيقونة", type: "select", options: guideIconOptions },
      { key: "sections", label: "أقسام الفصل", type: "sections" },
    ],
    defaults: { title: "", icon: "book-open", sections: [] },
    rowTitle: (r) => r.title,
    rowSubtitle: (r) => `${r.sections?.length ?? 0} أقسام`,
  },

  issues: {
    key: "issues",
    label: "المشكلات",
    emoji: "🆘",
    table: TABLES.issues,
    queryKey: QUERY_KEYS.issues,
    singular: "مشكلة",
    fields: [
      { key: "problem", label: "المشكلة", type: "text", required: true, placeholder: "مثال: الرابط لا يعمل" },
      { key: "steps", label: "خطوات الحل", type: "steps" },
    ],
    defaults: { problem: "", steps: [] },
    rowTitle: (r) => r.problem,
    rowSubtitle: (r) => `${r.steps?.length ?? 0} خطوات`,
  },
};

export const RESOURCE_ORDER = [
  "sessions",
  "special",
  "links",
  "messages",
  "files",
  "instructions",
  "guides",
  "issues",
];
