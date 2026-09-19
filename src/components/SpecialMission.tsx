import { ArrowLeft, CalendarClock, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Owl } from "@/components/Owl";
import { dayRelativeLabel, timeMinutes } from "@/lib/time";
import type { SpecialTask } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * «شيء مختلف اليوم؟» — مساحة عائمة بأسلوب ملصق لاصق للمهام الاستثنائية،
 * منفصلة بصريًا تمامًا عن الروتين.
 */
export default function SpecialMission({
  specials,
  onOpen,
}: {
  specials: SpecialTask[];
  onOpen?: (task: SpecialTask) => void;
}) {
  const active = specials
    .filter((s) => s.status === "active")
    .sort(
      (a, b) =>
        (a.due_date ?? "9999").localeCompare(b.due_date ?? "9999") ||
        timeMinutes(a.due_time) - timeMinutes(b.due_time),
    )
    .slice(0, 2);

  return (
    <div className="relative">
      {/* شريط لاصق أعلى الملصق */}
      <div
        aria-hidden
        className="absolute -top-3 right-1/2 z-10 h-6 w-28 -translate-x-1/2 rotate-2 rounded-md bg-amber-200/80 shadow-soft-sm backdrop-blur-sm"
      />
      <div className="relative -rotate-[0.6deg] rounded-[28px] border border-violet-100 bg-gradient-to-bl from-violet-50/95 via-white to-fuchsia-50/70 p-5 shadow-soft backdrop-blur-sm transition-transform hover:rotate-0 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="flex items-center gap-2.5 font-display text-xl font-extrabold text-violet-950">
            <span className="flex h-9 w-9 -rotate-6 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-soft-sm">
              <Star className="h-5 w-5 fill-amber-300 text-amber-300" />
            </span>
            شيء مختلف اليوم؟
          </h2>
          <Link
            to="/special"
            className="press flex items-center gap-1 rounded-full bg-white px-3.5 py-1.5 text-xs font-extrabold text-violet-700 shadow-soft-sm ring-1 ring-violet-100 transition hover:bg-violet-50"
          >
            كل المهام الخاصة
            <ArrowLeft className="h-3.5 w-3.5" />
          </Link>
        </div>
        <p className="mt-0.5 pr-11 text-xs font-semibold text-slate-400">
          مهام استثنائية لا تتكرر — تظهر هنا فقط عند وجودها
        </p>

        {active.length === 0 ? (
          <div className="mt-4 flex items-center justify-center gap-4 rounded-2xl border border-dashed border-violet-200 bg-white/60 px-5 py-5">
            <div className="animate-float-y">
              <Owl size={72} pose="cheer" />
            </div>
            <div className="text-right">
              <p className="font-display text-[15px] font-extrabold text-violet-950">
                كل شيء تحت السيطرة! 🦉
              </p>
              <p className="mt-0.5 text-xs font-semibold leading-relaxed text-slate-400">
                لا توجد مهام خاصة الآن —
                <br className="hidden sm:block" />
                يمكنك متابعة مهامك المعتادة بكل هدوء.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {active.map((task, i) => (
              <button
                key={task.id}
                onClick={() => onOpen?.(task)}
                className={cn(
                  "press group flex flex-col gap-2 rounded-2xl border border-violet-100 bg-white p-4 text-right shadow-soft-sm transition hover:-translate-y-0.5 hover:shadow-soft",
                  i === 0 && "sm:-rotate-[0.5deg]",
                  i === 1 && "sm:rotate-[0.5deg]",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 rounded-full bg-violet-100 px-2.5 py-0.5 text-[10.5px] font-extrabold text-violet-700">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    مهمة استثنائية
                  </span>
                  {task.due_date && (
                    <span className="flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-[10.5px] font-extrabold tabular-nums text-sky-700">
                      <CalendarClock className="h-3 w-3" />
                      {dayRelativeLabel(task.due_date)}
                      {task.due_time ? ` · ${task.due_time}` : ""}
                    </span>
                  )}
                </div>
                <p className="font-display text-[15px] font-extrabold leading-snug text-violet-950">
                  {task.title}
                </p>
                <span className="mt-auto flex items-center gap-1 text-xs font-extrabold text-violet-600">
                  فتح المهمة
                  <ArrowLeft className="h-3.5 w-3.5 transition group-hover:-translate-x-0.5" />
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
