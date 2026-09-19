import { AlertTriangle, LifeBuoy, Pin } from "lucide-react";
import { Link } from "react-router-dom";
import { LoadingCards, PageHeader } from "@/components/shared";
import { cn } from "@/lib/utils";
import { useInstructions } from "@/lib/hooks";

export default function Rules() {
  const { data: instructions = [], isLoading } = useInstructions();

  const sorted = [...instructions].sort(
    (a, b) => Number(b.important) - Number(a.important) || a.sort_order - b.sort_order,
  );

  return (
    <div className="space-y-5">
      <PageHeader
        icon={Pin}
        tone="amber"
        title="التعليمات الدائمة"
        desc="معلومات يجب ألا تنساها أبدًا أثناء العمل."
      />

      {isLoading ? (
        <LoadingCards />
      ) : (
        <div className="space-y-3">
          {sorted.map((rule) => (
            <div
              key={rule.id}
              className={cn(
                "flex items-start gap-3 rounded-[24px] border p-4 sm:p-5",
                rule.important
                  ? "border-amber-200 bg-gradient-to-l from-amber-50 to-white shadow-soft"
                  : "border-sky-100 bg-white shadow-soft-sm",
              )}
            >
              <span
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
                  rule.important
                    ? "-rotate-3 bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-soft-sm"
                    : "bg-sky-50 text-sky-500",
                )}
              >
                {rule.important ? (
                  <AlertTriangle className="h-5 w-5" />
                ) : (
                  <Pin className="h-5 w-5" />
                )}
              </span>
              <div className="min-w-0">
                {rule.important && (
                  <span className="mb-1 inline-block rounded-full bg-amber-100 px-2 py-0.5 font-display text-[10px] font-extrabold text-amber-700">
                    مهم جدًا
                  </span>
                )}
                <p className="font-display text-sm font-extrabold leading-relaxed text-sky-950 sm:text-[15px]">
                  {rule.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          to="/guide"
          className="press rounded-[24px] border border-violet-100 bg-gradient-to-bl from-violet-50 to-white p-4 text-center font-display text-sm font-extrabold text-violet-700 shadow-soft-sm transition hover:-translate-y-0.5 hover:shadow-soft"
        >
          📖 راجع دليل تنفيذ المهام
        </Link>
        <Link
          to="/help"
          className="press rounded-[24px] border border-rose-100 bg-gradient-to-bl from-rose-50 to-white p-4 text-center font-display text-sm font-extrabold text-rose-500 shadow-soft-sm transition hover:-translate-y-0.5 hover:shadow-soft"
        >
          <LifeBuoy className="ml-1 inline h-4 w-4" />
          في حالة وجود مشكلة
        </Link>
      </div>
    </div>
  );
}
