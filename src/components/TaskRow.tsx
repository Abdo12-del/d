import { CheckCircle2, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusChip, TypeChip } from "./shared";
import type { StatusType, TaskType } from "@/lib/types";

export interface TaskRowData {
  key: string;
  time?: string;
  title: string;
  desc?: string;
  type: TaskType;
  status: StatusType;
  onClick?: () => void;
}

export default function TaskRow({
  time,
  title,
  desc,
  type,
  status,
  onClick,
}: TaskRowData) {
  const done = status === "done";
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 px-4 py-3.5 text-right transition sm:gap-4 sm:px-5",
        onClick && "hover:bg-sky-50/40",
        done && "opacity-80",
      )}
    >
      {/* الوقت أو علامة الإنجاز */}
      <div className="flex w-12 shrink-0 justify-center">
        {done ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        ) : (
          <span className="text-[13px] font-black tabular-nums text-slate-500">
            {time ?? "—"}
          </span>
        )}
      </div>

      {/* العنوان والوصف */}
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-sm font-extrabold sm:text-[15px]",
            done ? "text-slate-400 line-through decoration-slate-300" : "text-slate-800",
          )}
        >
          {title}
        </p>
        {desc && (
          <p className="mt-0.5 truncate text-xs font-semibold text-slate-400">
            {desc}
          </p>
        )}
      </div>

      {/* النوع والحالة */}
      <div className="hidden shrink-0 items-center gap-3 sm:flex">
        <TypeChip type={type} />
        <StatusChip status={status} />
      </div>
      <div className="flex shrink-0 sm:hidden">
        <TypeChip type={type} />
      </div>

      <ChevronLeft className="h-4 w-4 shrink-0 text-slate-300" />
    </button>
  );
}
