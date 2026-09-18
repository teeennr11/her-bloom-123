// src/lib/cycle-api.ts — shared validation + row mapping used by app/api/cycles/* routes only
// (server-side; ไม่ import ในไฟล์ฝั่ง frontend)
import type { Cycle } from "./lib";

export const FLOWS = ["", "light", "medium", "heavy"];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export type Row = {
  id: string;
  start_date: string;
  end_date: string;
  notes: string | null;
  flow: string | null;
  moods: string[] | null;
};

export type CycleBody = {
  startDate: string;
  endDate: string;
  notes?: string;
  flow?: string;
  moods?: string[];
};

export const toCycle = (row: Row): Cycle => ({
  id: row.id,
  startDate: row.start_date,
  endDate: row.end_date,
  notes: row.notes ?? "",
  flow: row.flow ?? "",
  moods: row.moods ?? [],
});

export function validateCycleBody(body: Record<string, unknown>): string | null {
  if (typeof body.startDate !== "string" || !DATE_RE.test(body.startDate)) {
    return "startDate is required and must be in YYYY-MM-DD format";
  }
  if (typeof body.endDate !== "string" || !DATE_RE.test(body.endDate)) {
    return "endDate is required and must be in YYYY-MM-DD format";
  }
  if (new Date(body.endDate) < new Date(body.startDate)) {
    return "endDate must not be before startDate";
  }
  if (body.notes !== undefined && (typeof body.notes !== "string" || body.notes.length > 500)) {
    return "notes must be a string of at most 500 characters";
  }
  if (body.flow !== undefined && !FLOWS.includes(body.flow as string)) {
    return "flow must be one of: light, medium, heavy";
  }
  if (body.moods !== undefined && (!Array.isArray(body.moods) || !body.moods.every((m: unknown) => typeof m === "string"))) {
    return "moods must be an array of strings";
  }
  return null;
}
