import {
  CalendarClock,
  Check,
  ListChecks,
  MoreVertical,
  Pause,
  Pencil,
  Play,
  Plus,
  Repeat,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import RoutineForm from "@/components/RoutineForm";
import TaskDrawer, { type DrawerTask } from "@/components/TaskDrawer";
import { Owl } from "@/components/Owl";
import {
  PageHeader,
  StatusChip,
  StepsList,
  copyToClipboard,
} from "@/components/shared";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { QUERY_KEYS, removeRow, saveRow, TABLES } from "@/lib/data";
import {
  isRoutineDoneOn,
  lastRoutineDone,
  useCompletions,
  useLinks,
  useMessages,
  useRoutineTasks,
  useToggleRoutineDone,
} from "@/lib/hooks";
import { lastDoneLabel } from "@/lib/commands";
import {
  nextRoutineDates,
  routineOccurrenceDrawer,
  routineRecurrenceText,
} from "@/lib/routineUtils";
import { dayRelativeLabel } from "@/lib/time";
import {
  FREQUENCY_LABEL,
  FREQUENCY_ORDER,
  ROUTINE_STATUS_LABEL,
  type Frequency,
  type RoutineTask,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const TRACK_ACCENT: Record<Frequency, string> = {
  daily: "from-sky-500 to-cyan-500",
  weekly: "from-violet-500 to-purple-500",
  monthly: "from-amber-500 to-orange-500",
};

const PERIOD_WORD: Record<Frequency, string> = {
  daily: "اليوم",
  weekly: "هذا الأسبوع",
  monthly: "هذا الشهر",
};

const TRACK_DESC: Record<Frequency, string> = {
  daily: "ما تفعله بشكل متكرر كل يوم",
  weekly: "ما يعود عليك كل أسبوع",
  monthly: "ما يعود كل شهر",
};

export default function Routine() {
  const { data: routines = [], isLoading } = useRoutineTasks();
  const { data: completions = [] } = useCompletions();
  const { data: links = [] } = useLinks();
  const { data: messages = [] } = useMessages();
  const qc = useQueryClient();
  const toggleDone = useToggleRoutineDone();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<RoutineTask | null>(null);
  const [deleting, setDeleting] = useState<RoutineTask | null>(null);
  const [tasksOf, setTasksOf] = useState<RoutineTask | null>(null);
  const [drawerTask, setDrawerTask] = useState<DrawerTask | null>(null);

  const linkById = Object.fromEntries(links.map((l) => [l.id, l]));
  const msgById = Object.fromEntries(messages.map((m) => [m.id, m]));

  const refresh = () => qc.invalidateQueries({ queryKey: QUERY_KEYS.routine });

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (r: RoutineTask) => {
    setEditing(r);
    setFormOpen(true);
  };

  const toggleStatus = async (r: RoutineTask) => {
    const makeActive = r.status !== "active";
    try {
      await saveRow(TABLES.routine, {
        id: r.id,
        status: makeActive ? "active" : "paused",
      });
      await refresh();
      toast.success(makeActive ? "تم استئناف الروتين ✓" : "تم إيقاف الروتين");
    } catch {
      toast.error("تعذّر تنفيذ العملية");
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await removeRow(TABLES.routine, deleting.id);
      await refresh();
      toast.success("تم حذف الروتين");
    } catch {
      toast.error("تعذّر الحذف");
    } finally {
      setDeleting(null);
    }
  };

  const openOccurrence = (r: RoutineTask, iso: string) => {
    const done = isRoutineDoneOn(completions, r.id, iso);
    setTasksOf(null);
    setDrawerTask(
      routineOccurrenceDrawer(r, iso, done, {
        link: r.link_id ? linkById[r.link_id] : null,
        message: r.message_id ? msgById[r.message_id] : null,
        onToggleDone: () => {
          toggleDone.mutate(
            { routineId: r.id, date: iso, makeDone: !done },
            {
              onSuccess: () =>
                toast.success(
                  !done ? "أحسنت! تم إنجاز المهمة" : "تمت الإرجاع للانتظار",
                ),
            },
          );
        },
      }),
    );
  };

  return (
    <div className="space-y-7">

      <PageHeader
        title="روتيني"
        desc="ما الذي يتكرر؟ أنشئ قوالب الروتين بنفسك، وستتولّد مهامها تلقائيًا في مواعيدها."
        action={
          <Button
            onClick={openCreate}
            className="h-10 gap-1.5 rounded-xl bg-sky-500 px-4 text-[13px] font-extrabold text-white hover:bg-sky-600"
          >
            <Plus className="h-4 w-4" strokeWidth={3} />
            إضافة روتين
          </Button>
        }
      />

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-2xl border border-slate-100 bg-white"
            />
          ))}
        </div>
      ) : routines.length === 0 ? (
        /* ─── الحالة الفارغة ─── */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/60 px-6 py-16 text-center">
          <Owl size={76} />
          <p className="mt-4 text-base font-extrabold text-slate-600">
            لا توجد روتينات مضافة حاليًا
          </p>
          <p className="mt-1.5 text-sm font-semibold text-slate-400">
            أضف روتينك الأول لتنظيم المهام المتكررة.
          </p>
          <Button
            onClick={openCreate}
            className="mt-6 h-11 gap-1.5 rounded-xl bg-sky-500 px-6 text-sm font-extrabold text-white hover:bg-sky-600"
          >
            <Plus className="h-4 w-4" strokeWidth={3} />
            إضافة روتين
          </Button>
        </div>
      ) : (
        /* ─── قوائم الروتين حسب التكرار ─── */
        FREQUENCY_ORDER.map((freq) => {
          const list = routines.filter((r) => r.frequency === freq);
          if (!list.length) return null;
          return (
            <section key={freq}>
              <h2 className="mb-2.5 flex items-center gap-2 px-1 text-sm font-black text-slate-600">
                <Repeat className="h-4 w-4 text-sky-500" />
                {FREQUENCY_LABEL[freq]}
                <span className="text-[11px] font-bold text-slate-300">
                  {list.length} روتين
                </span>
              </h2>
              <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft">
                <div className="divide-y divide-slate-100">
                  {list.map((r) => {
                    const paused = r.status !== "active";
                    const lastDone = lastRoutineDone(completions, r.id);
                    return (
                      <div
                        key={r.id}
                        className={cn(
                          "flex items-center gap-3 px-4 py-4 sm:px-5",
                          paused && "opacity-60",
                        )}
                      >
                        <button
                          onClick={() => setTasksOf(r)}
                          className="min-w-0 flex-1 text-right"
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-extrabold text-slate-800 sm:text-[15px]">
                              {r.title}
                            </p>
                            <span
                              className={cn(
                                "rounded-md px-1.5 py-0.5 text-[10px] font-black",
                                paused
                                  ? "bg-slate-100 text-slate-400"
                                  : "bg-emerald-50 text-emerald-600",
                              )}
                            >
                              {ROUTINE_STATUS_LABEL[r.status]}
                            </span>
                          </div>
                          <p className="mt-1 truncate text-xs font-semibold text-slate-400">
                            {routineRecurrenceText(r)}
                            {r.time ? ` · ${r.time}` : ""}
                            {r.owner ? ` · ${r.owner}` : ""}
                          </p>
                          {lastDone && (
                            <p className="mt-0.5 text-[11px] font-bold text-slate-300">
                              آخر تنفيذ: {dayRelativeLabel(lastDone)}
                            </p>
                          )}
                        </button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              aria-label="خيارات الروتين"
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-300 transition hover:bg-slate-50 hover:text-slate-500"
                            >
                              <MoreVertical className="h-4.5 w-4.5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl">
                            <DropdownMenuItem
                              onClick={() => setTasksOf(r)}
                              className="gap-2 text-xs font-extrabold"
                            >
                              <ListChecks className="h-4 w-4 text-sky-500" />
                              عرض المهام الناتجة
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openEdit(r)}
                              className="gap-2 text-xs font-extrabold"
                            >
                              <Pencil className="h-4 w-4 text-sky-500" />
                              تعديل
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => toggleStatus(r)}
                              className="gap-2 text-xs font-extrabold"
                            >
                              {paused ? (
                                <>
                                  <Play className="h-4 w-4 text-emerald-500" />
                                  استئناف
                                </>
                              ) : (
                                <>
                                  <Pause className="h-4 w-4 text-amber-500" />
                                  إيقاف
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleting(r)}
                              className="gap-2 text-xs font-extrabold text-rose-500 focus:text-rose-600"
                            >
                              <Trash2 className="h-4 w-4" />
                              حذف
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })
      )}

      {/* ─── نموذج الإضافة/التعديل ─── */}
      <RoutineForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        initial={editing}
      />

      {/* ─── تأكيد الحذف ─── */}
      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader className="text-right">
            <AlertDialogTitle className="text-right">
              حذف «{deleting?.title}»؟
            </AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              سيُحذف الروتين نهائيًا ولن تتولّد مهامه بعد الآن. لا يمكن التراجع.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-2">
            <AlertDialogAction
              onClick={confirmDelete}
              className="flex-1 rounded-2xl bg-rose-500 font-extrabold hover:bg-rose-600"
            >
              حذف نهائي
            </AlertDialogAction>
            <AlertDialogCancel className="flex-1 rounded-2xl font-extrabold">
              إلغاء
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ─── المهام الناتجة عن الروتين ─── */}
      <Sheet open={!!tasksOf} onOpenChange={(o) => !o && setTasksOf(null)}>
        <SheetContent
          side="left"
          className="flex w-full flex-col gap-0 rounded-r-3xl border-l-0 p-0 sm:max-w-md"
        >
          {tasksOf && (
            <>
              <SheetHeader className="border-b border-slate-100 px-6 pb-4 pt-6 text-right">
                <SheetTitle className="text-right text-lg font-black text-slate-800">
                  {tasksOf.title}
                </SheetTitle>
                <SheetDescription className="flex items-center gap-1.5 text-right text-xs font-extrabold text-slate-400">
                  <CalendarClock className="h-3.5 w-3.5" />
                  {routineRecurrenceText(tasksOf)}
                  {tasksOf.time ? ` · ${tasksOf.time}` : ""}
                </SheetDescription>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto px-6 py-5">
                {tasksOf.description && (
                  <p className="mb-4 text-sm font-semibold leading-relaxed text-slate-500">
                    {tasksOf.description}
                  </p>
                )}
                {tasksOf.steps.length > 0 && (
                  <div className="mb-5">
                    <h4 className="mb-3 text-xs font-black text-slate-400">
                      خطوات التنفيذ
                    </h4>
                    <StepsList steps={tasksOf.steps} />
                  </div>
                )}
                <h4 className="mb-3 text-xs font-black text-slate-400">
                  المواعيد القادمة المتولدة تلقائيًا
                </h4>
                <div className="space-y-2">
                  {nextRoutineDates(tasksOf, 8).map((iso) => {
                    const done = isRoutineDoneOn(completions, tasksOf.id, iso);
                    return (
                      <div
                        key={iso}
                        className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 px-4 py-3"
                      >
                        <button
                          onClick={() => openOccurrence(tasksOf, iso)}
                          className="min-w-0 flex-1 text-right"
                        >
                          <p className="text-[13px] font-extrabold text-slate-700">
                            {dayRelativeLabel(iso)}
                            {tasksOf.time ? ` · ${tasksOf.time}` : ""}
                          </p>
                        </button>
                        <StatusChip status={done ? "done" : "pending"} />
                        <button
                          onClick={() => {
                            toggleDone.mutate(
                              {
                                routineId: tasksOf.id,
                                date: iso,
                                makeDone: !done,
                              },
                              {
                                onSuccess: () =>
                                  toast.success(
                                    !done
                                      ? "أحسنت! تم إنجاز المهمة"
                                      : "تمت الإرجاع للانتظار",
                                  ),
                              },
                            );
                          }}
                          aria-label="تبديل الإنجاز"
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 transition",
                            done
                              ? "border-emerald-500 bg-emerald-500 text-white"
                              : "border-slate-200 text-transparent hover:border-sky-300",
                          )}
                        >
                          <Check className="h-4 w-4" strokeWidth={3} />
                        </button>
                      </div>
                    );
                  })}
                  {tasksOf.status !== "active" && (
                    <p className="rounded-xl border border-dashed border-amber-300 bg-amber-50/60 px-4 py-3 text-xs font-extrabold text-amber-700">
                      هذا الروتين متوقف — لا تتولّد مهام جديدة حتى استئنافه.
                    </p>
                  )}
                </div>

                {tasksOf.message_id && msgById[tasksOf.message_id] && (
                  <div className="mt-5">
                    <h4 className="mb-2 text-xs font-black text-slate-400">
                      الرسالة المرتبطة
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        const ok = await copyToClipboard(
                          msgById[tasksOf.message_id!].body,
                        );
                        if (ok) toast.success("تم نسخ الرسالة ✓");
                      }}
                      className="h-9 rounded-xl text-xs font-extrabold text-slate-600"
                    >
                      نسخ «{msgById[tasksOf.message_id].title}»
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <TaskDrawer
        task={drawerTask}
        onClose={() => setDrawerTask(null)}
      />
    </div>
  );
}
