import { useState } from "react";
import { ArrowLeft, Check, Clock, ExternalLink, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/shared";
import { Owl } from "@/components/Owl";
import TaskDrawer, { type DrawerTask } from "@/components/TaskDrawer";
import { useLinks, useMessages, useSetSpecialStatus, useSpecialTasks } from "@/lib/hooks";
import { findRelatedLink, findRelatedMessage, timeUntilLabel } from "@/lib/commands";
import { timeMinutes, todayISO } from "@/lib/time";
import { cn } from "@/lib/utils";
import { useNow } from "@/lib/useNow";

/**
 * «مهمتك الآن» — بؤرة مركز التحكم: تعرض أهم مهمة حالية مع خطواتها
 * وأدواتها الجاهزة وزر إنجاز، وتُخفي نفسها بلطف عند عدم وجود مهمة.
 */
export default function NowCard() {
  const { data: specials = [] } = useSpecialTasks();
  const { data: links = [] } = useLinks();
  const { data: messages = [] } = useMessages();
  const setStatus = useSetSpecialStatus();
  const now = useNow();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [justDone, setJustDone] = useState(false);

  // أهم مهمة: الأقرب موعدًا من المهام الخاصة النشطة المؤرخة
  const current = specials
    .filter((s) => s.status === "active" && s.due_date)
    .sort(
      (a, b) =>
        a.due_date!.localeCompare(b.due_date!) ||
        timeMinutes(a.due_time) - timeMinutes(b.due_time),
    )[0];

  const relatedLink = current ? findRelatedLink(current, links) : null;
  const relatedMessage = current ? findRelatedMessage(current, messages) : null;
  const countdown = current ? timeUntilLabel(current.due_time) : null;
  const overdue = countdown?.state === "past";

  const complete = () => {
    if (!current) return;
    setStatus.mutate(
      { id: current.id, status: "done" },
      {
        onSuccess: () => {
          setJustDone(true);
          setTimeout(() => setJustDone(false), 2200);
        },
      },
    );
  };

  /* ===== حالة "كل شيء تحت السيطرة" ===== */
  if (!current) {
    return (
      <div className="card-soft relative overflow-hidden p-5 sm:p-6">
        <div
          aria-hidden
          className="blob absolute -left-14 -top-16 h-44 w-44 bg-gradient-to-br from-emerald-100 to-sky-100 blur-xl"
        />
        <div className="relative flex flex-col items-center gap-3 text-center sm:flex-row sm:text-right">
          <div className="animate-float-y">
            <Owl size={96} pose="point" />
          </div>
          <div className="flex-1">
            <p className="font-display text-xl font-extrabold text-sky-950">
              كل شيء تحت السيطرة! 🦉
            </p>
            <p className="mt-1 text-sm font-semibold leading-relaxed text-slate-500">
              لا توجد مهام عاجلة الآن — تابع نظامك المعتاد بالأسفل، وستظهر هنا
              أي مهمة جديدة فورًا.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="press h-10 rounded-full border-sky-200 px-5 font-display font-extrabold text-sky-700 shadow-soft-sm"
          >
            <Link to="/routine">
              استعرض روتينك
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const drawerTask: DrawerTask = {
    kind: "special",
    id: current.id,
    title: current.title,
    time: current.due_time,
    date: current.due_date,
    steps: current.steps,
    notes: current.notes,
    done: false,
  };

  return (
    <>
      {/* شريط الاحتفال اللحظي بعد الإنجاز */}
      {justDone && (
        <div className="mb-3 flex animate-pop-in items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-emerald-500 to-emerald-400 px-4 py-2.5 font-display text-sm font-extrabold text-white shadow-soft">
          <Check className="h-5 w-5 animate-check-pop" strokeWidth={3} />
          رائع! أُنجزت المهمة — البومة فخورة بك 💙
        </div>
      )}

      <div className="relative">
        {/* شريط «مهمتك الآن» */}
        <div className="card-soft relative overflow-hidden">
          {/* ترويسة ملونة */}
          <div className="relative flex items-center justify-between overflow-hidden bg-gradient-to-l from-sky-500 via-sky-500 to-cyan-500 px-5 py-3 text-white sm:px-7">
            <div aria-hidden className="blob absolute -left-8 -top-10 h-28 w-28 bg-white/15 blur-xl" />
            <div aria-hidden className="absolute -bottom-10 right-10 h-20 w-28 rounded-full bg-white/10 blur-lg" />
            <span className="relative flex items-center gap-2 font-display text-sm font-extrabold sm:text-base">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping-soft rounded-full bg-amber-300" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-300" />
              </span>
              مهمتك الآن
            </span>
            {countdown && (
              <span
                className={cn(
                  "relative flex items-center gap-1.5 rounded-full px-3 py-1 font-display text-[12px] font-extrabold backdrop-blur-sm",
                  countdown.state === "now"
                    ? "animate-wiggle bg-amber-300 text-amber-950"
                    : overdue
                      ? "bg-rose-400/90 text-white"
                      : "bg-white/20 text-white",
                )}
              >
                <Clock className="h-3.5 w-3.5" />
                {countdown.label}
                {countdown.state !== "none" && (
                  <span className="hidden font-body text-[11px] font-bold opacity-80 sm:inline">
                    · {current.due_time}
                  </span>
                )}
              </span>
            )}
          </div>

          <div className="relative grid gap-5 p-5 sm:grid-cols-[1fr_190px] sm:p-7">
            {/* المحتوى */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-[11px] font-extrabold text-violet-700 ring-1 ring-violet-200">
                  ⭐ مهمة خاصة
                </span>
                <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-extrabold text-sky-700 ring-1 ring-sky-100">
                  {current.due_date === todayISO()
                    ? "اليوم"
                    : current.due_date}
                  {current.due_time ? ` · ${current.due_time}` : ""}
                </span>
              </div>

              <h2 className="mt-2.5 font-display text-2xl font-extrabold leading-snug text-sky-950 sm:text-[28px]">
                {current.title}
              </h2>
              {current.notes && (
                <p className="mt-1.5 text-[13px] font-semibold leading-relaxed text-slate-500">
                  {current.notes}
                </p>
              )}

              {/* الخطوات كمسار مرقّم */}
              {current.steps.length > 0 && (
                <ol className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                  {current.steps.map((step, i) => (
                    <li key={i} className="flex items-center gap-2 text-[13px] font-extrabold text-slate-600">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-sky-600 font-display text-[10px] text-white shadow-soft-sm">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {step}
                      {i < current.steps.length - 1 && (
                        <span aria-hidden className="text-sky-300">←</span>
                      )}
                    </li>
                  ))}
                </ol>
              )}

              {/* الأدوات */}
              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                {relatedLink ? (
                  <a
                    href={relatedLink.url}
                    target="_blank"
                    rel="noreferrer"
                    className="press flex h-11 items-center gap-2 rounded-full bg-gradient-to-l from-sky-500 to-sky-600 px-5 font-display text-sm font-extrabold text-white shadow-soft transition hover:from-sky-600 hover:to-sky-700"
                  >
                    فتح {relatedLink.title}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <Link
                    to="/links"
                    className="press flex h-11 items-center gap-2 rounded-full bg-gradient-to-l from-sky-500 to-sky-600 px-5 font-display text-sm font-extrabold text-white shadow-soft"
                  >
                    افتح الروابط
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                )}

                {relatedMessage ? (
                  <CopyButton
                    text={relatedMessage.body}
                    label="نسخ الرسالة"
                    big
                  />
                ) : (
                  <Link
                    to="/messages"
                    className="press flex h-11 items-center gap-2 rounded-full border border-sky-200 bg-white px-5 font-display text-sm font-extrabold text-sky-700 shadow-soft-sm transition hover:bg-sky-50"
                  >
                    مكتبة الرسائل
                    <Sparkles className="h-4 w-4" />
                  </Link>
                )}

                <Button
                  onClick={complete}
                  disabled={setStatus.isPending}
                  className="press h-11 gap-2 rounded-full bg-gradient-to-l from-emerald-500 to-emerald-600 px-6 font-display text-sm font-extrabold text-white shadow-soft transition hover:from-emerald-600 hover:to-emerald-700"
                >
                  <Check className="h-5 w-5" strokeWidth={3} />
                  تم الإنجاز
                </Button>
              </div>
            </div>

            {/* جانب البومة */}
            <div className="relative hidden flex-col items-center justify-center sm:flex">
              <div
                aria-hidden
                className="blob absolute inset-x-4 inset-y-6 bg-gradient-to-br from-sky-100 to-cyan-50 opacity-80"
              />
              <div className="relative animate-float-y">
                <Owl size={130} pose="point" />
              </div>
              <button
                onClick={() => setDrawerOpen(true)}
                className="press relative mt-1 flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-extrabold text-sky-700 shadow-soft-sm ring-1 ring-sky-100 transition hover:bg-sky-50"
              >
                كيف أنفذها بالتفصيل؟
                <ArrowLeft className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* زر التفاصيل للجوال */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="press flex w-full items-center justify-center gap-1.5 border-t border-sky-100 bg-sky-50/50 py-3 font-display text-[13px] font-extrabold text-sky-700 sm:hidden"
          >
            كيف أنفذها بالتفصيل؟
            <ArrowLeft className="h-4 w-4" />
          </button>
        </div>
      </div>

      <TaskDrawer
        task={drawerTask}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onComplete={() => {
          setDrawerOpen(false);
          complete();
        }}
        completing={setStatus.isPending}
      />
    </>
  );
}
