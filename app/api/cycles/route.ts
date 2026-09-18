// app/api/cycles/route.ts — GET (list) / POST (create)
import { NextResponse } from "next/server";
import { adminDb, verifyRequest } from "../../../src/lib/supabase-admin";
import { toCycle, validateCycleBody, type CycleBody, type Row } from "../../../src/lib/cycle-api";

export async function GET(req: Request) {
  const uid = await verifyRequest(req);
  if (!uid) return NextResponse.json({ error: true, msg: "Unauthorized" }, { status: 401 });

  const { data, error } = await adminDb()
    .from("cycles")
    .select("id, start_date, end_date, notes, flow, moods")
    .eq("user_id", uid);

  if (error) return NextResponse.json({ error: true, msg: error.message }, { status: 500 });

  return NextResponse.json({ error: false, cycles: (data as Row[]).map(toCycle) });
}

export async function POST(req: Request) {
  const uid = await verifyRequest(req);
  if (!uid) return NextResponse.json({ error: true, msg: "Unauthorized" }, { status: 401 });

  let raw: Record<string, unknown>;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: true, msg: "Invalid JSON body" }, { status: 400 });
  }

  const invalidMsg = validateCycleBody(raw);
  if (invalidMsg) return NextResponse.json({ error: true, msg: invalidMsg }, { status: 400 });
  const body = raw as CycleBody & { id?: string };

  const row: Row & { user_id: string } = {
    id: body.id || Date.now().toString(),
    user_id: uid,
    start_date: body.startDate,
    end_date: body.endDate,
    notes: body.notes ?? "",
    flow: body.flow ?? "",
    moods: body.moods ?? [],
  };

  // upsert อิง primary key (user_id, id) — ต้องส่ง user_id จาก token เสมอ
  // ป้องกันไม่ให้แก้ไข/ทับข้อมูลของผู้ใช้คนอื่นด้วย id ที่บังเอิญซ้ำกัน
  const { error } = await adminDb()
    .from("cycles")
    .upsert(row, { onConflict: "user_id,id" });

  if (error) return NextResponse.json({ error: true, msg: error.message }, { status: 500 });

  return NextResponse.json({ error: false, msg: "updated", cycle: toCycle(row) }, { status: 201 });
}
