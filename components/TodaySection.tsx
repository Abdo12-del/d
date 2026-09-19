import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { isTaskDone, useToggleRoutineDone } from "@/lib/hooks";
import type { RoutineTask, Completion } from "@/lib/types";

/** قسم «مهام اليوم المعتادة» في الرئيسية — مع فتح التفاصيل والإنجاز السريع */
export default function TodaySection({
  daily,
  completions,
  onOpenRoutine,
}: {
  daily: RoutineTask[];
  completions: Completion[];
  onOpenRoutine: (task: RoutineTask) => void;
}) {
  const toggle = useToggleRoutineDone();

  if (!daily.length) return null;

  return (
    <section>
      <div className="mb-3.5 flex items-center justify-between">
        <h2 className="font-display text-lg font-extrabold text-sky-950">
          ✅ مهام اليوم المعتادة
        </h2>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {daily.slice(0, 6).map((task) => {
          const done = isTaskDone(completions, task.id, task.frequency);
          return (
            <div
              key={task.id}
              className={cn(
                "flex items-center gap-3 rounded-2xl border bg-white p-3 shadow-soft-sm transition",
                done ? "border-emerald-200 bg-emerald-50/40" : "border-sky-100",
              )}
            >
              {/* زر الإنجاز السريع */}
              <button
                aria-label={done ? "إلغاء الإنجاز" : "تأكيد الإنجاز"}
                onClick={() => toggle.mutate({ task, makeDone: !done })}
                className={cn(
                  "press flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition",
                  done
                    ? "animate-check-pop bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-soft-sm"
                    : "border-2 border-dashed border-sky-300 text-transparent hover:border-sky-400 hover:bg-sky-50",
                )}
              >
                <Check className="h-4 w-4" strokeWidth={3.5} />
              </button>
              {/* الفتح للتفاصيل */}
              <button
                onClick={() => onOpenRoutine(task)}
                className="min-w-0 flex-1 text-right"
              >
                <p
                  className={cn(
                    "truncate font-display text-sm font-extrabold",
                    done ? "text-emerald-700 line-through decoration-emerald-300" : "text-sky-950",
                  )}
                >
                  {task.title}
                </p>
                {task.when_note && (
                  <p className="truncate text-[11px] font-semibold text-slate-400">
                    {task.when_note}
                  </p>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
