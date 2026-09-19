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
                </Button>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
