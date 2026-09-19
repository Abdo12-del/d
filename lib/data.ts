import { supabase } from "@/integrations/supabase/client";
import type {
  Completion,
  FileItem,
  Guide,
  Instruction,
  Issue,
  LinkItem,
  MessageTemplate,
  RoutineTask,
  Session,
  SpecialStatus,
  SpecialTask,
} from "./types";
/** يرمي خطأ إذا تعذّر إكمال الاستعلام خلال المهلة (فشل سريع وصادق) */
function withTimeout<T>(p: Promise<T>, ms = 6000): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), ms),
    ),
  ]);
}

export const TABLES = {
  routine: "ng_routine_tasks",
  special: "ng_special_tasks",
  sessions: "ng_sessions",
  links: "ng_links",
  messages: "ng_messages",
  instructions: "ng_instructions",
  guides: "ng_guides",
  issues: "ng_issues",
  files: "ng_files",
  completions: "ng_completions",
} as const;

export const QUERY_KEYS = {
  routine: ["ng", "routine"],
  special: ["ng", "special"],
  sessions: ["ng", "sessions"],
  links: ["ng", "links"],
  messages: ["ng", "messages"],
  instructions: ["ng", "instructions"],
  guides: ["ng", "guides"],
  issues: ["ng", "issues"],
  files: ["ng", "files"],
  completions: ["ng", "completions"],
};

/* eslint-disable @typescript-eslint/no-explicit-any */
const toSteps = (v: unknown): string[] =>
  Array.isArray(v) ? v.map((s) => String(s)).filter(Boolean) : [];

export async function selectAll(table: string): Promise<any[]> {
  const { data, error } = await withTimeout(
    supabase
      .from(table)
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
  );
  if (error) throw error;
  return data ?? [];
}

export async function getRoutineTasks(): Promise<RoutineTask[]> {
<<<<<<< HEAD
  return (await selectAll(TABLES.routine)).map((r) => ({
    ...r,
    steps: toSteps(r.steps),
    weekdays: Array.isArray(r.weekdays) ? r.weekdays.map(Number) : [],
  }));
=======
    return (await selectAll(TABLES.routine)).map((r) => ({
      ...r,
      steps: toSteps(r.steps),
    }));
>>>>>>> c683bf5f3d8ed3a7fc6b1bf2ec146ec0c53ce734
}

export async function getSpecialTasks(): Promise<SpecialTask[]> {
    return (await selectAll(TABLES.special)).map((r) => ({
      ...r,
      steps: toSteps(r.steps),
    }));
}

<<<<<<< HEAD
export async function getSessions(): Promise<Session[]> {
  return (await selectAll(TABLES.sessions)).map((r) => ({
    ...r,
    weekday: r.weekday == null ? null : Number(r.weekday),
    active: r.active !== false,
  }));
=======
export async function getScheduleItems(): Promise<ScheduleItem[]> {
    return (await selectAll(TABLES.schedule)).map((r) => ({
      ...r,
      weekdays: Array.isArray(r.weekdays) ? r.weekdays.map(Number) : [],
    }));
>>>>>>> c683bf5f3d8ed3a7fc6b1bf2ec146ec0c53ce734
}

export async function getLinks(): Promise<LinkItem[]> {
    return await selectAll(TABLES.links);
}

export async function getMessages(): Promise<MessageTemplate[]> {
    return await selectAll(TABLES.messages);
}

export async function getInstructions(): Promise<Instruction[]> {
    return await selectAll(TABLES.instructions);
}

export async function getGuides(): Promise<Guide[]> {
    return (await selectAll(TABLES.guides)).map((r) => ({
      ...r,
      sections: Array.isArray(r.sections) ? r.sections : [],
    }));
}

export async function getIssues(): Promise<Issue[]> {
    return (await selectAll(TABLES.issues)).map((r) => ({
      ...r,
      steps: toSteps(r.steps),
    }));
}

export async function getFiles(): Promise<FileItem[]> {
  return selectAll(TABLES.files);
}

export async function getCompletions(): Promise<Completion[]> {
    return await selectAll(TABLES.completions);
}

export async function saveRow(
  table: string,
  row: Record<string, unknown>,
): Promise<void> {
  const payload = { ...row };
  delete payload.created_at;
  delete payload.updated_at;
  const { error } = await supabase.from(table).upsert(payload);
  if (error) throw error;
}

export async function removeRow(table: string, id: string): Promise<void> {
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw error;
}

export async function setSpecialStatus(
  id: string,
  status: SpecialStatus,
): Promise<void> {
  const { error } = await supabase
    .from(TABLES.special)
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}

export async function addCompletion(
  taskKey: string,
  date: string,
): Promise<void> {
  const { error } = await supabase
    .from(TABLES.completions)
    .insert({ task_key: taskKey, completed_date: date });
  if (error) throw error;
}

export async function removeCompletions(ids: string[]): Promise<void> {
  if (!ids.length) return;
  const { error } = await supabase
    .from(TABLES.completions)
    .delete()
    .in("id", ids);
  if (error) throw error;
}
