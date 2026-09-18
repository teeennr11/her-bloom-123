// src/lib/supabase-admin.ts — Supabase Admin client (server-side only, used by app/api routes)
// ใช้ service role key ซึ่ง "ข้าม" Row Level Security ไปเลย —
// ทุก query ในไฟล์นี้จึงต้องกรอง .eq("user_id", uid) เองเสมอ ห้ามลืม
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | undefined;

// Lazy: สร้าง client ตอนมี request จริงเท่านั้น ไม่สร้างตอน import module
// เพราะ `next build` จะ import route handler ไปเก็บ page data ก่อนที่
// .env.local ของ production จะพร้อมเสมอไป — ถ้าสร้างตอน import จะพัง build
function getAdminClient(): SupabaseClient {
  if (_client) return _client;

  _client = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  return _client;
}

export const adminDb = () => getAdminClient();

// อ่าน "Authorization: Bearer <access_token>" ที่ frontend แนบมา
// แล้วคืน uid ของผู้ใช้ที่ token นั้นยืนยันตัวตนได้ หรือ null ถ้า token ไม่ถูกต้อง
export async function verifyRequest(req: Request): Promise<string | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice(7);
  const { data, error } = await getAdminClient().auth.getUser(token);
  if (error || !data.user) return null;

  return data.user.id;
}
