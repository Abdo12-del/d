import { ArrowLeft, Check, ExternalLink, Pin } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { CopyButton, EmptyState } from "@/components/shared";
import { iconByName } from "@/lib/icons";
import {
  CATEGORY_LABEL,
  MESSAGE_CATEGORIES,
  type Instruction,
  type LinkItem,
  type MessageTemplate,
} from "@/lib/types";
import { cn } from "@/lib/utils";

/* ================= روابطك — Quick Actions ================= */

const CHIP_COLORS = [
  "from-sky-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-violet-500 to-purple-500",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-pink-500",
  "from-indigo-500 to-blue-500",
];

export function QuickLinks({ links }: { links: LinkItem[] }) {
  if (!links.length) {
    return <EmptyState compact title="لا روابط محفوظة بعد" hint="أضفها من صفحة الروابط" />;
  }
  return (
    <div className="space-y-2">
      {links.slice(0, 5).map((link, i) => {
        const Icon = iconByName(link.icon);
        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="press group flex items-center gap-3 rounded-2xl border border-sky-100 bg-white p-2.5 shadow-soft-sm transition hover:border-sky-200 hover:bg-sky-50/50"
          >
            <span
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-soft-sm transition-transform group-hover:rotate-3",
                CHIP_COLORS[i % CHIP_COLORS.length],
              )}
            >
              <Icon className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-display text-[13.5px] font-extrabold text-sky-950">
                {link.title}
              </span>
              <span className="block truncate text-[11px] font-bold text-slate-400">
                {link.description ?? "فتح سريع"}
              </span>
            </span>
            <span className="flex shrink-0 items-center gap-1 text-[11px] font-extrabold text-sky-500">
              فتح
              <ExternalLink className="h-3 w-3 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </a>
        );
      })}
    </div>
  );
}

/* ================= Message Vault — خزنة الرسائل ================= */

export function MessageVaultCard({ messages }: { messages: MessageTemplate[] }) {
  const [filter, setFilter] = useState<"all" | (typeof MESSAGE_CATEGORIES)[number]>("all");

  const list =
    filter === "all" ? messages : messages.filter((m) => m.category === filter);
  const current = list[0];

  return (
    <div className="space-y-3">
      {/* التبويبات */}
      <div className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1 pb-0.5">
        {(["all", ...MESSAGE_CATEGORIES] as const).map((c) => {
          const active = c === filter;
          const label = c === "all" ? "الكل" : CATEGORY_LABEL[c];
          const count =
            c === "all"
              ? messages.length
              : messages.filter((m) => m.category === c).length;
          if (c !== "all" && count === 0) return null;
          return (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={cn(
                "press shrink-0 rounded-full px-3 py-1 text-[11px] font-extrabold transition",
                active
                  ? "bg-gradient-to-l from-sky-500 to-sky-600 text-white shadow-soft-sm"
                  : "bg-sky-50 text-sky-600 hover:bg-sky-100",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      {!current ? (
        <EmptyState
          compact
          title="لا رسائل في هذا التصنيف"
          hint="أضف رسائل من صفحة الرسائل"
        />
      ) : (
        <div>
          {/* فقاعة محادثة */}
          <div className="relative rounded-2xl rounded-tr-md border border-sky-100 bg-gradient-to-b from-sky-50/80 to-white p-3.5">
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <span className="rounded-full bg-white px-2 py-0.5 text-[10.5px] font-extrabold text-sky-600 ring-1 ring-sky-100">
                {CATEGORY_LABEL[current.category]}
              </span>
              <span className="truncate font-display text-[12.5px] font-extrabold text-sky-950">
                {current.title}
              </span>
            </div>
            <p className="whitespace-pre-line text-[13px] font-semibold leading-loose text-slate-600">
              {current.body}
            </p>
          </div>
          <div className="mt-2.5 flex justify-end">
            <CopyButton text={current.body} big />
          </div>
          {list.length > 1 && (
            <Link
              to="/messages"
              className="press mt-1 flex items-center justify-center gap-1 text-[11.5px] font-extrabold text-sky-600 transition hover:text-sky-700"
            >
              +{list.length - 1} رسائل أخرى في الخزنة
              <ArrowLeft className="h-3 w-3" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

/* ================= تعليمات مهمة ================= */

export function InstructionsCard({ instructions }: { instructions: Instruction[] }) {
  const sorted = [...instructions].sort(
    (a, b) => Number(b.important) - Number(a.important) || a.sort_order - b.sort_order,
  );

  if (!sorted.length) {
    return <EmptyState compact title="لا تعليمات بعد" hint="أضفها من صفحة الإدارة" />;
  }

  return (
    <div className="space-y-2">
      {sorted.slice(0, 4).map((rule) => (
        <div
          key={rule.id}
          className={cn(
            "flex items-start gap-2.5 rounded-2xl border p-3 text-[12.5px] font-bold leading-relaxed",
            rule.important
              ? "border-amber-200 bg-gradient-to-l from-amber-50 to-white text-amber-900"
              : "border-sky-100 bg-white text-slate-600",
          )}
        >
          {rule.important ? (
            <Pin className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          ) : (
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100">
              <Check className="h-2.5 w-2.5 text-emerald-600" strokeWidth={4} />
            </span>
          )}
          {rule.content}
        </div>
      ))}
      <Link
        to="/rules"
        className="press flex items-center justify-center gap-1 text-[11.5px] font-extrabold text-sky-600 transition hover:text-sky-700"
      >
        كل التعليمات الدائمة
        <ArrowLeft className="h-3 w-3" />
      </Link>
    </div>
  );
}

/** بطاقة الهامش السفلية للـ Rail */
export function RailFooterCard() {
  return (
    <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-bl from-sky-500 to-cyan-600 p-4 text-center text-white shadow-soft">
      <div aria-hidden className="blob absolute -left-8 -top-10 h-24 w-24 bg-white/15 blur-lg" />
      <p className="relative font-display text-sm font-extrabold leading-relaxed">
        بالتنظيم والالتزام
        <br />
        نحقق النجاح دائمًا 💙
      </p>
    </div>
  );
}

/** بطاقة Rail عامة بعنوان */
export function RailCard({
  emoji,
  title,
  children,
  actionTo,
  actionLabel,
}: {
  emoji: string;
  title: string;
  children: React.ReactNode;
  actionTo?: string;
  actionLabel?: string;
}) {
  return (
    <section className="card-soft p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 font-display text-[15px] font-extrabold text-sky-950">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-sky-100 to-sky-50 text-base ring-1 ring-sky-100">
            {emoji}
          </span>
          {title}
        </h3>
        {actionTo && (
          <Link
            to={actionTo}
            className="press flex items-center gap-1 text-[11px] font-extrabold text-sky-600 transition hover:text-sky-700"
          >
            {actionLabel ?? "عرض الكل"}
            <ArrowLeft className="h-3 w-3" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
