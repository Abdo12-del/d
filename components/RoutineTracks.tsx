import { ArrowLeft, CalendarRange, CalendarCheck2, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { isTaskDone, useCompletions } from "@/lib/hooks";
import { lastDoneLabel } from "@/lib/commands";
import { FREQUENCY_LABEL, FREQUENCY_ORDER, type Frequency, type RoutineTask } from "@/lib/types";

const TRACK_STYLE: Record<
  Frequency,
  { chip: string; icon: typeof Sun; node: string; btn: string; glow: string }
> = {
  daily: {
    chip: "from-sky-500 to-cyan-500",
    icon: Sun,
    node: "bg-sky-500",
    btn: "text-sky-700 hover:bg-sky-50",
    glow: "bg-sky-200",
  },
  weekly: {
    chip: "from-violet-500 to-purple-500",
    icon: CalendarRange,
    node: "bg-violet-500",
    btn: "text-violet-700 hover:bg-violet-50",
    glow: "bg-violet-200",
  },
  monthly: {
    chip: "from-amber-500 to-orange-500",
    icon: CalendarCheck2,
    node: "bg-amber-500",
    btn: "text-amber-700 hover:bg-amber-50",
    glow: "bg-amber-200",
  },
};

const TRACK_DESC: Record<Frequency, string> = {
  daily: "ما تفعله بشكل متكرر كل يوم",
  weekly: "ما يعود عليك كل أسبوع",
  monthly: "ما يعود كل شهر",
};

/**
 * «نظامك المعتاد» — ثلاثة مسارات زمنية مترابطة (يومي/أسبوعي/شهري)
 * وليست ثلاث بطاقات متساوية.
 */
export default function RoutineTracks({
  routines,
}: {
  routines: RoutineTask[];
}) {
  const { data: completions = [] } = useCompletions();

  return (
    <div className="relative">
      {/* الخط الرابط بين المسارات */}
      <div
        aria-hidden
        className="absolute right-[16%] left-[16%] top-[26px] hidden h-1 rounded-full bg-gradient-to-l from-sky-200 via-violet-200 to-amber-200 lg:block"
      />

      <div className="grid gap-3.5 md:grid-cols-3">
        {FREQUENCY_ORDER.map((freq, idx) => {
          const list = routines.filter((t) => t.frequency === freq);
          const doneCount = list.filter((t) =>
            isTaskDone(completions, t.id, t.frequency),
          ).length;
          const style = TRACK_STYLE[freq];
          const Icon = style.icon;
          const lastDone = lastDoneLabel(list, completions);
          const empty = list.length === 0;

          return (
            <div
              key={freq}
              className="card-soft group relative flex flex-col p-4.5 transition-transform duration-200 hover:-translate-y-1"
              style={{ animation: `pop-in .5s cubic-bezier(.21,.9,.35,1) both`, animationDelay: `${idx * 90}ms` }}
            >
              {/* عقدة على الخط */}
              <span
                aria-hidden
                className={cn(
                  "absolute -top-[7px] right-1/2 hidden h-3.5 w-3.5 translate-x-1/2 rounded-full ring-4 ring-white lg:block",
                  style.node,
                )}
              />

              <div className="flex items-center justify-between gap-2">
                <span
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-soft-sm",
                    style.chip,
                    idx === 1 && "rotate-2",
                    idx === 2 && "-rotate-2",
                  )}
                >
                  <Icon className="h-5.5 w-5.5" />
                </span>
                <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-extrabold text-slate-500 ring-1 ring-slate-100">
                  {list.length} مهام
                </span>
              </div>

              <h3 className="mt-3 font-display text-lg font-extrabold text-sky-950">
                {FREQUENCY_LABEL[freq]}
              </h3>
              <p className="text-xs font-semibold text-slate-400">{TRACK_DESC[freq]}</p>

              {empty ? (
                <p className="mt-4 rounded-xl border border-dashed border-sky-200 bg-sky-50/50 px-3 py-4 text-center text-xs font-bold text-slate-400">
                  لا مهام في هذا المسار بعد
                </p>
              ) : (
                <>
                  {/* عيّنة من المهام */}
                  <ul className="mt-3.5 space-y-2">
                    {list.slice(0, 3).map((t) => {
                      const done = isTaskDone(completions, t.id, t.frequency);
                      return (
                        <li key={t.id} className="flex items-center gap-2 text-[13px] font-bold">
                          <span
                            className={cn(
                              "flex h-2 w-2 shrink-0 rounded-full",
                              done ? "animate-pulse-dot bg-emerald-500" : "bg-slate-200",
                            )}
                          />
                          <span className={cn("truncate", done ? "text-emerald-600 line-through decoration-emerald-300" : "text-slate-600")}>
                            {t.title}
                          </span>
                        </li>
                      );
                    })}
                    {list.length > 3 && (
                      <li className="pr-4 text-[11px] font-bold text-slate-300">
                        +{list.length - 3} أخرى…
                      </li>
                    )}
                  </ul>

                  {/* التقدم */}
                  <div className="mt-3.5">
                    <div className="mb-1 flex items-center justify-between text-[11px] font-extrabold">
                      <span className="text-slate-400">
                        {lastDone ?? "لم تبدأ بعد"}
                      </span>
                      <span className="text-emerald-600">
                        {doneCount}/{list.length} أُنجزت
                      </span>
                    </div>
                    <Progress
                      value={list.length ? (doneCount / list.length) * 100 : 0}
                      className="h-2 bg-slate-100"
                    />
                  </div>
                </>
              )}

              <Link
                to={`/routine${freq !== "daily" ? `?freq=${freq}` : ""}`}
                className={cn(
                  "press mt-4 flex h-10 items-center justify-center gap-1.5 rounded-full border border-sky-100 bg-white font-display text-[13px] font-extrabold shadow-soft-sm transition group-hover:border-transparent",
                  style.btn,
                )}
              >
                استكشف الروتين
                <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
