<<<<<<< HEAD
import {
  Archive,
  Check,
  Clock,
  ExternalLink,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CopyButton, StatusChip, StepsList, TypeChip } from "./shared";
import type { StatusType, TaskType } from "@/lib/types";

export interface DrawerTask {
  key: string;
  title: string;
  timeText?: string;
  recurrenceNote?: string;
  type: TaskType;
  status: StatusType;
  desc?: string | null;
  steps: string[];
  notes?: string | null;
  link?: { title: string; url: string } | null;
  message?: { title: string; body: string } | null;
  done: boolean;
  canArchive?: boolean;
  onToggleDone: () => void;
  onArchive?: () => void;
}

/**
 * Drawer تنفيذ المهمة — لا ينقل المستخدم لصفحة جديدة.
 */
export default function TaskDrawer({
  task,
  onClose,
}: {
  task: DrawerTask | null;
  onClose: () => void;
}) {
  return (
    <Sheet open={!!task} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="left"
        className="flex w-full flex-col gap-0 rounded-r-3xl border-l-0 p-0 sm:max-w-md"
      >
        {task && (
          <>
            <SheetHeader className="border-b border-slate-100 px-6 pb-4 pt-6 text-right">
              <div className="mb-2 flex items-center gap-3">
                <TypeChip type={task.type} />
                <StatusChip status={task.status} />
              </div>
              <SheetTitle className="text-right text-xl font-black leading-snug text-slate-800">
                {task.title}
              </SheetTitle>
              {(task.timeText || task.recurrenceNote) && (
                <SheetDescription className="mt-1.5 flex items-center gap-2 text-right text-[13px] font-bold text-slate-400">
                  <Clock className="h-3.5 w-3.5" />
                  {task.timeText}
                  {task.timeText && task.recurrenceNote ? " · " : ""}
                  {task.recurrenceNote}
                </SheetDescription>
              )}
            </SheetHeader>

            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
              {task.desc && (
                <section>
                  <h4 className="mb-2 text-xs font-black text-slate-400">
                    الهدف
                  </h4>
                  <p className="text-sm font-semibold leading-relaxed text-slate-600">
                    {task.desc}
                  </p>
                </section>
              )}

              {task.steps.length > 0 && (
                <section>
                  <h4 className="mb-3 text-xs font-black text-slate-400">
                    خطوات التنفيذ
                  </h4>
                  <StepsList steps={task.steps} />
                </section>
              )}

              {task.link && (
                <section>
                  <h4 className="mb-2 text-xs font-black text-slate-400">
                    الرابط المرتبط
                  </h4>
                  <a
                    href={task.link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3 transition hover:border-sky-300 hover:bg-sky-50/50"
                  >
                    <span className="text-sm font-extrabold text-slate-700">
                      {task.link.title}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-extrabold text-sky-600">
                      فتح
                      <ExternalLink className="h-3.5 w-3.5" />
                    </span>
                  </a>
                </section>
              )}

              {task.message && (
                <section>
                  <h4 className="mb-2 text-xs font-black text-slate-400">
                    الرسالة المرتبطة
                  </h4>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                    <p className="mb-2 text-[13px] font-extrabold text-slate-600">
                      {task.message.title}
                    </p>
                    <p className="line-clamp-3 whitespace-pre-line text-[13px] font-semibold leading-relaxed text-slate-400">
                      {task.message.body}
                    </p>
                    <div className="mt-3 flex justify-start">
                      <CopyButton text={task.message.body} label="نسخ الرسالة" />
                    </div>
                  </div>
                </section>
              )}

              {task.notes && (
                <section>
                  <h4 className="mb-2 text-xs font-black text-slate-400">
                    ملاحظات
                  </h4>
                  <p className="rounded-xl border border-amber-100 bg-amber-50/70 p-3.5 text-[13px] font-semibold leading-relaxed text-amber-800">
                    {task.notes}
                  </p>
                </section>
              )}
            </div>

            {/* Actions واضحة في الأسفل */}
            <div className="flex items-center gap-2 border-t border-slate-100 bg-white px-6 py-4">
              {task.done ? (
                <>
                  <Button
                    onClick={task.onToggleDone}
                    variant="outline"
                    className="h-11 flex-1 gap-1.5 rounded-xl text-[13px] font-extrabold text-slate-500 hover:bg-slate-50"
                  >
                    <RotateCcw className="h-4 w-4" />
                    إرجاع
                  </Button>
                  {task.canArchive && task.onArchive && (
                    <Button
                      onClick={task.onArchive}
                      className="h-11 flex-1 gap-1.5 rounded-xl bg-emerald-600 text-[13px] font-extrabold text-white hover:bg-emerald-700"
                    >
                      <Archive className="h-4 w-4" />
                      أرشفة
                    </Button>
                  )}
                </>
              ) : (
                <Button
                  onClick={task.onToggleDone}
                  className="h-11 w-full gap-2 rounded-xl bg-sky-500 text-sm font-extrabold text-white hover:bg-sky-600"
                >
                  <Check className="h-4 w-4" strokeWidth={3} />
                  تم الإنجاز
=======
import { ArrowLeft, Check, Clock, ExternalLink, Info } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CopyButton, StepsList, TypeBadge } from "@/components/shared";
import { dayRelativeLabel } from "@/lib/time";
import { findRelatedLink, findRelatedMessage, timeUntilLabel } from "@/lib/commands";
import { useLinks, useMessages } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import type { Frequency } from "@/lib/types";

export interface DrawerTask {
  kind: "special" | "routine" | "scheduled";
  id: string;
  title: string;
  time?: string | null;
  date?: string | null;
  steps: string[];
  notes?: string | null;
  when_note?: string | null;
  what_note?: string | null;
  frequency?: Frequency;
  done: boolean;
}

const KIND_TITLE: Record<DrawerTask["kind"], string> = {
  special: "مهمة خاصة ⭐",
  routine: "مهمة معتادة 🔄",
  scheduled: "مهمة مجدولة 📅",
};

export default function TaskDrawer({
  task,
  open,
  onOpenChange,
  onComplete,
  completing = false,
}: {
  task: DrawerTask | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (task: DrawerTask) => void;
  completing?: boolean;
}) {
  const { data: links = [] } = useLinks();
  const { data: messages = [] } = useMessages();

  const relatedLink = task ? findRelatedLink(task, links) : null;
  const relatedMessage = task ? findRelatedMessage(task, messages) : null;
  const countdown = task ? timeUntilLabel(task.time) : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 overflow-y-auto rounded-l-[28px] border-sky-100 p-0 sm:max-w-md"
      >
        {task && (
          <>
            {/* ترويسة المهمة */}
            <div className="relative overflow-hidden bg-gradient-to-bl from-sky-500 via-sky-500 to-sky-600 px-5 pb-6 pt-5 text-white">
              <div
                aria-hidden
                className="blob absolute -left-10 -top-12 h-36 w-36 bg-white/15 blur-2xl"
              />
              <div
                aria-hidden
                className="absolute -bottom-8 right-6 h-24 w-24 rounded-full bg-white/10 blur-xl"
              />
              <SheetHeader className="relative space-y-0 text-right">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-extrabold backdrop-blur-sm">
                    {KIND_TITLE[task.kind]}
                  </span>
                  {task.done && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-400 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-950">
                      <Check className="h-3 w-3" strokeWidth={3.5} />
                      منجزة
                    </span>
                  )}
                </div>
                <SheetTitle className="text-right font-display text-xl font-extrabold leading-snug text-white">
                  {task.title}
                </SheetTitle>
                <SheetDescription className="text-right text-[13px] font-semibold leading-relaxed text-sky-100">
                  {task.when_note ||
                    task.what_note ||
                    "نفّذ الخطوات بالترتيب ثم أكّد الإنجاز."}
                </SheetDescription>
              </SheetHeader>

              <div className="relative mt-3 flex flex-wrap items-center gap-1.5">
                {task.date && (
                  <span className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-extrabold backdrop-blur-sm">
                    📅 {dayRelativeLabel(task.date)}
                  </span>
                )}
                {task.time && task.time !== "—" && (
                  <span className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 font-display text-[11px] font-extrabold tabular-nums backdrop-blur-sm">
                    <Clock className="h-3 w-3" /> {task.time}
                  </span>
                )}
                {countdown && countdown.state !== "none" && (
                  <span
                    className={cn(
                      "flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-extrabold backdrop-blur-sm",
                      countdown.state === "now"
                        ? "bg-amber-300 text-amber-950"
                        : countdown.state === "past"
                          ? "bg-rose-400/90 text-white"
                          : "bg-emerald-400/90 text-emerald-950",
                    )}
                  >
                    {countdown.label}
                  </span>
                )}
              </div>
            </div>

            {/* الخطوات */}
            <div className="flex-1 space-y-5 px-5 py-5">
              {task.steps.length > 0 ? (
                <div>
                  <p className="mb-3 font-display text-sm font-extrabold text-sky-950">
                    كيف تنفّذها؟ ✏️
                  </p>
                  <StepsList steps={task.steps} />
                </div>
              ) : (
                task.what_note && (
                  <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-3.5 text-sm font-semibold leading-relaxed text-slate-600">
                    {task.what_note}
                  </div>
                )
              )}

              {task.notes && (
                <div className="flex items-start gap-2 rounded-2xl border border-amber-100 bg-amber-50/80 p-3 text-[13px] font-semibold leading-relaxed text-amber-800">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  {task.notes}
                </div>
              )}

              {/* أدوات سريعة مرتبطة بالمهمة تلقائيًا */}
              {(relatedLink || relatedMessage) && (
                <div>
                  <p className="mb-2 font-display text-sm font-extrabold text-sky-950">
                    أدوات جاهزة لك 🧰
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {relatedLink && (
                      <a
                        href={relatedLink.url}
                        target="_blank"
                        rel="noreferrer"
                        className="press flex items-center gap-1.5 rounded-full bg-gradient-to-l from-sky-500 to-sky-600 px-4 py-2 text-xs font-extrabold text-white shadow-soft-sm transition hover:from-sky-600 hover:to-sky-700"
                      >
                        فتح {relatedLink.title}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {relatedMessage && (
                      <CopyButton
                        text={relatedMessage.body}
                        label="نسخ الرسالة الجاهزة"
                        big={false}
                      />
                    )}
                  </div>
                </div>
              )}

              <Link
                to="/guide"
                className="flex items-center justify-between rounded-2xl border border-sky-100 bg-white p-3 text-[13px] font-extrabold text-sky-700 shadow-soft-sm transition hover:bg-sky-50"
                onClick={() => onOpenChange(false)}
              >
                <span className="flex items-center gap-2">
                  📖 تحتاج شرحًا أعمق؟ دليل التنفيذ
                </span>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>

            {/* إنهاء المهمة */}
            <div className="sticky bottom-0 border-t border-sky-100 bg-white/90 p-4 backdrop-blur-md">
              {task.done ? (
                <div className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-emerald-50 font-display text-sm font-extrabold text-emerald-600">
                  <Check className="h-5 w-5 animate-check-pop" strokeWidth={3} />
                  هذه المهمة منجزة — أحسنت!
                </div>
              ) : (
                <Button
                  onClick={() => onComplete(task)}
                  disabled={completing}
                  className="press h-12 w-full gap-2 rounded-2xl bg-gradient-to-l from-emerald-500 to-emerald-600 font-display text-[15px] font-extrabold text-white shadow-soft transition hover:from-emerald-600 hover:to-emerald-700"
                >
                  <Check className="h-5 w-5" strokeWidth={3} />
                  {completing ? "لحظة..." : "✓ إنهاء المهمة"}
>>>>>>> c683bf5f3d8ed3a7fc6b1bf2ec146ec0c53ce734
                </Button>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
<<<<<<< HEAD
=======

/** يحوّل أنواع المهام إلى مهمة Drawer موحدة */
export function toDrawerTask(input: {
  kind: DrawerTask["kind"];
  id: string;
  title: string;
  time?: string | null;
  date?: string | null;
  steps?: string[];
  notes?: string | null;
  when_note?: string | null;
  what_note?: string | null;
  frequency?: Frequency;
  done: boolean;
}): DrawerTask {
  return { steps: [], ...input };
}
>>>>>>> c683bf5f3d8ed3a7fc6b1bf2ec146ec0c53ce734
