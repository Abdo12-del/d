import { Archive, Check, Info, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StepsList, TypeBadge } from "./shared";
import { dayRelativeLabel, todayISO } from "@/lib/time";
import { specialTaskType, type SpecialTask } from "@/lib/types";

export default function SpecialTaskCard({
  task,
  onStatus,
  hero = false,
}: {
  task: SpecialTask;
  onStatus?: (id: string, status: "active" | "done" | "archived") => void;
  hero?: boolean;
}) {
  const type = specialTaskType(task);
  const isDone = task.status === "done";
  const overdue =
    task.status === "active" && !!task.due_date && task.due_date < todayISO();

  const card = (
    <div
      className={cn(
        "h-full rounded-[22px] border-2 border-ink bg-white p-4 sm:p-5",
        hero && "bg-cream",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-base font-extrabold text-ink sm:text-lg">
          {task.title}
        </h3>
        <TypeBadge type={type} />
      </div>

      {task.due_date && (
        <div className="mt-3">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border-2 border-ink px-3 py-1 font-display text-[13px] font-extrabold shadow-pop-xs",
              overdue
                ? "-rotate-1 bg-cherry text-white"
                : isDone
                  ? "bg-mint-soft text-mint-dark"
                  : "bg-pool-soft text-pool-dark",
            )}
          >
            <span>🕐</span>
            {dayRelativeLabel(task.due_date)}
            {task.due_time ? ` — ${task.due_time}` : ""}
            {overdue && " (متأخرة!)"}
          </span>
        </div>
      )}

      {task.steps.length > 0 && (
        <div className="mt-4 rounded-2xl border-2 border-dashed border-ink/25 bg-cream p-3.5">
          <p className="mb-2 font-display text-xs font-extrabold text-ink-soft">
            الخطوات ✏️
          </p>
          <StepsList steps={task.steps} />
        </div>
      )}

      {task.notes && (
        <div className="mt-3 flex items-start gap-2 rounded-2xl border-2 border-ink/15 bg-sun-soft/70 p-3 text-[13px] font-semibold leading-relaxed text-ink">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-sun-dark" />
          {task.notes}
        </div>
      )}

      {onStatus && (
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          {task.status === "active" && (
            <Button
              onClick={() => onStatus(task.id, "done")}
              className="press h-10 gap-1.5 rounded-full border-2 border-ink bg-coral px-5 font-display font-extrabold text-white shadow-pop-xs hover:bg-coral-dark"
            >
              <Check className="h-4 w-4" />
              تم الإنجاز
            </Button>
          )}
          {task.status === "done" && (
            <>
              <Button
                onClick={() => onStatus(task.id, "active")}
                variant="outline"
                className="press h-10 gap-1.5 rounded-full border-2 border-ink bg-white px-4 font-display font-extrabold text-ink-soft shadow-pop-xs hover:bg-paper"
              >
                <RotateCcw className="h-4 w-4" />
                إرجاع
              </Button>
              <Button
                onClick={() => onStatus(task.id, "archived")}
                className="press h-10 gap-1.5 rounded-full border-2 border-ink bg-mint px-5 font-display font-extrabold text-white shadow-pop-xs hover:bg-mint-dark"
              >
                <Archive className="h-4 w-4" />
                أرشفة
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );

  if (!hero) return card;

  // بطاقة "مهمتك الآن" — ملصق مميز بإطار سميك وخلفية شمس
  return (
    <div className="relative rounded-[26px] border-[3px] border-ink bg-sun p-2 shadow-pop-lg sm:p-2.5">
      <span className="absolute -top-3.5 right-6 z-10 inline-block rotate-2 rounded-full border-2 border-ink bg-coral px-3.5 py-1 font-display text-xs font-extrabold text-white shadow-pop-sm">
        📌 مهمتك الآن
      </span>
      {card}
    </div>
  );
}
