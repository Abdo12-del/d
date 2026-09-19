import { cn } from "@/lib/utils";
import { EmptyState, StatusChip, TypeChip } from "./shared";
import type { StatusType, TaskType } from "@/lib/types";

export interface TimelineItem {
  id: string;
  time: string;
  title: string;
  type: TaskType;
  status: StatusType;
  onClick?: () => void;
}

/**
 * Timeline عمودي منظم — الوقت والعنوان والحالة أبرز العناصر.
 */
export default function Timeline({
  items,
  emptyTitle = "لا توجد أحداث",
}: {
  items: TimelineItem[];
  emptyTitle?: string;
}) {
  if (!items.length) {
    return <EmptyState title={emptyTitle} />;
  }

  return (
    <div className="space-y-0">
      {items.map((item, i) => {
        const done = item.status === "done";
        const overdue = item.status === "overdue";
        return (
          <button
            key={item.id}
            onClick={item.onClick}
            className={cn(
              "group flex w-full items-start gap-4 text-right",
              item.onClick && "cursor-pointer",
            )}
          >
            {/* الوقت */}
            <span
              className={cn(
                "w-12 shrink-0 pt-4 text-[13px] font-black tabular-nums",
                done ? "text-emerald-500" : overdue ? "text-rose-500" : "text-slate-700",
              )}
            >
              {item.time}
            </span>

            {/* الخط والنقطة */}
            <div className="relative flex w-4 shrink-0 justify-center self-stretch">
              <span
                className={cn(
                  "absolute inset-y-0 w-px bg-slate-200",
                  i === 0 && "top-5",
                  i === items.length - 1 && "bottom-[calc(100%-1.25rem)]",
                )}
              />
              <span
                className={cn(
                  "relative z-10 mt-[18px] h-2.5 w-2.5 rounded-full ring-4 ring-[hsl(var(--background))]",
                  done
                    ? "bg-emerald-500"
                    : overdue
                      ? "bg-rose-400"
                      : item.type === "special"
                        ? "bg-amber-400"
                        : item.type === "scheduled"
                          ? "bg-violet-400"
                          : "bg-sky-400",
                )}
              />
            </div>

            {/* المحتوى */}
            <div
              className={cn(
                "min-w-0 flex-1 border-b border-slate-100 pb-4 pt-3.5 transition group-hover:bg-sky-50/30 sm:px-3",
                i === items.length - 1 && "border-b-0",
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <p
                  className={cn(
                    "text-sm font-extrabold sm:text-[15px]",
                    done ? "text-slate-400 line-through decoration-slate-300" : "text-slate-800",
                  )}
                >
                  {item.title}
                </p>
                <div className="flex items-center gap-3">
                  <TypeChip type={item.type} />
                  <StatusChip status={item.status} />
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
