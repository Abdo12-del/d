import { Check, Clock, ClipboardList, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StepsList } from "./shared";
import {
  FREQUENCY_LABEL,
  FREQUENCY_STYLE,
  type RoutineTask,
} from "@/lib/types";

export default function RoutineTaskCard({
  task,
  done,
  onToggle,
}: {
  task: RoutineTask;
  done: boolean;
  onToggle: (task: RoutineTask, makeDone: boolean) => void;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border-2 bg-white p-4 shadow-pop transition-all sm:p-5",
        done ? "border-mint bg-mint-soft/40" : "border-ink",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex -rotate-1 items-center gap-1 rounded-full border-2 border-ink px-2.5 py-0.5 font-display text-[11px] font-extrabold text-white shadow-pop-xs",
              FREQUENCY_STYLE[task.frequency],
            )}
          >
            <Repeat className="h-3 w-3" />
            {FREQUENCY_LABEL[task.frequency]}
          </span>
          <h3 className="font-display text-base font-extrabold text-ink sm:text-lg">
            {task.title}
          </h3>
        </div>
        {done && (
          <span className="inline-flex rotate-1 items-center gap-1 rounded-full border-2 border-ink bg-mint px-2.5 py-0.5 font-display text-[11px] font-extrabold text-white shadow-pop-xs">
            منجزة ✓
          </span>
        )}
      </div>

      {(task.when_note || task.what_note) && (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {task.when_note && (
            <div className="flex items-start gap-2 rounded-2xl border-2 border-ink/15 bg-paper/70 p-2.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-pool-dark" />
              <div className="text-[13px] leading-relaxed">
                <span className="font-extrabold text-pool-dark">متى؟ </span>
                <span className="font-semibold text-ink-soft">
                  {task.when_note}
                </span>
              </div>
            </div>
          )}
          {task.what_note && (
            <div className="flex items-start gap-2 rounded-2xl border-2 border-ink/15 bg-paper/70 p-2.5">
              <ClipboardList className="mt-0.5 h-4 w-4 shrink-0 text-coral-dark" />
              <div className="text-[13px] leading-relaxed">
                <span className="font-extrabold text-coral-dark">
                  ماذا أفعل؟{" "}
                </span>
                <span className="font-semibold text-ink-soft">
                  {task.what_note}
                </span>
              </div>
            </div>
          )}
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

      <div className="mt-4 flex justify-end">
        <Button
          onClick={() => onToggle(task, !done)}
          className={cn(
            "press h-10 gap-1.5 rounded-full border-2 border-ink px-5 font-display font-extrabold text-white shadow-pop-xs",
            done
              ? "bg-mint hover:bg-mint-dark"
              : "bg-coral hover:bg-coral-dark",
          )}
        >
          <Check className="h-4 w-4" />
          {done
            ? task.frequency === "daily"
              ? "تم اليوم ✓"
              : task.frequency === "weekly"
                ? "تم هذا الأسبوع ✓"
                : "تم هذا الشهر ✓"
            : "تم التنفيذ"}
        </Button>
      </div>
    </div>
  );
}
