// app/api/cycles/[id]/route.ts — updateCycle (PUT) / deleteCycle (DELETE)
import { NextResponse } from "next/server";
import { adminDb, verifyRequest } from "../../../../src/lib/supabase-admin";
import { validateCycleBody, type CycleBody } from "../../../../src/lib/cycle-api";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const uid = await verifyRequest(req);
  if (!uid) return NextResponse.json({ error: true, msg: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  let raw: Record<string, unknown>;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: true, msg: "Invalid JSON body" }, { status: 400 });
  }

  const invalidMsg = validateCycleBody(raw);
  if (invalidMsg) return NextResponse.json({ error: true, msg: invalidMsg }, { status: 400 });
  const body = raw as CycleBody;

  const { data, error } = await adminDb()
    .from("cycles")
    .update({
      start_date: body.startDate,
      end_date: body.endDate,
      notes: body.notes ?? "",
      flow: body.flow ?? "",
      moods: body.moods ?? [],
    })
    .eq("id", id)
    .eq("user_id", uid) // ป้องกันแก้ไขข้อมูลของผู้ใช้คนอื่น แม้จะรู้ id ก็ตาม
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: true, msg: "ไม่พบข้อมูลรอบเดือน หรือคุณไม่มีสิทธิ์แก้ไข" },
      { status: 404 }
    );
  }

  return NextResponse.json({ error: false, msg: "updated", data }, { status: 200 });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const uid = await verifyRequest(req);
  if (!uid) return NextResponse.json({ error: true, msg: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const { error } = await adminDb()
    .from("cycles")
    .delete()
    .eq("id", id)
    .eq("user_id", uid);

  if (error) return NextResponse.json({ error: true, msg: error.message }, { status: 500 });

  return NextResponse.json({ error: false, msg: "deleted" }, { status: 200 });
}
