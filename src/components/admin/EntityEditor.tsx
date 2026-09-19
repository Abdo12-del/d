import { Check, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { removeRow, saveRow, selectAll } from "@/lib/data";
import { useMessages } from "@/lib/hooks";
import { WEEKDAY_NAMES, WEEK_ORDER } from "@/lib/time";
import type { GuideSection } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { FieldDef, ResourceConfig, Row } from "./configs";

/* eslint-disable @typescript-eslint/no-explicit-any */

function WeekdaysPicker({
  value,
  onChange,
}: {
  value: number[];
  onChange: (v: number[]) => void;
}) {
  const toggle = (d: number) => {
    onChange(value.includes(d) ? value.filter((x) => x !== d) : [...value, d]);
  };
  return (
    <div className="flex flex-wrap gap-1.5">
      <button
        type="button"
        onClick={() => onChange([])}
        className={cn(
          "rounded-full px-3 py-1.5 font-display text-xs font-extrabold transition",
          value.length === 0
            ? "bg-gradient-to-l from-sky-500 to-sky-600 text-white shadow-soft-sm"
            : "bg-sky-50 text-sky-600 hover:bg-sky-100",
        )}
      >
        يوميًا
      </button>
      {WEEK_ORDER.map((d) => (
        <button
          key={d}
          type="button"
          onClick={() => toggle(d)}
          className={cn(
            "rounded-full px-3 py-1.5 font-display text-xs font-extrabold transition",
            value.includes(d)
              ? "bg-gradient-to-l from-sky-500 to-sky-600 text-white shadow-soft-sm"
              : "bg-sky-50 text-sky-600 hover:bg-sky-100",
          )}
        >
          {WEEKDAY_NAMES[d]}
        </button>
      ))}
    </div>
  );
}

function SectionsEditor({
  value,
  onChange,
}: {
  value: GuideSection[];
  onChange: (v: GuideSection[]) => void;
}) {
  const update = (i: number, patch: Partial<GuideSection>) => {
    const next = value.map((s, idx) => (idx === i ? { ...s, ...patch } : s));
    onChange(next);
  };
  return (
    <div className="space-y-3">
      {value.map((section, i) => (
        <div
          key={i}
          className="rounded-2xl border border-violet-100 bg-violet-50/50 p-3"
        >
          <div className="flex items-center gap-2">
            <Input
              value={section.heading}
              onChange={(e) => update(i, { heading: e.target.value })}
              placeholder={`عنوان القسم ${i + 1} (مثال: قبل الجلسة)`}
              className="h-9 flex-1 rounded-xl border-violet-200 bg-white text-sm font-bold"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 rounded-xl text-rose-400 hover:bg-rose-50"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <Textarea
            value={section.steps.join("\n")}
            onChange={(e) =>
              update(i, { steps: e.target.value.split("\n") })
            }
            placeholder={"كل خطوة في سطر منفصل"}
            className="mt-2 rounded-xl border-violet-200 bg-white text-sm"
            rows={3}
          />
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => onChange([...value, { heading: "", steps: [] }])}
        className="h-9 w-full rounded-xl border border-dashed border-violet-300 font-display text-xs font-extrabold text-violet-600 hover:bg-violet-50"
      >
        <Plus className="h-4 w-4" />
        إضافة قسم
      </Button>
    </div>
  );
}

/** اختيار رسالة من مكتبة الرسائل */
function MessageSelect({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  const { data: messages = [] } = useMessages();
  return (
    <Select
      value={value ?? "none"}
      onValueChange={(v) => onChange(v === "none" ? null : v)}
    >
      <SelectTrigger className="h-11 w-full rounded-xl border-sky-200 bg-white text-sm font-semibold">
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
  );
}

function FieldInput({
  field,
  draft,
  setDraft,
}: {
  field: FieldDef;
  draft: Row;
  setDraft: (row: Row) => void;
}) {
  const common = "rounded-xl border-sky-200 bg-white text-sm font-semibold";

  switch (field.type) {
    case "text":
      return (
        <Input
          value={draft[field.key] ?? ""}
          onChange={(e) => setDraft({ ...draft, [field.key]: e.target.value })}
          placeholder={field.placeholder}
          className={cn(common, "h-11")}
        />
      );
    case "message-select":
      return (
        <MessageSelect
          value={draft[field.key] ?? null}
          onChange={(v) => setDraft({ ...draft, [field.key]: v })}
        />
      );
    case "url":
      return (
        <Input
          dir="ltr"
          value={draft[field.key] ?? ""}
          onChange={(e) => setDraft({ ...draft, [field.key]: e.target.value })}
          placeholder={field.placeholder}
          className={cn(common, "h-11 text-left")}
        />
      );
    case "textarea":
      return (
        <Textarea
          value={draft[field.key] ?? ""}
          onChange={(e) => setDraft({ ...draft, [field.key]: e.target.value })}
          placeholder={field.placeholder}
          className={common}
          rows={3}
        />
      );
    case "steps":
      return (
        <Textarea
          dir="rtl"
          value={(draft[field.key] as string[]).join("\n")}
          onChange={(e) =>
            setDraft({ ...draft, [field.key]: e.target.value.split("\n") })
          }
          placeholder={"اكتب كل خطوة في سطر منفصل"}
          className={common}
          rows={4}
        />
      );
    case "select":
      return (
        <Select
          value={String(draft[field.key] ?? "none")}
          onValueChange={(v) =>
            setDraft({
              ...draft,
              [field.key]:
                v === "none"
                  ? null
                  : field.coerceInt
                    ? Number.parseInt(v, 10)
                    : v,
            })
          }
        >
          <SelectTrigger className={cn(common, "h-11 w-full")}>
            <SelectValue placeholder="اختر..." />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case "switch":
      return (
        <div className="flex items-center gap-3 rounded-xl border border-sky-100 bg-sky-50/50 px-4 py-3">
          <Switch
            checked={!!draft[field.key]}
            onCheckedChange={(v) => setDraft({ ...draft, [field.key]: v })}
          />
          <span className="text-sm font-bold text-slate-600">
            {draft[field.key] ? "نعم" : "لا"}
          </span>
        </div>
      );
    case "date":
      return (
        <Input
          type="date"
          dir="ltr"
          value={draft[field.key] ?? ""}
          onChange={(e) =>
            setDraft({ ...draft, [field.key]: e.target.value || null })
          }
          className={cn(common, "h-11 text-left")}
        />
      );
    case "time":
      return (
        <Input
          type="time"
          dir="ltr"
          value={draft[field.key] ?? ""}
          onChange={(e) =>
            setDraft({ ...draft, [field.key]: e.target.value || null })
          }
          className={cn(common, "h-11 text-left")}
        />
      );
    case "weekdays":
      return (
        <WeekdaysPicker
          value={(draft[field.key] as number[]) ?? []}
          onChange={(v) => setDraft({ ...draft, [field.key]: v })}
        />
      );
    case "sections":
      return (
        <SectionsEditor
          value={(draft[field.key] as GuideSection[]) ?? []}
          onChange={(v) => setDraft({ ...draft, [field.key]: v })}
        />
      );
  }
}

export default function EntityEditor({ config }: { config: ResourceConfig }) {
  const qc = useQueryClient();
  const { data: rows = [], isLoading } = useQuery({
    queryKey: config.queryKey,
    queryFn: () => selectAll(config.table),
  });

  const [draft, setDraft] = useState<Row | null>(null);
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    const nextOrder =
      rows.reduce((max, r) => Math.max(max, Number(r.sort_order) || 0), 0) + 1;
    setDraft({ ...structuredClone(config.defaults), sort_order: nextOrder });
  };

  const openEdit = (row: Row) => setDraft({ ...structuredClone(row) });

  const save = async () => {
    if (!draft) return;
    const missing = config.fields.find(
      (f) =>
        f.required && !String(draft[f.key] ?? "").trim(),
    );
    if (missing) {
      toast.error(`الحقل مطلوب: ${missing.label}`);
      return;
    }
    setSaving(true);
    try {
      await saveRow(config.table, buildPayload(config, draft));
      qc.invalidateQueries({ queryKey: config.queryKey });
      toast.success("تم الحفظ ✓");
      setDraft(null);
    } catch {
      toast.error("تعذّر الحفظ — حاول مرة أخرى");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!draft) return;
    try {
      await removeRow(config.table, draft.id as string);
      qc.invalidateQueries({ queryKey: config.queryKey });
      toast.success("تم الحذف");
      setDraft(null);
    } catch {
      toast.error("تعذّر الحذف — حاول مرة أخرى");
    }
  };

  const isNew = draft && !draft.id;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="font-display text-xs font-extrabold text-slate-400">
          {rows.length} {config.singular} محفوظة
        </p>
        <Button
          onClick={openCreate}
          className="press h-10 gap-1.5 rounded-full bg-gradient-to-l from-sky-500 to-sky-600 px-4 font-display text-sm font-extrabold text-white shadow-soft-sm hover:from-sky-600 hover:to-sky-700"
        >
          <Plus className="h-4 w-4" />
          إضافة {config.singular}
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-2xl border border-sky-100 bg-sky-50/60"
            />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-sky-200 bg-sky-50/40 px-6 py-10 text-center">
          <p className="font-display text-sm font-extrabold text-slate-500">
            لا يوجد محتوى هنا بعد
          </p>
          <p className="mt-1 text-xs font-bold text-slate-400">
            اضغط "إضافة" لإنشاء أول {config.singular}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {rows.map((row) => (
            <div
              key={row.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-sky-100 bg-white px-4 py-3 shadow-soft-sm"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate font-display text-sm font-extrabold text-sky-950">
                    {config.rowTitle(row)}
                  </p>
                  {config.rowBadge?.(row) && (
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black",
                        config.badgeClass?.(row) ?? "bg-sky-100 text-sky-700",
                      )}
                    >
                      {config.rowBadge(row)}
                    </span>
                  )}
                </div>
                {config.rowSubtitle?.(row) && (
                  <p className="mt-0.5 truncate text-xs font-semibold text-slate-400">
                    {config.rowSubtitle(row)}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  size="icon"
                  variant="outline"
                  className="press h-9 w-9 rounded-xl border border-sky-200 bg-white text-sky-600 hover:bg-sky-50"
                  onClick={() => openEdit(row)}
                  aria-label="تعديل"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* نافذة التعديل */}
      <Dialog open={!!draft} onOpenChange={(o) => !o && setDraft(null)}>
        <DialogContent className="max-h-[85dvh] overflow-y-auto rounded-3xl sm:max-w-lg">
          <DialogHeader className="text-right">
            <DialogTitle className="text-right font-display text-lg font-extrabold text-sky-950">
              {isNew ? `إضافة ${config.singular}` : `تعديل ${config.singular}`}
            </DialogTitle>
            <DialogDescription className="text-right">
              التعديلات تظهر فورًا في صفحة المساعد.
            </DialogDescription>
          </DialogHeader>

          {draft && (
            <div className="space-y-4">
              {config.fields.map((field) => (
                <div key={field.key}>
                  <label className="mb-1.5 block font-display text-xs font-extrabold text-slate-600">
                    {field.label}
                    {field.required && <span className="text-rose-500"> *</span>}
                  </label>
                  <FieldInput
                    field={field}
                    draft={draft}
                    setDraft={setDraft}
                  />
                  {field.hint && (
                    <p className="mt-1 text-[11px] font-semibold text-slate-400">
                      {field.hint}
                    </p>
                  )}
                </div>
              ))}

              <div className="flex items-center gap-2 pt-2">
                <Button
                  onClick={save}
                  disabled={saving}
                  className="press h-11 flex-1 gap-1.5 rounded-2xl bg-gradient-to-l from-sky-500 to-sky-600 font-display text-sm font-extrabold text-white shadow-soft-sm hover:from-sky-600 hover:to-sky-700"
                >
                  <Check className="h-4 w-4" />
                  {saving ? "جارٍ الحفظ..." : "حفظ"}
                </Button>
                {!isNew && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-11 gap-1.5 rounded-2xl border border-rose-200 bg-rose-50 px-4 font-display text-sm font-extrabold text-rose-500 hover:bg-rose-100"
                      >
                        <Trash2 className="h-4 w-4" />
                        حذف
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-3xl">
                      <AlertDialogHeader className="text-right">
                        <AlertDialogTitle className="text-right">
                          تأكيد الحذف؟
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-right">
                          سيتم حذف هذا العنصر نهائيًا ولا يمكن التراجع.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex-row gap-2">
                        <AlertDialogAction
                          onClick={remove}
                          className="flex-1 rounded-2xl bg-rose-500 font-display font-extrabold hover:bg-rose-600"
                        >
                          حذف نهائي
                        </AlertDialogAction>
                        <AlertDialogCancel className="flex-1 rounded-2xl border border-sky-200 font-display font-extrabold">
                          إلغاء
                        </AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                <Button
                  variant="outline"
                  onClick={() => setDraft(null)}
                  className="h-11 rounded-2xl border border-sky-200 font-display text-sm font-extrabold"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function buildPayload(config: ResourceConfig, draft: Row): Row {
  const payload: Row = { ...draft };
  for (const field of config.fields) {
    const v = payload[field.key];
    if (field.type === "steps") {
      payload[field.key] = Array.isArray(v)
        ? v.map((s: any) => String(s).trim()).filter(Boolean)
        : [];
    } else if (field.type === "sections") {
      payload[field.key] = Array.isArray(v)
        ? v
            .map((s: any) => ({
              heading: String(s.heading ?? "").trim(),
              steps: Array.isArray(s.steps)
                ? s.steps.map((x: any) => String(x).trim()).filter(Boolean)
                : [],
            }))
            .filter((s) => s.heading)
        : [];
    } else if (field.type === "text" || field.type === "textarea" || field.type === "url") {
      payload[field.key] = typeof v === "string" ? v.trim() : v;
      if (payload[field.key] === "") payload[field.key] = null;
    } else if (field.type === "date" || field.type === "time") {
      if (!v) payload[field.key] = null;
    } else if (field.type === "select" && field.coerceInt) {
      payload[field.key] =
        v == null || v === "" || v === "none"
          ? null
          : Number.parseInt(String(v), 10);
    }
  }
  if (payload.notes === "") payload.notes = null;
  return payload;
}
