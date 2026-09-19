import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addCompletion,
  getCompletions,
  getFiles,
  getGuides,
  getInstructions,
  getIssues,
  getLinks,
  getMessages,
  getRoutineTasks,
  getSessions,
  getSpecialTasks,
  QUERY_KEYS,
  removeCompletions,
  setSpecialStatus,
} from "./data";
import type { Completion, SpecialStatus } from "./types";

export const useRoutineTasks = () =>
  useQuery({ queryKey: QUERY_KEYS.routine, queryFn: getRoutineTasks });

export const useSpecialTasks = () =>
  useQuery({ queryKey: QUERY_KEYS.special, queryFn: getSpecialTasks });

export const useSessions = () =>
  useQuery({ queryKey: QUERY_KEYS.sessions, queryFn: getSessions });

export const useLinks = () =>
  useQuery({ queryKey: QUERY_KEYS.links, queryFn: getLinks });

export const useMessages = () =>
  useQuery({ queryKey: QUERY_KEYS.messages, queryFn: getMessages });

export const useInstructions = () =>
  useQuery({ queryKey: QUERY_KEYS.instructions, queryFn: getInstructions });

export const useGuides = () =>
  useQuery({ queryKey: QUERY_KEYS.guides, queryFn: getGuides });

export const useIssues = () =>
  useQuery({ queryKey: QUERY_KEYS.issues, queryFn: getIssues });

export const useFiles = () =>
  useQuery({ queryKey: QUERY_KEYS.files, queryFn: getFiles });

export const useCompletions = () =>
  useQuery({ queryKey: QUERY_KEYS.completions, queryFn: getCompletions });

/** هل أُنجز الروتين في تاريخ محدد؟ (الإنجاز لكل موعد على حدة) */
export function isRoutineDoneOn(
  completions: Completion[],
  routineId: string,
  date: string,
): boolean {
  const key = `routine:${routineId}`;
  return completions.some(
    (c) => c.task_key === key && c.completed_date === date,
  );
}

/** آخر تاريخ إنجاز فعلي للروتين */
export function lastRoutineDone(
  completions: Completion[],
  routineId: string,
): string | null {
  const dates = completions
    .filter((c) => c.task_key === `routine:${routineId}`)
    .map((c) => c.completed_date)
    .sort();
  return dates.length ? dates[dates.length - 1] : null;
}

/** تبديل إنجاز موعد روتين في تاريخ محدد */
export function useToggleRoutineDone() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      routineId,
      date,
      makeDone,
    }: {
      routineId: string;
      date: string;
      makeDone: boolean;
    }) => {
      const key = `routine:${routineId}`;
      if (makeDone) {
        await addCompletion(key, date);
      } else {
        const current =
          (qc.getQueryData<Completion[]>(QUERY_KEYS.completions) ??
            (await getCompletions())) || [];
        const ids = current
          .filter((c) => c.task_key === key && c.completed_date === date)
          .map((c) => c.id);
        await removeCompletions(ids);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.completions });
    },
    onError: () => {
      toast.error("تعذّر حفظ الإنجاز — تحقق من الاتصال بقاعدة البيانات");
    },
  });
}

export function useSetSpecialStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: SpecialStatus }) =>
      setSpecialStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.special });
    },
    onError: () => {
      toast.error("تعذّر تحديث حالة المهمة — تحقق من الاتصال بقاعدة البيانات");
    },
  });
}
