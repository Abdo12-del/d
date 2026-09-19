import { Check, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { QUERY_KEYS, saveRow, TABLES } from "@/lib/data";
import { useLinks, useMessages } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { WEEKDAY_NAMES, WEEK_ORDER } from "@/lib/time";
import type { Frequency, RoutineTask } from "@/lib/types";

/**
 * نموذج إنشاء/تعديل روتين — يعبئه المستخدم ببياناته الحقيقية فقط.
 */
export default function RoutineForm({
  open,
  onClose,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  initial?: RoutineTask | null;
}) {
  const qc = useQueryClient();
  const { data: links = [] } = useLinks();
  const { data: messages = [] } = useMessages();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("daily");
  const [weekdays, setWeekdays] = useState<number[]>([]);
  const [monthDay, setMonthDay] = useState<string>("1");
  const [time, setTime] = useState("");
  const [owner, setOwner] = useState("");
  const [steps, setSteps] = useState("");
  const [linkId, setLinkId] = useState<string>("");
  const [messageId, setMessageId] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(initial?.title ?? "");
      setDescription(initial?.description ?? "");
      setFrequency(initial?.frequency ?? "daily");
      setWeekdays(initial?.weekdays ?? []);
      setMonthDay(String(initial?.month_day ?? 1));
      setTime(initial?.time ?? "");
      setOwner(initial?.owner ?? "");
      setSteps((initial?.steps ?? []).join("\n"));
      setLinkId(initial?.link_id ?? "");
      setMessageId(initial?.message_id ?? "");
      setNotes(initial?.notes ?? "");
      setActive(initial?.status !== "paused");
    }
  }, [open, initial]);

  const toggleWeekday = (d: number) =>
    setWeekdays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d],
    );

  const save = async () => {
    if (!title.trim()) {
      toast.error("اسم الروتين مطلوب");
      return;
    }
    if (frequency === "weekly" && weekdays.length === 0) {
      toast.error("اختر أيام الأسبوع للروتين الأسبوعي");
      return;
    }
    setSaving(true);
    try {
      await saveRow(TABLES.routine, {
        id: initial?.id,
        title: title.trim(),
        description: description.trim() || null,
        frequency,
        weekdays: frequency === "weekly" ? weekdays : [],
        month_day: frequency === "monthly" ? Number(monthDay) : null,
        time: time || null,
        owner: owner.trim() || null,
        steps: steps
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        link_id: linkId && linkId !== "none" ? linkId : null,
        message_id: messageId && messageId !== "none" ? messageId : null,
        notes: notes.trim() || null,
        status: active ? "active" : "paused",
        sort_order: initial?.sort_order ?? 0,
      });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.routine });
      toast.success(initial ? "تم حفظ التعديلات ✓" : "تمت إضافة الروتين ✓");
      onClose();
    } catch {
      toast.error("تعذّر الحفظ — حاول مرة أخرى");
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "h-11 rounded-xl border-slate-200 bg-white text-sm font-semibold";
  const areaCls = "rounded-xl border-slate-200 bg-white text-sm font-semibold";

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[88dvh] overflow-y-auto rounded-3xl sm:max-w-lg">
        <DialogHeader className="text-right">
          <DialogTitle className="text-right text-lg font-black text-slate-800">
            {initial ? "تعديل الروتين" : "إضافة روتين"}
          </DialogTitle>
          <DialogDescription className="text-right text-xs font-semibold text-slate-400">
            الروتين قالب لمهمة متكررة — ستتولّد مهامه تلقائيًا في مواعيدها.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* اسم الروتين */}
          <div>
            <Label className="mb-1.5 block text-xs font-black text-slate-600">
              اسم الروتين <span className="text-rose-500">*</span>
            </Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: متابعة الرسائل الواردة"
              className={inputCls}
            />
          </div>

          {/* وصف مختصر */}
          <div>
            <Label className="mb-1.5 block text-xs font-black text-slate-600">
              وصف مختصر
            </Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ماذا تفعل في هذا الروتين؟"
              className={areaCls}
              rows={2}
            />
          </div>

          {/* نوع التكرار */}
          <div>
            <Label className="mb-1.5 block text-xs font-black text-slate-600">
              نوع التكرار
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { v: "daily", l: "يومي" },
                  { v: "weekly", l: "أسبوعي" },
                  { v: "monthly", l: "شهري" },
                ] as { v: Frequency; l: string }[]
              ).map((opt) => (
                <button
                  key={opt.v}
                  type="button"
                  onClick={() => setFrequency(opt.v)}
                  className={cn(
                    "rounded-xl border py-2.5 text-[13px] font-extrabold transition",
                    frequency === opt.v
                      ? "border-sky-500 bg-sky-50 text-sky-700"
                      : "border-slate-200 bg-white text-slate-400 hover:border-sky-200",
                  )}
                >
                  {opt.l}
                </button>
              ))}
            </div>
          </div>

          {/* الأيام / التاريخ حسب التكرار */}
          {frequency === "weekly" && (
            <div>
              <Label className="mb-1.5 block text-xs font-black text-slate-600">
                أيام الأسبوع <span className="text-rose-500">*</span>
              </Label>
              <div className="flex flex-wrap gap-1.5">
                {WEEK_ORDER.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleWeekday(d)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-extrabold transition",
                      weekdays.includes(d)
                        ? "bg-sky-500 text-white"
                        : "bg-slate-50 text-slate-500 hover:bg-slate-100",
                    )}
                  >
                    {WEEKDAY_NAMES[d]}
                  </button>
                ))}
              </div>
            </div>
          )}
          {frequency === "monthly" && (
            <div>
              <Label className="mb-1.5 block text-xs font-black text-slate-600">
                يوم الشهر
              </Label>
              <Select value={monthDay} onValueChange={setMonthDay}>
                <SelectTrigger className={cn(inputCls, "w-full")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                    <SelectItem key={d} value={String(d)}>
                      يوم {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* الوقت + المسؤول */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="mb-1.5 block text-xs font-black text-slate-600">
                الوقت المقترح
              </Label>
              <Input
                type="time"
                dir="ltr"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={cn(inputCls, "text-left")}
              />
            </div>
            <div>
              <Label className="mb-1.5 block text-xs font-black text-slate-600">
                المسؤول عن التنفيذ
              </Label>
              <Input
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="اسمك أو اسم موظف"
                className={inputCls}
              />
            </div>
          </div>

          {/* الخطوات */}
          <div>
            <Label className="mb-1.5 block text-xs font-black text-slate-600">
              خطوات تنفيذ الروتين
            </Label>
            <Textarea
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              placeholder={"اكتب كل خطوة في سطر منفصل"}
              className={areaCls}
              rows={4}
            />
          </div>

          {/* رابط + رسالة مرتبطان */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="mb-1.5 block text-xs font-black text-slate-600">
                رابط مرتبط (إن وجد)
              </Label>
              <Select value={linkId || "none"} onValueChange={setLinkId}>
                <SelectTrigger className={cn(inputCls, "w-full")}>
                  <SelectValue placeholder="بدون رابط" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">بدون رابط</SelectItem>
                  {links.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1.5 block text-xs font-black text-slate-600">
                رسالة مرتبطة (إن وجدت)
              </Label>
              <Select value={messageId || "none"} onValueChange={setMessageId}>
                <SelectTrigger className={cn(inputCls, "w-full")}>
                  <SelectValue placeholder="بدون رسالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">بدون رسالة</SelectItem>
                  {messages.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ملاحظات */}
          <div>
            <Label className="mb-1.5 block text-xs font-black text-slate-600">
              ملاحظات
            </Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="أي تفاصيل إضافية (اختياري)"
              className={areaCls}
              rows={2}
            />
          </div>

          {/* حالة الروتين */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3">
            <span className="text-[13px] font-extrabold text-slate-600">
              حالة الروتين
            </span>
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  "text-xs font-black",
                  active ? "text-emerald-600" : "text-slate-400",
                )}
              >
                {active ? "نشط" : "متوقف"}
              </span>
              <Switch checked={active} onCheckedChange={setActive} />
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              onClick={save}
              disabled={saving}
              className="h-11 flex-1 gap-1.5 rounded-xl bg-sky-500 text-sm font-extrabold text-white hover:bg-sky-600"
            >
              {saving ? (
                "جارٍ الحفظ..."
              ) : (
                <>
                  {initial ? (
                    <Check className="h-4 w-4" strokeWidth={3} />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {initial ? "حفظ التعديلات" : "حفظ الروتين"}
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="h-11 rounded-xl text-sm font-extrabold"
            >
              إلغاء
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
