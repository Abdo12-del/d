import { Copy, ExternalLink } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  CopyButton,
  EmptyState,
  ListContainer,
  LoadingRows,
  PageHeader,
  SegmentedControl,
  copyToClipboard,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useMessages } from "@/lib/hooks";
import {
  CATEGORY_LABEL,
  MESSAGE_CATEGORIES,
  type MessageCategory,
  type MessageTemplate,
} from "@/lib/types";

type Filter = "all" | MessageCategory;

const WHATSAPP_URL = "https://web.whatsapp.com";

export default function Messages() {
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<MessageTemplate | null>(null);
  const { data: messages = [], isLoading } = useMessages();

  const counts = (f: Filter) =>
    f === "all"
      ? messages.length
      : messages.filter((m) => m.category === f).length;

  const list =
    filter === "all"
      ? messages
      : messages.filter((m) => m.category === filter);

  return (
    <div className="space-y-5">
      <PageHeader
        title="مكتبة الرسائل"
        desc="ماذا أرسل؟ رسائل جاهزة تُنسخ بضغطة — لا تغيّر نصها إلا إذا طُلب منك."
      />

      <SegmentedControl
        value={filter}
        onChange={setFilter}
        options={[
          { value: "all", label: "الجميع", badge: counts("all") },
          ...MESSAGE_CATEGORIES.map((c) => ({
            value: c,
            label: CATEGORY_LABEL[c],
            badge: counts(c),
          })),
        ]}
      />

      {isLoading ? (
        <LoadingRows />
      ) : list.length === 0 ? (
        <EmptyState
          title="لا توجد رسائل في هذا التصنيف"
          hint="أضف رسائل من صفحة إدارة المحتوى"
        />
      ) : (
        <ListContainer>
          {list.map((msg) => (
            <div
              key={msg.id}
              className="flex items-center gap-4 px-5 py-4 transition hover:bg-sky-50/30"
            >
              <button
                onClick={() => setSelected(msg)}
                className="min-w-0 flex-1 text-right"
              >
                <p className="text-sm font-extrabold text-slate-800">
                  {msg.title}
                </p>
                <p className="mt-0.5 truncate text-xs font-semibold text-slate-400">
                  {msg.body.replace(/\n/g, " ")}
                </p>
              </button>
              <span className="hidden shrink-0 text-[11px] font-extrabold text-slate-300 sm:block">
                {CATEGORY_LABEL[msg.category]}
              </span>
              <button
                onClick={async () => {
                  const ok = await copyToClipboard(msg.body);
                  if (ok) toast.success("تم نسخ الرسالة ✓");
                }}
                aria-label={`نسخ ${msg.title}`}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          ))}
        </ListContainer>
      )}

      {/* عرض الرسالة كاملة */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent
          side="left"
          className="flex w-full flex-col gap-0 rounded-r-3xl border-l-0 p-0 sm:max-w-md"
        >
          {selected && (
            <>
              <SheetHeader className="border-b border-slate-100 px-6 pb-4 pt-6 text-right">
                <SheetTitle className="text-right text-lg font-black text-slate-800">
                  {selected.title}
                </SheetTitle>
                <SheetDescription className="text-right text-xs font-extrabold text-slate-400">
                  {CATEGORY_LABEL[selected.category]}
                </SheetDescription>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto px-6 py-5">
                <p className="select-text whitespace-pre-line rounded-2xl bg-slate-50 p-4 text-sm font-semibold leading-loose text-slate-700">
                  {selected.body}
                </p>
              </div>
              <div className="flex items-center gap-2 border-t border-slate-100 bg-white px-6 py-4">
                <CopyButton
                  text={selected.body}
                  label="نسخ الرسالة"
                  variant="primary"
                />
                <Button
                  asChild
                  variant="outline"
                  className="h-9 flex-1 gap-1.5 rounded-xl border-slate-200 text-xs font-extrabold text-slate-600 hover:border-emerald-300 hover:text-emerald-700"
                >
                  <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                    فتح WhatsApp
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
