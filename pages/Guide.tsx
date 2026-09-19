import { AlertTriangle, ArrowLeft, LifeBuoy, Pin, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState, LoadingRows, PageHeader, StepsList } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { iconByName } from "@/lib/icons";
import { useGuides, useInstructions, useIssues } from "@/lib/hooks";
import { cn } from "@/lib/utils";

type ChapterId = "all" | "instructions" | "issues" | `guide-${string}`;

export default function Guide() {
  const { data: guides = [], isLoading } = useGuides();
  const { data: instructions = [] } = useInstructions();
  const { data: issues = [] } = useIssues();

  const [chapter, setChapter] = useState<ChapterId>("all");
  const [query, setQuery] = useState("");
  const q = query.trim();

  const chapters: { id: ChapterId; label: string }[] = [
    { id: "all", label: "الكل" },
    { id: "instructions", label: "التعليمات الدائمة" },
    ...guides.map((g) => ({ id: `guide-${g.id}` as ChapterId, label: g.title })),
    { id: "issues", label: "المشكلات الشائعة" },
  ];

  const showInstructions =
    (chapter === "all" || chapter === "instructions") &&
    instructions.some((r) => !q || r.content.includes(q));

  const visibleGuides = guides.filter((g) => {
    if (chapter !== "all" && chapter !== `guide-${g.id}`) return false;
    if (!q) return true;
    return (
      g.title.includes(q) ||
      g.sections.some(
        (s) => s.heading.includes(q) || s.steps.some((x) => x.includes(q)),
      )
    );
  });

  const visibleIssues = issues.filter((i) => {
    if (chapter !== "all" && chapter !== "issues") return false;
    if (!q) return true;
    return i.problem.includes(q) || i.steps.some((x) => x.includes(q));
  });

  const hasContent =
    showInstructions || visibleGuides.length > 0 || visibleIssues.length > 0;

  const visibleInstructions = useMemo(
    () =>
      instructions
        .filter((r) => !q || r.content.includes(q))
        .sort(
          (a, b) =>
            Number(b.important) - Number(a.important) || a.sort_order - b.sort_order,
        ),
    [instructions, q],
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="دليل العمل"
        desc="كيف أنفذ العمل؟ مرجعك الدائم — إجراءات، مبادئ، وحلول المشكلات."
      />

      {/* بحث سريع */}
      <div className="relative">
        <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث في الدليل… (مثال: الرابط، الحضور، رسالة)"
          className="h-12 rounded-2xl border-slate-200/80 bg-white pr-11 text-sm font-bold shadow-soft placeholder:text-slate-300"
        />
      </div>

      {/* تنقل الفصول */}
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {chapters.map((c) => {
          const active = c.id === chapter;
          return (
            <button
              key={c.id}
              onClick={() => setChapter(c.id)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-xs font-extrabold transition",
                active
                  ? "border-sky-500 bg-sky-500 text-white"
                  : "border-slate-200 bg-white text-slate-400 hover:border-sky-200 hover:text-slate-600",
              )}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <LoadingRows />
      ) : !hasContent ? (
        <EmptyState
          title={`لا نتائج للبحث: "${q}"`}
          hint="جرّب كلمة أخرى أو راجع كل الفصول"
        />
      ) : (
        <div className="space-y-8">
          {/* التعليمات الدائمة */}
          {showInstructions && visibleInstructions.length > 0 && (
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-base font-black text-slate-700">
                <Pin className="h-4 w-4 text-amber-500" />
                التعليمات الدائمة
              </h2>
              <div className="space-y-2">
                {visibleInstructions.map((rule) => (
                  <div
                    key={rule.id}
                    className={cn(
                      "flex items-start gap-3 rounded-2xl border px-4 py-3.5",
                      rule.important
                        ? "border-amber-200/70 bg-amber-50/50"
                        : "border-slate-200/80 bg-white",
                    )}
                  >
                    {rule.important ? (
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    ) : (
                      <Pin className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />
                    )}
                    <p className="text-sm font-bold leading-relaxed text-slate-700">
                      {rule.content}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* فصول الدليل */}
          {visibleGuides.map((guide) => {
            const Icon = iconByName(guide.icon);
            return (
              <section
                key={guide.id}
<<<<<<< HEAD
                className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft sm:p-6"
              >
                <h2 className="flex items-center gap-2.5 text-base font-black text-slate-700">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  {guide.title}
                </h2>
                <div className="mt-5 space-y-6">
                  {guide.sections
                    .filter(
                      (s) =>
                        !q ||
                        s.heading.includes(q) ||
                        s.steps.some((x) => x.includes(q)),
                    )
                    .map((section, i) => (
                      <div key={i}>
                        <h3 className="mb-3 text-sm font-black text-slate-500">
                          {section.heading}
                        </h3>
                        <StepsList steps={section.steps} />
                      </div>
                    ))}
=======
                className="overflow-hidden rounded-[26px] border border-violet-100 bg-white shadow-soft"
              >
                <div className="flex items-center gap-3 border-b border-violet-100 bg-gradient-to-l from-violet-50 to-white px-4 py-4 sm:px-5">
                  <span className="flex h-11 w-11 shrink-0 -rotate-3 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-soft-sm">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h2 className="font-display text-base font-extrabold text-violet-950 sm:text-lg">
                    {guide.title}
                  </h2>
                </div>
                <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3 sm:p-5">
                  {guide.sections.map((section, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-sky-100 bg-sky-50/40 p-4"
                    >
                      <h3 className="mb-3 flex items-center gap-2 font-display text-sm font-extrabold text-violet-700">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 font-display text-[11px] font-extrabold text-white shadow-soft-sm">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {section.heading}
                      </h3>
                      <StepsList steps={section.steps} small />
                    </div>
                  ))}
>>>>>>> c683bf5f3d8ed3a7fc6b1bf2ec146ec0c53ce734
                </div>
              </section>
            );
          })}

          {/* المشكلات الشائعة */}
          {visibleIssues.length > 0 && (
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-base font-black text-slate-700">
                <LifeBuoy className="h-4 w-4 text-rose-400" />
                المشكلات الشائعة
              </h2>
              <div className="space-y-2.5">
                {visibleIssues.map((issue) => (
                  <div
                    key={issue.id}
                    className="rounded-2xl border border-slate-200/80 bg-white px-4 py-4"
                  >
                    <p className="text-sm font-extrabold text-slate-700">
                      {issue.problem}
                    </p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                      {issue.steps.map((step, i) => (
                        <span key={i} className="flex items-center gap-1.5">
                          <span className="rounded-full bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600">
                            {step}
                          </span>
                          {i < issue.steps.length - 1 && (
                            <ArrowLeft className="h-3.5 w-3.5 text-slate-300" />
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
