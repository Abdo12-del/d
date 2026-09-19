import { useState } from "react";
import { Archive, ChevronDown, Star } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import TaskDrawer, { type DrawerTask } from "@/components/TaskDrawer";
import SpecialMission from "@/components/SpecialMission";
import { Button } from "@/components/ui/button";
import { EmptyState, PageHeader } from "@/components/shared";
import { useSetSpecialStatus, useSpecialTasks } from "@/lib/hooks";
import { dayRelativeLabel, timeMinutes } from "@/lib/time";
import type { SpecialTask } from "@/lib/types";
import { cn } from "@/lib/utils";

function sortSpecials(a: SpecialTask, b: SpecialTask) {
  if (a.due_date && b.due_date) {
    return (
      a.due_date.localeCompare(b.due_date) ||
      timeMinutes(a.due_time) - timeMinutes(b.due_time)
    );
  }
  if (a.due_date) return -1;
  if (b.due_date) return 1;
  return a.sort_order - b.sort_order;
}

export default function Special() {
  const { data: tasks = [] } = useSpecialTasks();
  const setStatus = useSetSpecialStatus();
  const [archivedOpen, setArchivedOpen] = useState(false);

  const [drawerTask, setDrawerTask] = useState<DrawerTask | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const active = tasks.filter((t) => t.status === "active").sort(sortSpecials);
  const done = tasks.filter((t) => t.status === "done").sort(sortSpecials);
  const archived = tasks.filter((t) => t.status === "archived");

  const openTask = (task: SpecialTask) => {
    setDrawerTask({
      kind: "special",
      id: task.id,
      title: task.title,
      time: task.due_time,
      date: task.due_date,
      steps: task.steps,
      notes: task.notes,
      done: task.status === "done",
    });
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-6">

      <PageHeader
        icon={Star}
        tone="violet"
        title="المهام الخاصة ⭐"
        desc="أشياء استثنائية لا تتكرر — تنفّذها ثم تؤرشفها لتبقى لوحتك نظيفة."
      />

      <SpecialMission specials={tasks} onOpen={openTask} />

      {/* المنجزة — بانتظار الأرشفة */}
      {done.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-lg font-extrabold text-sky-950">
            ✅ أنجزتها — جاهزة للأرشفة
          </h2>
          <div className="space-y-2.5">
            {done.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-3.5"
              >
                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-extrabold text-emerald-800">
                    {task.title}
                  </p>
                  {task.due_date && (
                    <p className="text-[11px] font-bold text-slate-400">
                      {dayRelativeLabel(task.due_date)}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    className="press h-8 rounded-full border-sky-200 px-3 font-display text-xs font-extrabold text-sky-600"
                    onClick={() => setStatus.mutate({ id: task.id, status: "active" })}
                  >
                    إرجاع
                  </Button>
                  <Button
                    size="sm"
                    className="press h-8 rounded-full bg-emerald-500 px-3 font-display text-xs font-extrabold text-white hover:bg-emerald-600"
                    onClick={() => setStatus.mutate({ id: task.id, status: "archived" })}
                  >
                    <Archive className="h-3.5 w-3.5" />
                    أرشفة
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* الأرشيف */}
      {archived.length > 0 && (
        <Collapsible open={archivedOpen} onOpenChange={setArchivedOpen}>
          <CollapsibleTrigger asChild>
            <button className="press flex w-full items-center justify-between rounded-2xl border border-dashed border-slate-200 bg-white/70 px-4 py-3 transition hover:bg-slate-50">
              <span className="flex items-center gap-2 font-display text-sm font-extrabold text-slate-500">
                <Archive className="h-4 w-4" />
                الأرشيف ({archived.length})
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-slate-400 transition-transform",
                  archivedOpen && "rotate-180",
                )}
              />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pt-2">
            {archived.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white/70 px-4 py-3"
              >
                <span className="min-w-0 truncate text-sm font-bold text-slate-400">
                  {task.title}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="press h-8 shrink-0 rounded-full px-3 font-display text-xs font-extrabold text-sky-600"
                  onClick={() => setStatus.mutate({ id: task.id, status: "active" })}
                >
                  استعادة
                </Button>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}

      {tasks.length === 0 && (
        <EmptyState
          title="لوحتك نظيفة تمامًا"
          hint="عندما تظهر مهمة استثنائية ستجدها أولًا هنا"
        />
      )}

      <TaskDrawer
        task={drawerTask}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onComplete={(task) => {
          setStatus.mutate({ id: task.id, status: "done" });
          setDrawerOpen(false);
        }}
        completing={setStatus.isPending}
      />
    </div>
  );
}
