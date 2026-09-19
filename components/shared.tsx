import { Check, Copy, type LucideIcon } from "lucide-react";
import {
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Owl, OwlSpeech } from "./Owl";
import {
  STATUS_LABEL,
  STATUS_STYLE,
  TASK_TYPE_DOT,
  TASK_TYPE_LABEL,
  TASK_TYPE_STYLE,
  TASK_TYPE_TEXT,
  type StatusType,
  type TaskType,
} from "@/lib/types";

const TONE_STYLES: Record<string, string> = {
  sky: "bg-sky-100 text-sky-600",
  violet: "bg-violet-100 text-violet-600",
  amber: "bg-amber-100 text-amber-600",
  rose: "bg-rose-100 text-rose-500",
  emerald: "bg-emerald-100 text-emerald-600",
};
export function PageHeader({
  title,
  desc,
  action,
}: {
  title: string;
  desc: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-800 sm:text-[28px]">
          {title}
        </h1>
        <p className="mt-1.5 text-sm font-medium leading-relaxed text-slate-400">
          {desc}
        </p>
      </div>
      {action}
    </div>
  );
}

/* ─── عنوان قسم صغير وهادئ ─── */
export function SectionLabel({
  children,
  actionTo,
  actionLabel,
  desc,
}: {
  children: ReactNode;
  actionTo?: string;
  actionLabel?: string;
  desc?: string;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-[15px] font-black text-slate-700">{children}</h2>
      {actionTo && (
        <Link
          to={actionTo}
          className="shrink-0 text-xs font-extrabold text-sky-600 transition hover:text-sky-700"
        >
          {actionLabel ?? "عرض الكل"} ←
        </Link>
      )}
    </div>
  );
}

/* ─── نوع المهمة: نقطة + نص ─── */
export function TypeChip({ type }: { type: TaskType }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 text-[11px] font-extrabold",
        TASK_TYPE_TEXT[type],
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", TASK_TYPE_DOT[type])} />
      {TASK_TYPE_LABEL[type]}
    </span>
  );
}

/** شارة النوع — الفصل البصري بين ROUTINE / SCHEDULED / SPECIAL */
export function TypeBadge({ type, className }: { type: TaskType; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ring-1",
        TASK_TYPE_STYLE[type],
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", TASK_TYPE_DOT[type])} />
      {TASK_TYPE_LABEL[type]}
    </span>
  );
}

/* ─── حالة المهمة ─── */
export function StatusChip({ status }: { status: StatusType }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 text-[11px] font-extrabold",
        STATUS_STYLE[status],
      )}
    >
      {status === "done" && <Check className="h-3 w-3" strokeWidth={3} />}
      {STATUS_LABEL[status]}
    </span>
  );
}

/* ─── خطوات مرقمة 01 02 03 ─── */
export function StepsList({ steps }: { steps: string[] }) {
  if (!steps.length) return null;
  return (
    <ol className="space-y-3">
      {steps.map((step, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="w-6 shrink-0 pt-0.5 text-right text-[13px] font-black tabular-nums text-sky-400">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="text-sm font-semibold leading-relaxed text-slate-600">
            {step}
          </span>
        </li>
      ))}
    </ol>
  );
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      return true;
    } catch {
      return false;
    }
  }
}

export function CopyButton({
  text,
  label = "نسخ",
  doneLabel = "تم النسخ",
  variant = "outline",
  big = false,
}: {
  text: string;
  label?: string;
  doneLabel?: string;
  variant?: "outline" | "primary";
  big?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const handle = async () => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  return (
    <Button
      onClick={handle}
      size="sm"
      variant={variant === "primary" ? "default" : "outline"}
      className={cn(
        "press gap-1.5",
        big ? "h-11 px-6 text-sm" : "h-9 px-4 text-xs font-extrabold",
        variant === "primary"
          ? copied
            ? "bg-emerald-600 hover:bg-emerald-600 text-white"
            : "bg-sky-500 hover:bg-sky-600 text-white shadow-soft-sm"
          : copied
            ? "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
            : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-sky-700",
      )}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 animate-check-pop" />
          {doneLabel} ✓
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          {label}
        </>
      )}
    </Button>
  );
}

/* ─── حالة فراغ هادئة مع البومة ─── */
export function EmptyState({
  title,
  hint,
  compact = false,
}: {
  title: string;
  hint?: string;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="flex items-center justify-center gap-3 rounded-3xl border border-dashed border-sky-200 bg-gradient-to-l from-sky-50/80 to-white/60 px-5 py-6 text-center">
        <Owl size={54} pose="point" />
        <div className="text-right">
          <p className="font-display text-sm font-extrabold text-sky-950">{title}</p>
          {hint && <p className="mt-0.5 text-xs font-medium text-slate-400">{hint}</p>}
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/50 px-6 py-12 text-center">
      <Owl size={72} className="opacity-90" />
      <p className="mt-3 text-sm font-extrabold text-slate-600">{title}</p>
      {hint && (
        <p className="mt-1 max-w-xs text-xs font-medium text-slate-400">
          {hint}
        </p>
      )}
    </div>
  );
}

export function LoadingRows({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-14 animate-pulse rounded-xl border border-slate-100 bg-white"
        />
      ))}
    </div>
  );
}

/* ─── تبويبات Minimal بأسلوب SaaS ─── */
export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: Dispatch<SetStateAction<T>>;
  options: { value: T; label: string; badge?: number }[];
}) {
  return (
    <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-xl border border-slate-200/80 bg-white p-1 shadow-soft">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-extrabold transition-all",
              active
                ? "bg-sky-500 text-white shadow-sm"
                : "text-slate-400 hover:bg-slate-50 hover:text-slate-600",
            )}
          >
            {opt.label}
            {opt.badge !== undefined && (
              <span
                className={cn(
                  "rounded-md px-1.5 text-[10px] font-black tabular-nums",
                  active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400",
                )}
              >
                {opt.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ─── حاوية قائمة موحدة (Rows لا Cards) ─── */
export function ListContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft",
        className,
      )}
    >
      <div className="divide-y divide-slate-100">{children}</div>
    </div>
  );
}

export function InfoNote({
  children,
  icon: Icon,
}: {
  children: ReactNode;
  icon?: LucideIcon;
}) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-sky-100 bg-sky-50/60 p-3.5 text-[13px] font-semibold leading-relaxed text-slate-600">
      {Icon && <Icon className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />}
      <div>{children}</div>
    </div>
  );
}

