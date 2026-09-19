import { ExternalLink } from "lucide-react";
import { EmptyState, LoadingRows, PageHeader } from "@/components/shared";
import { iconByName } from "@/lib/icons";
import { useLinks } from "@/lib/hooks";
import {
  LINK_CATEGORIES,
  LINK_CATEGORY_LABEL,
} from "@/lib/types";

export default function Links() {
  const { data: links = [], isLoading } = useLinks();

  return (
    <div className="space-y-6">
      <PageHeader
        title="الروابط"
        desc="أين أذهب؟ مكتبة الإجراءات السريعة — كل خدمة تستخدمها في مكان واحد."
      />

      {isLoading ? (
<<<<<<< HEAD
        <LoadingRows />
      ) : links.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/50 px-6 py-14 text-center">
          <EmptyState
            title="لم تتم إضافة أي روابط بعد."
            hint="روابط الجلسات تُضاف داخل كل جلسة من إدارة المحتوى ← الجلسات، وهنا تُضاف الأدوات العامة (WhatsApp، Drive...)"
          />
=======
        <LoadingCards count={4} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => {
            const Icon = iconByName(link.icon);
            return (
              <div
                key={link.id}
                className="group flex flex-col rounded-[24px] border border-sky-100 bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 -rotate-3 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 text-white shadow-soft-sm transition group-hover:rotate-3">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate font-display text-base font-extrabold text-sky-950">
                      {link.title}
                    </h3>
                    {link.description && (
                      <p className="truncate text-xs font-bold text-slate-400">
                        {link.description}
                      </p>
                    )}
                  </div>
                </div>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="press mt-4 flex h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-sky-500 to-sky-600 font-display text-sm font-extrabold text-white shadow-soft-sm transition hover:from-sky-600 hover:to-sky-700"
                >
                  فتح الرابط
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            );
          })}
>>>>>>> c683bf5f3d8ed3a7fc6b1bf2ec146ec0c53ce734
        </div>
      ) : (
        LINK_CATEGORIES.map((cat) => {
          const group = links.filter((l) => l.category === cat);
          if (!group.length) return null;
          return (
            <section key={cat}>
              <h2 className="mb-2.5 px-1 text-xs font-black tracking-wide text-slate-400">
                {LINK_CATEGORY_LABEL[cat]}
              </h2>
              <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft">
                <div className="divide-y divide-slate-100">
                  {group.map((link) => {
                    const Icon = iconByName(link.icon);
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center gap-4 px-5 py-4 transition hover:bg-sky-50/40"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-sky-600 ring-1 ring-slate-100 transition group-hover:bg-sky-50">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-extrabold text-slate-800">
                            {link.title}
                          </span>
                          {link.description && (
                            <span className="block truncate text-xs font-semibold text-slate-400">
                              {link.description}
                            </span>
                          )}
                        </span>
                        <span className="flex shrink-0 items-center gap-1 text-xs font-extrabold text-slate-300 transition group-hover:text-sky-600">
                          فتح
                          <ExternalLink className="h-3.5 w-3.5" />
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
