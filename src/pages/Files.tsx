import {
  ExternalLink,
  FileImage,
  FileSpreadsheet,
  FileText,
  Link2,
  MonitorPlay,
  type LucideIcon,
} from "lucide-react";
import { externalHref } from "@/lib/utils";
import { useState } from "react";
import {
  EmptyState,
  ListContainer,
  LoadingRows,
  PageHeader,
  SegmentedControl,
} from "@/components/shared";
import { useFiles } from "@/lib/hooks";
import { formatArabicDate } from "@/lib/time";
import {
  FILE_CATEGORIES,
  FILE_CATEGORY_LABEL,
  FILE_TYPE_LABEL,
  type FileCategory,
  type FileType,
} from "@/lib/types";

const FILE_ICONS: Record<FileType, LucideIcon> = {
  pdf: FileText,
  doc: FileText,
  sheet: FileSpreadsheet,
  image: FileImage,
  slides: MonitorPlay,
  link: Link2,
};

type Filter = "all" | FileCategory;

export default function Files() {
  const [filter, setFilter] = useState<Filter>("all");
  const { data: files = [], isLoading } = useFiles();

  const counts = (f: Filter) =>
    f === "all" ? files.length : files.filter((x) => x.category === f).length;

  const list =
    filter === "all" ? files : files.filter((x) => x.category === filter);

  return (
    <div className="space-y-5">
      <PageHeader
        title="الملفات"
        desc="أين أجد الملفات؟ مكتبة منظمة لكل ملفات العمل — محدثة دائمًا."
      />

      <SegmentedControl
        value={filter}
        onChange={setFilter}
        options={[
          { value: "all", label: "الكل", badge: counts("all") },
          ...FILE_CATEGORIES.map((c) => ({
            value: c,
            label: FILE_CATEGORY_LABEL[c],
            badge: counts(c),
          })),
        ]}
      />

      {isLoading ? (
        <LoadingRows />
      ) : list.length === 0 ? (
        <EmptyState
          title="لا توجد ملفات في هذا التصنيف"
          hint="أضف ملفات من صفحة إدارة المحتوى"
        />
      ) : (
        <ListContainer>
          {list.map((file) => {
            const Icon = FILE_ICONS[file.file_type] ?? Link2;
            return (
              <a
                key={file.id}
                href={externalHref(file.url)}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-4 px-5 py-4 transition hover:bg-sky-50/40"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400 ring-1 ring-slate-100 transition group-hover:bg-sky-50 group-hover:text-sky-600">
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-extrabold text-slate-800">
                    {file.name}
                  </span>
                  <span className="block text-xs font-semibold text-slate-400">
                    {FILE_TYPE_LABEL[file.file_type]} · آخر تحديث{" "}
                    {file.updated_at
                      ? formatArabicDate(file.updated_at.slice(0, 10))
                      : "—"}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-1 text-xs font-extrabold text-slate-300 transition group-hover:text-sky-600">
                  فتح
                  <ExternalLink className="h-3.5 w-3.5" />
                </span>
              </a>
            );
          })}
        </ListContainer>
      )}
    </div>
  );
}
