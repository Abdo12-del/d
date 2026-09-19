import { cn } from "@/lib/utils";
import { EmptyState, TypeBadge } from "./shared";
import type { TaskType } from "@/lib/types";

export interface TimelineEntry {
  id: string;
  time: string;
  title: string;
  type: TaskType;
  note?: string;
  past?: boolean;
}

export default function ScheduleTimeline({
  entries,
  emptyTitle = "لا توجد مهام في هذا اليوم",
}: {
  entries: TimelineEntry[];
  emptyTitle?: string;
}) {
  if (!entries.length) {
    return <EmptyState title={emptyTitle} />;
  }

  const nextIdx = entries.findIndex((e) => !e.past);

  return (
    <div className="space-y-3">
      {entries.map((entry, i) => {
        const isNext = i === nextIdx;
        return (
          <div
            key={entry.id}
            className={cn(
              "flex items-stretch gap-3",
              entry.past && "opacity-55 saturate-50",
            )}
          >
            <div
              className={cn(
                "z-10 flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl border-2 font-display",
                entry.past
                  ? "border-ink/20 bg-paper-deep/70 text-ink-soft"
                  : isNext
                    ? "-rotate-2 border-ink bg-sun text-ink shadow-pop-sm"
                    : "border-ink bg-white text-ink shadow-pop-xs",
              )}
            >
              <span className="text-[13px] font-extrabold tabular-nums leading-none">
                {entry.time}
              </span>
              {isNext && (
                <span className="mt-1 text-[8.5px] font-black leading-none text-coral-dark">
                  التالي
                </span>
              )}
            </div>
            <div
              className={cn(
                "flex min-w-0 flex-1 items-center justify-between gap-2 rounded-2xl border-2 px-4 py-3 transition-all",
                entry.past
                  ? "border-ink/15 bg-white/60"
                  : isNext
                    ? "border-ink bg-cream shadow-pop"
                    : "border-ink/70 bg-white shadow-pop-sm",
              )}
            >
              <div className="min-w-0">
                <p
                  className={cn(
                    "truncate font-display text-sm font-extrabold sm:text-[15px]",
                    entry.past ? "text-ink-soft" : "text-ink",
                  )}
                >
                  {entry.title}
                </p>
                {entry.note && (
                  <p className="mt-0.5 truncate text-xs font-semibold text-ink-soft">
                    {entry.note}
                  </p>
                )}
              </div>
              <TypeBadge type={entry.type} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
