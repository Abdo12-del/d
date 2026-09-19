import { Clock, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimelineEntry {
  id: string;
  time: string;
  title: string;
  kind: "routine" | "special";
  past?: boolean;
  isSpecial?: boolean;
  note?: string;
}

/**
 * الخط الزمني الذكي لليوم — أفقي مرن، نقاط مضيئة، وتمييز «الآن».
 * kind يفصل بصريًا بين المعتاد 🔄 والمهمة الخاصة ⭐.
 */
export default function DayTimeline({
  entries,
  onOpen,
}: {
  entries: TimelineEntry[];
  onOpen?: (entry: TimelineEntry) => void;
}) {
  if (!entries.length) {
    return (
      <div className="rounded-[24px] border border-dashed border-sky-200 bg-white/70 px-5 py-8 text-center">
        <p className="font-display text-sm font-extrabold text-sky-950">
          يوم هادئ — لا مواعيد في جدول اليوم
        </p>
        <p className="mt-1 text-xs font-semibold text-slate-400">
          استغل الهدوء لتقديم ما هو قادم 😉
        </p>
      </div>
    );
  }

  const nextIdx = entries.findIndex((e) => !e.past);

  return (
    <div className="relative">
      {/* الخط المرن */}
      <div
        aria-hidden
        className="absolute right-6 left-6 top-[54px] h-1.5 rounded-full bg-gradient-to-l from-sky-200 via-sky-100 to-violet-200 sm:right-10 sm:left-10"
      />
      <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 pt-1 sm:mx-0 sm:px-1">
        {entries.map((entry, i) => {
          const isNow = i === nextIdx && !entry.past;
          return (
            <button
              key={entry.id}
              onClick={() => onOpen?.(entry)}
              className={cn(
                "press relative flex w-[150px] shrink-0 snap-start flex-col items-center gap-2 rounded-[22px] border p-3 pt-0 text-center shadow-soft-sm transition sm:w-[168px]",
                entry.past
                  ? "border-sky-100 bg-white/60 opacity-60"
                  : isNow
                    ? "border-sky-300 bg-white shadow-soft ring-2 ring-sky-200"
                    : entry.isSpecial
                      ? "border-violet-200 bg-gradient-to-b from-violet-50/90 to-white"
                      : "border-sky-100 bg-white hover:bg-sky-50/50",
              )}
            >
              {/* الوقت فوق الخط */}
              <span
                className={cn(
                  "relative -mt-3 flex items-center gap-1 rounded-full px-3 py-1 font-display text-[12px] font-extrabold tabular-nums shadow-soft-sm",
                  entry.past
                    ? "bg-slate-100 text-slate-400"
                    : isNow
                      ? "bg-gradient-to-l from-sky-500 to-sky-600 text-white"
                      : entry.isSpecial
                        ? "bg-gradient-to-l from-violet-500 to-violet-600 text-white"
                        : "bg-white text-sky-700 ring-1 ring-sky-200",
                )}
              >
                {entry.isSpecial && !entry.past && <Star className="h-3 w-3 fill-amber-400 text-amber-400" />}
                {entry.time}
              </span>

              {/* النقطة على الخط */}
              <span className="relative -mt-4 h-3 w-3">
                {isNow && (
                  <span aria-hidden className="absolute inset-0 animate-ping-soft rounded-full bg-sky-400" />
                )}
                <span
                  className={cn(
                    "relative inline-flex h-3 w-3 rounded-full ring-4 ring-white",
                    entry.past ? "bg-slate-200" : isNow ? "bg-sky-500" : entry.isSpecial ? "bg-violet-500" : "bg-sky-400",
                  )}
                />
              </span>

              <span
                className={cn(
                  "line-clamp-2 min-h-[34px] font-display text-[13px] font-extrabold leading-snug",
                  entry.past ? "text-slate-400" : "text-sky-950",
                )}
              >
                {entry.title}
              </span>

              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-extrabold",
                  entry.past
                    ? "bg-slate-100 text-slate-400"
                    : isNow
                      ? "bg-sky-100 text-sky-700"
                      : entry.isSpecial
                        ? "bg-violet-100 text-violet-700"
                        : "bg-sky-50 text-sky-600",
                )}
              >
                {entry.past ? "انتهى" : isNow ? "التالي الآن" : entry.isSpecial ? "مهمة خاصة" : "معتاد"}
              </span>
            </button>
          );
        })}
      </div>
      {/* تلميح التمرير */}
      <p className="mt-1 hidden items-center justify-center gap-1.5 text-[11px] font-bold text-slate-300 sm:flex">
        <Clock className="h-3 w-3" />
        اسحب الخط الزمني لعرض بقية اليوم
      </p>
    </div>
  );
}
