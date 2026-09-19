import { ArrowLeft, LifeBuoy, PhoneCall } from "lucide-react";
import { LoadingCards, PageHeader } from "@/components/shared";
import { useIssues } from "@/lib/hooks";

export default function Help() {
  const { data: issues = [], isLoading } = useIssues();

  return (
    <div className="space-y-5">
      <PageHeader
        icon={LifeBuoy}
        tone="rose"
        title="في حالة وجود مشكلة"
        desc="لا تتخذ قرارات من تلقاء نفسك في الأمور غير الواضحة — اتبع هذه الخطوات."
      />

      {isLoading ? (
        <LoadingCards />
      ) : (
        <div className="space-y-3">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className="rounded-[24px] border border-rose-100 bg-white p-4 shadow-soft sm:p-5"
            >
              <h3 className="flex items-center gap-2 font-display text-base font-extrabold text-sky-950">
                <span className="flex h-9 w-9 -rotate-3 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 text-white shadow-soft-sm">
                  <LifeBuoy className="h-4.5 w-4.5" />
                </span>
                {issue.problem}
              </h3>
              <div className="mt-3.5 flex flex-wrap items-center gap-2">
                {issue.steps.map((step, i) => (
                  <span key={i} className="flex items-center gap-2">
                    <span className="rounded-full bg-gradient-to-l from-sky-500 to-sky-600 px-3.5 py-1.5 font-display text-[13px] font-extrabold text-white shadow-soft-sm">
                      {step}
                    </span>
                    {i < issue.steps.length - 1 && (
                      <ArrowLeft className="h-4 w-4 shrink-0 text-sky-300" />
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-[24px] border border-amber-200 bg-gradient-to-bl from-amber-50 to-white p-5 text-center shadow-soft">
        <PhoneCall className="mx-auto h-6 w-6 text-amber-500" />
        <p className="mt-2 font-display text-sm font-extrabold text-amber-800">
          القاعدة الذهبية: إذا لم تكن متأكدًا — لا تخمّن.
        </p>
        <p className="mt-1 text-xs font-bold text-amber-600/80">
          راجع دليل المهمة، وإذا لم تجد الإجابة تواصل مع المسؤول فورًا.
        </p>
      </div>
    </div>
  );
}
