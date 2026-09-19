import type { LinkItem, MessageTemplate, RoutineTask, ScheduleItem, SpecialTask } from "./types";
import { timeMinutes } from "./time";

/**
 * «الذكاء» الصغير في مركز التحكم: يربط المهمة الحالية بالرابط والرسالة
 * الأنسب لها تلقائيًا، ويحسب الوقت المتبقي بصيغة عربية ودّية.
 */

const STOP_WORDS = new Set([
  "من", "في", "على", "الى", "إلى", "عن", "مع", "هذه", "هذا", "الجاهزة",
  "الرابط", "رابط", "ارسال", "إرسال", "اليوم", "غدا", "غدًا", "بعد",
]);

function keywords(text: string): string[] {
  return text
    .split(/[\s،,.:؛-]+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

function sharedWords(a: string, b: string): number {
  const ka = new Set(keywords(a));
  let n = 0;
  for (const w of keywords(b)) if (ka.has(w)) n += 1;
  return n;
}

/** أفضل رابط مرتبط بالمهمة (بمقارنة الكلمات) أو null */
export function findRelatedLink(
  task: { title: string; steps?: string[] },
  links: LinkItem[],
): LinkItem | null {
  let best: LinkItem | null = null;
  let bestScore = 0;
  for (const link of links) {
    let score = sharedWords(task.title, link.title) * 2;
    for (const step of task.steps ?? []) {
      score += sharedWords(step, link.title);
    }
    if (score > bestScore) {
      bestScore = score;
      best = link;
    }
  }
  return bestScore > 0 ? best : null;
}

/** أفضل رسالة جاهزة مرتبطة بالمهمة أو null */
export function findRelatedMessage(
  task: { title: string; steps?: string[] },
  messages: MessageTemplate[],
): MessageTemplate | null {
  let best: MessageTemplate | null = null;
  let bestScore = 0;
  for (const msg of messages) {
    let score = sharedWords(task.title, msg.title) * 2;
    for (const step of task.steps ?? []) score += sharedWords(step, msg.title);
    if (score > bestScore) {
      bestScore = score;
      best = msg;
    }
  }
  return bestScore > 0 ? best : null;
}

/** الوقت المتبقي حتى "HH:MM" اليوم بصيغة ودية */
export function timeUntilLabel(time?: string | null): {
  label: string;
  state: "now" | "soon" | "later" | "past" | "none";
  minutes: number;
} {
  if (!time) return { label: "بدون وقت محدد", state: "none", minutes: Infinity };
  const target = timeMinutes(time);
  const now = new Date().getHours() * 60 + new Date().getMinutes();
  const diff = target - now;
  if (Math.abs(diff) <= 5) return { label: "الآن ⏰", state: "now", minutes: diff };
  if (diff < 0) {
    const past = -diff;
    if (past < 60) return { label: `متأخرة ${past} دقيقة`, state: "past", minutes: diff };
    const h = Math.floor(past / 60);
    const m = past % 60;
    return { label: `متأخرة ${h} س ${m ? `${m} د` : ""}`.trim(), state: "past", minutes: diff };
  }
  if (diff < 60) return { label: `بعد ${diff} دقيقة`, state: "soon", minutes: diff };
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return {
    label: m ? `بعد ${h} س ${m} د` : `بعد ${h} ${h === 1 ? "ساعة" : h === 2 ? "ساعتين" : "ساعات"}`,
    state: "later",
    minutes: diff,
  };
}

/** آخر تنفيذ لمجموعة مهام بصيغة ودية (من سجل الإنجازات) */
export function lastDoneLabel(
  tasks: RoutineTask[],
  completions: { task_key: string; completed_date: string }[],
): string | null {
  const ids = new Set(tasks.map((t) => `routine:${t.id}`));
  let latest: string | null = null;
  for (const c of completions) {
    if (ids.has(c.task_key)) {
      if (!latest || c.completed_date > latest) latest = c.completed_date;
    }
  }
  if (!latest) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(latest + "T00:00:00");
  const days = Math.round((today.getTime() - d.getTime()) / 86_400_000);
  if (days <= 0) return "آخر تنفيذ: اليوم";
  if (days === 1) return "آخر تنفيذ: أمس";
  if (days === 2) return "آخر تنفيذ: منذ يومين";
  return `آخر تنفيذ: منذ ${days} أيام`;
}

/** هل البند اليومي ظاهر الآن في الجدول؟ (لكل الأيام أو يوم مطابق) */
export function scheduleForDay(items: ScheduleItem[], weekday: number): ScheduleItem[] {
  return items.filter((i) => i.weekdays.length === 0 || i.weekdays.includes(weekday));
}

export function isSpecialToday(s: SpecialTask, todayISO: string): boolean {
  return s.status === "active" && s.due_date === todayISO;
}
