import type { MessageTemplate, Session, StatusType } from "./types";
import {
  addDays,
  dayRelativeLabel,
  isoOfDate,
  nowMinutes,
  parseISO,
  timeMinutes,
  todayISO,
  WEEKDAY_NAMES,
} from "./time";

/** هل تنعقد الجلسة في هذا التاريخ؟ (تاريخ محدد أو تكرار أسبوعي) */
export function sessionOccursOn(s: Session, iso: string): boolean {
  if (!s.active) return false;
  if (s.date) return s.date === iso;
  if (s.weekday != null) return parseISO(iso).getDay() === s.weekday;
  return false;
}

/** حالة الجلسة الآن: قادمة / جارية / منتهية */
export function sessionStatus(s: Session, iso: string): StatusType {
  const today = todayISO();
  if (iso < today) return "ended";
  if (iso > today) return "pending";
  const now = nowMinutes();
  const start = timeMinutes(s.start_time);
  const end = s.end_time ? timeMinutes(s.end_time) : start + 60;
  if (now >= start && now < end) return "running";
  if (now >= end) return "ended";
  return "pending";
}

/** أقرب تاريخ انعقاد قادم (للجلسات المتكررة أو المؤرَّخة) — يبدأ من اليوم */
export function nextSessionDate(s: Session, from?: Date): string | null {
  const base = from ?? new Date();
  if (s.date) return s.date >= isoOfDate(base) ? s.date : null;
  if (s.weekday == null) return null;
  for (let i = 0; i < 7; i++) {
    const d = addDays(base, i);
    if (d.getDay() === s.weekday) return isoOfDate(d);
  }
  return null;
}

/** نص الوقت: 17:00 — 18:00 */
export function sessionTimeText(s: Session): string {
  return s.end_time ? `${s.start_time} — ${s.end_time}` : s.start_time;
}

/** نص السياق: اليوم/التاريخ + الوقت */
export function sessionWhenText(s: Session, iso: string): string {
  return `${dayRelativeLabel(iso)} · ${sessionTimeText(s)}`;
}

/**
 * يملأ قوالب الرسالة ببيانات الجلسة تلقائيًا:
 * {{group}} {{activity}} {{date}} {{time}} {{link}}
 */
export function renderSessionMessage(
  body: string,
  s: Session,
  iso: string,
): string {
  const map: Record<string, string> = {
    group: s.group_name,
    activity: s.activity,
    date: dayRelativeLabel(iso),
    day: WEEKDAY_NAMES[parseISO(iso).getDay()] ?? "",
    time: sessionTimeText(s),
    link: s.meet_url ?? "",
  };
  return body
    .replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k: string) => map[k] ?? "")
    .replace(/\{\s*(\w+)\s*\}/g, (_, k: string) => map[k] ?? "");
}

/** الرسالة المرتبطة بالجلسة من المكتبة */
export function sessionMessage(
  s: Session,
  messages: MessageTemplate[],
): MessageTemplate | null {
  return messages.find((m) => m.id === s.message_id) ?? null;
}

/** عنوان موحد للجلسة: "القراءة — الفوج A" */
export function sessionTitle(s: Session): string {
  return `${s.activity} — ${s.group_name}`;
}

/** مقارنة جلسات اليوم حسب وقت البداية */
export function compareSessions(a: Session, b: Session): number {
  return timeMinutes(a.start_time) - timeMinutes(b.start_time);
}
