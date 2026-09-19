import {
  CalendarDays,
  Check,
  Clock,
  Copy,
  ExternalLink,
  Link as LinkIcon,
  MessageSquare,
  Users,
} from "lucide-react";
import { externalHref } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { StatusChip, TypeChip, copyToClipboard } from "./shared";
import {
  renderSessionMessage,
  sessionStatus,
  sessionTimeText,
} from "@/lib/sessionUtils";
import { formatArabicDate, todayISO } from "@/lib/time";
import type { MessageTemplate, Session } from "@/lib/types";

/**
 * Drawer الجلسة — كل شيء في مكان واحد:
 * الفوج، النشاط، الموعد، الرابط، والرسالة المرتبطة بهذه الجلسة تحديدًا.
 */
export default function SessionSheet({
  session,
  iso,
  message,
  onClose,
}: {
  session: Session | null;
  /** تاريخ الانعقاد المعروض */
  iso: string | null;
  message: MessageTemplate | null;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState<"link" | "message" | null>(null);

  const markCopied = (kind: "link" | "message") => {
    setCopied(kind);
    setTimeout(() => setCopied(null), 2000);
  };

  const date = iso ?? session?.date ?? todayISO();
  const filledBody =
    session && message ? renderSessionMessage(message.body, session, date) : null;

  return (
    <Sheet open={!!session} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="left"
        className="flex w-full flex-col gap-0 rounded-r-3xl border-l-0 p-0 sm:max-w-md"
      >
        {session && (
          <>
            <SheetHeader className="border-b border-slate-100 px-6 pb-4 pt-6 text-right">
              <div className="mb-2 flex items-center gap-3">
                <TypeChip type="scheduled" />
                <StatusChip status={sessionStatus(session, date)} />
              </div>
              <SheetTitle className="text-right text-xl font-black leading-snug text-slate-800">
                {session.activity}
              </SheetTitle>
              <SheetDescription className="mt-1 flex items-center gap-2 text-right text-[13px] font-bold text-slate-400">
                <Users className="h-3.5 w-3.5" />
                الفوج: {session.group_name}
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
              {/* السياق التلقائي */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 px-3.5 py-3">
                  <p className="mb-1 flex items-center gap-1.5 text-[11px] font-black text-slate-400">
                    <CalendarDays className="h-3.5 w-3.5" />
                    الموعد
                  </p>
                  <p className="text-[13px] font-extrabold text-slate-700">
                    {formatArabicDate(date, { withWeekday: true })}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 px-3.5 py-3">
                  <p className="mb-1 flex items-center gap-1.5 text-[11px] font-black text-slate-400">
                    <Clock className="h-3.5 w-3.5" />
                    الوقت
                  </p>
                  <p className="text-[13px] font-extrabold tabular-nums text-slate-700">
                    {sessionTimeText(session)}
                  </p>
                </div>
              </div>

              {/* الرابط */}
              {session.meet_url ? (
                <a
                  href={externalHref(session.meet_url)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-3 rounded-xl border border-sky-200 bg-sky-50/60 px-4 py-3.5 transition hover:bg-sky-100/60"
                >
                  <span className="min-w-0">
                    <span className="block text-[13px] font-extrabold text-sky-800">
                      رابط جلسة {session.group_name}
                    </span>
                    <span
                      className="block truncate text-[11px] font-semibold text-sky-500"
                      dir="ltr"
                    >
                      {session.meet_url}
                    </span>
                  </span>
                  <ExternalLink className="h-4 w-4 shrink-0 text-sky-500" />
                </a>
              ) : (
                <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50/60 px-4 py-3.5">
                  <p className="text-[13px] font-extrabold text-amber-700">
                    لم يتم ربط رابط بهذه الجلسة.
                  </p>
                  <p className="mt-0.5 text-[11px] font-semibold text-amber-500">
                    يمكن إضافته من إدارة المحتوى ← الجلسات ← تعديل الجلسة
                  </p>
                </div>
              )}

              {/* معاينة الرسالة معبأة ببيانات الجلسة */}
              {filledBody && (
                <div>
                  <h4 className="mb-2 flex items-center gap-1.5 text-xs font-black text-slate-400">
                    <MessageSquare className="h-3.5 w-3.5" />
                    رسالة هذه الجلسة — جاهزة ببياناتها
                  </h4>
                  <p className="select-text whitespace-pre-line rounded-xl border border-slate-200 bg-slate-50/60 p-4 text-[13px] font-semibold leading-loose text-slate-600">
                    {filledBody}
                  </p>
                </div>
              )}
            </div>

            {/* الأزرار */}
            <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 bg-white px-6 py-4">
              {session.meet_url && (
                <Button
                  asChild
                  className="h-11 flex-1 gap-1.5 rounded-xl bg-sky-500 text-[13px] font-extrabold text-white hover:bg-sky-600"
                >
                  <a href={externalHref(session.meet_url)} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    دخول إلى Google Meet
                  </a>
                </Button>
              )}
              {session.meet_url && (
                <Button
                  variant="outline"
                  onClick={async () => {
                    const ok = await copyToClipboard(session.meet_url!);
                    if (ok) {
                      markCopied("link");
                      toast.success("تم نسخ رابط الجلسة ✓");
                    }
                  }}
                  className="h-11 gap-1.5 rounded-xl border-slate-200 text-[13px] font-extrabold text-slate-600 hover:border-sky-300 hover:text-sky-700"
                >
                  {copied === "link" ? (
                    <Check className="h-4 w-4" strokeWidth={3} />
                  ) : (
                    <LinkIcon className="h-4 w-4" />
                  )}
                  نسخ الرابط
                </Button>
              )}
              {filledBody && (
                <Button
                  variant="outline"
                  onClick={async () => {
                    const ok = await copyToClipboard(filledBody);
                    if (ok) {
                      markCopied("message");
                      toast.success("تم نسخ رسالة الجلسة ✓");
                    }
                  }}
                  className="h-11 gap-1.5 rounded-xl border-slate-200 text-[13px] font-extrabold text-slate-600 hover:border-sky-300 hover:text-sky-700"
                >
                  {copied === "message" ? (
                    <Check className="h-4 w-4" strokeWidth={3} />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  نسخ رسالة الجلسة
                </Button>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
