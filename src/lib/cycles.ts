// src/lib/cycles.ts — frontend client for the cycles REST API (app/api/cycles/*)
// Auth ยังใช้ Supabase SDK ตรงเหมือนเดิม (ดู src/lib/supabase.ts) — ใช้แค่ session
// access token ตรงนี้เพื่อแนบไปกับ request เท่านั้น ตัวข้อมูล cycles เองไม่แตะ Supabase ตรง
import { supabase } from "./supabase";
import type { Cycle, Form } from "./lib";

async function authHeaders() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Not logged in");
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

export async function fetchCycles(): Promise<Cycle[]> {
  const res = await fetch("/api/cycles", { headers: await authHeaders() });
  if (!res.ok) throw new Error((await res.json()).msg ?? "Failed to load cycles");

  const { cycles } = await res.json();
  return cycles;
}

export async function saveCycle(form: Form, id?: string): Promise<Cycle> {
  const res = await fetch("/api/cycles", {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify({ ...form, id }),
  });
  if (!res.ok) throw new Error((await res.json()).msg ?? "Save failed");

  const { cycle } = await res.json();
  return cycle;
}

export async function deleteCycle(id: string): Promise<void> {
  const res = await fetch(`/api/cycles/${id}`, {
    method: "DELETE",
    headers: await authHeaders(),
  });
  if (!res.ok) throw new Error((await res.json()).msg ?? "Delete failed");
}
