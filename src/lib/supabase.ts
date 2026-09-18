// src/lib/supabase.ts — Supabase client (browser, ใช้ anon key เท่านั้น)
import { createClient } from "@supabase/supabase-js";

// fallback เป็น placeholder ที่ format ถูกต้อง เพื่อให้ `next build` prerender
// หน้า "/" ได้แม้ยังไม่มี .env.local (env จริงต้องตั้งไว้ก่อน deploy/รัน dev เสมอ)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key"
);
