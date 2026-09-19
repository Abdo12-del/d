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
        <LoadingRows />
      ) : links.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/50 px-6 py-14 text-center">
          <EmptyState
            title="لم تتم إضافة أي روابط بعد."
            hint="روابط الجلسات تُضاف داخل كل جلسة من إدارة المحتوى ← الجلسات، وهنا تُضاف الأدوات العامة (WhatsApp، Drive...)"
          />
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
