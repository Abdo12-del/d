import type { Frequency } from "./types";

export const WEEKDAY_NAMES = [
  "الأحد",
  "الاثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
];

/** ترتيب أيام الأسبوع بدءًا من السبت */
export const WEEK_ORDER = [6, 0, 1, 2, 3, 4, 5];

export function isoOfDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayISO(): string {
  return isoOfDate(new Date());
}

export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
}

export function addDays(d: Date, n: number): Date {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}

/** بداية الأسبوع (السبت) */
export function weekStart(d: Date): Date {
  return addDays(d, -((d.getDay() + 1) % 7));
}

export function monthKey(iso: string): string {
  return iso.slice(0, 7);
}

export function formatArabicDate(
  iso: string,
  opts?: { withWeekday?: boolean; withYear?: boolean },
): string {
  const date = parseISO(iso);
  const parts: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    ...(opts?.withYear ? { year: "numeric" } : {}),
    ...(opts?.withWeekday ? { weekday: "long" } : {}),
  };
  return new Intl.DateTimeFormat("ar-EG-u-nu-latn", parts).format(date);
}

export function weekdayNameOf(iso: string): string {
  return WEEKDAY_NAMES[parseISO(iso).getDay()] ?? "";
}

export function dayRelativeLabel(iso: string): string {
  const today = todayISO();
  if (iso === today) return "اليوم";
  if (iso === isoOfDate(addDays(new Date(), 1))) return "غدًا";
  if (iso === isoOfDate(addDays(new Date(), -1))) return "أمس";
  return formatArabicDate(iso, { withWeekday: true });
}

export function timeMinutes(t?: string | null): number {
  if (!t) return 24 * 60 + 1;
  const [h, m] = t.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

export function nowMinutes(): number {
  const n = new Date();
  return n.getHours() * 60 + n.getMinutes();
}

export function inCurrentPeriod(iso: string, frequency: Frequency): boolean {
  const t = todayISO();
  if (frequency === "daily") return iso === t;
  if (frequency === "weekly") {
    return isoOfDate(weekStart(parseISO(iso))) === isoOfDate(weekStart(new Date()));
  }
  return monthKey(iso) === monthKey(t);
}

export function todayWeekday(): number {
  return new Date().getDay();
}
