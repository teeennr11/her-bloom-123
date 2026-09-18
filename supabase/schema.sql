-- รันไฟล์นี้ใน Supabase Dashboard -> SQL Editor ตอน setup โปรเจกต์ครั้งแรก
create table cycles (
  id         text not null,
  user_id    uuid not null references auth.users on delete cascade,
  start_date date not null,
  end_date   date not null,
  notes      text default '',
  flow       text default '',
  moods      jsonb default '[]',
  primary key (user_id, id) -- id ไม่ซ้ำแค่ "ภายในผู้ใช้คนเดียวกัน" เหมือนโครงสร้างเดิมของ Firebase
);

alter table cycles enable row level security;

-- backend (app/api/cycles/*) เรียกผ่าน service role key ซึ่งข้าม RLS ไปเลยอยู่แล้ว
-- (route handler กรอง user_id เองทุกจุด) — policy นี้เก็บไว้เป็น defense-in-depth
-- เผื่อวันหน้ามีจุดอื่นที่ต้องใช้ anon key คุยกับตารางนี้ตรงๆ
create policy "users manage own cycles"
  on cycles for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
