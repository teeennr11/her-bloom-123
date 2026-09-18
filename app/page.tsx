//  app/page.tsx  —  หน้าหลัก (Root Page) จัดการ State ทั้งหมด
"use client"; // บอก Next.js ว่า component นี้รันบน Browser (ไม่ใช่ Server)

// นำเข้า React hooks
import { useState, useEffect } from "react";

// นำเข้า type ของ user จาก Supabase
import type { User } from "@supabase/supabase-js";

// นำเข้า instance ของ Supabase (ใช้ auth ฝั่ง client)
import { supabase } from "../src/lib/supabase";

// นำเข้า data access ของตาราง cycles (เรียก Supabase ตรง ป้องกันด้วย Row Level Security)
import { fetchCycles, saveCycle, deleteCycle } from "../src/lib/cycles";

// นำเข้า type และฟังก์ชันจาก lib
import {
  Cycle, Form, Tab,          // types
  getPhase, avgCycle,        // ฟังก์ชันคำนวณ phase และค่าเฉลี่ย
  dayOfCycle, predict,       // ฟังก์ชันคำนวณวัน และทำนายรอบ
} from "../src/lib/lib";

// นำเข้า components ทั้งหมด
import Login       from "./components/Login";    // หน้า login/register
import Landing     from "./components/Landing";  // หน้าแรก (ยังไม่ login)
import Sidebar     from "./components/Sidebar";  // แถบเมนูซ้าย
import HomeTab     from "./components/HomeTab";  // แท็บหน้าหลัก
import InsightsTab from "./Insights/InsightsTab"; // แท็บ insights

// ════════════════════════════════════════════════════════════════
export default function Page() {

  // ── State ทั้งหมดของ app ────────────────────────────────────

  const [user, setUser] = useState<User | null>(null);
  // user = ข้อมูลผู้ใช้ที่ login อยู่ (null = ยังไม่ login)

  const [authLoading, setAuthLoading] = useState(true);
  // authLoading = true ระหว่างที่ Supabase กำลังตรวจสอบว่า login อยู่ไหม
  // ป้องกัน flash ของหน้า landing ก่อนตรวจสอบเสร็จ

  const [cycles, setCycles] = useState<Cycle[]>([]);
  // cycles = อาร์เรย์ข้อมูลรอบเดือนทั้งหมดของผู้ใช้ปัจจุบัน

  const [edit, setEdit] = useState<Cycle | null>(null);
  // edit = รอบที่กำลัง edit อยู่ (null = กำลัง add ใหม่ ไม่ใช่ edit)

  const [tab, setTab] = useState<Tab>("home");
  // tab = แท็บที่แสดงอยู่ตอนนี้ ("home" หรือ "summary")

  const [showLogin, setShowLogin] = useState(false);
  // showLogin = แสดงหน้า login แทนหน้า landing หรือไม่
  // กด "Get Started" หรือ "Sign In" บน Landing จะเป็น true

  const [error, setError] = useState<string | null>(null);
  // error = ข้อความ error ล่าสุดที่จะแสดงเป็น banner (null = ไม่มี)

  // ── useEffect: ฟัง Auth State ──────────────────────────────
  useEffect(() => {
    // onAuthStateChange จะถูกเรียกทุกครั้งที่สถานะ login เปลี่ยน (รวมถึงตอน mount ครั้งแรก)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser); // อัปเดต user (null = ยังไม่ login / logout แล้ว)
      if (!nextUser) setCycles([]); // ล้างข้อมูลทันทีที่ตรวจพบว่า logout/session หมดอายุ
      setAuthLoading(false); // ตรวจสอบเสร็จแล้ว ปิด loading
    });
    return () => subscription.unsubscribe(); // cleanup: ยกเลิก subscription เมื่อ component unmount
  }, []); // [] = รันครั้งเดียวตอน mount


  // ── useEffect: โหลดข้อมูลรอบเดือนจาก Supabase ─────────────
  useEffect(() => {
    if (!user) return; // cycles ว่างอยู่แล้ว (ค่าเริ่มต้น หรือถูกล้างจาก auth listener/logout() แล้ว)

    // ดึงเฉพาะ cycles ของ user คนนี้ (RLS กรองให้อัตโนมัติ)
    fetchCycles()
      .then(setCycles)
      .catch((e: Error) => setError("Load failed: " + e.message));
  }, [user]); // รันใหม่ทุกครั้งที่ user เปลี่ยน


  // ── handleSave: บันทึกรอบเดือนใหม่หรืออัปเดตที่มีอยู่ ────
  // throw ต่อเมื่อ error เพื่อให้ CycleForm รู้ว่าล้มเหลว จะได้ไม่เคลียร์ฟอร์มทิ้ง
  async function handleSave(f: Form, id?: string) {
    if (!user) { setError("Not logged in"); throw new Error("Not logged in"); }

    try {
      // ถ้ามี id (edit) ใช้ id เดิม / ถ้าไม่มี (สร้างใหม่) จะสร้าง id ให้
      const cycle = await saveCycle(f, id);

      // อัปเดต state ในเครื่อง: แทนที่ตัวเดิม (ถ้ามี) ด้วยผลลัพธ์ที่บันทึกแล้ว
      setCycles((prev) => [...prev.filter((c) => c.id !== cycle.id), cycle]);

      setEdit(null); // ล้าง edit state หลังบันทึกสำเร็จ
      setError(null);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Something went wrong";
      setError("Save failed: " + message);
      throw e;
    }
  }


  // ── handleDelete: ลบรอบเดือน ───────────────────────────────
  async function handleDelete(id: string) {
    if (!user) return;

    try {
      await deleteCycle(id);
      setCycles((prev) => prev.filter((c) => c.id !== id));
      setError(null);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Something went wrong";
      setError("Delete failed: " + message);
      throw e;
    }
  }


  // ── logout: ออกจากระบบ ─────────────────────────────────────
  async function logout() {
    await supabase.auth.signOut(); // เรียก Supabase sign out
    setShowLogin(false);     // กลับไปหน้า landing
    setCycles([]);            // ล้างข้อมูล
    setEdit(null);            // ล้าง edit state
    setTab("home");           // รีเซ็ตแท็บ
  }


  // ── Derived State (คำนวณจาก state ที่มีอยู่) ───────────────

  // เรียง cycles จากใหม่ → เก่า
  const sorted = [...cycles].sort(
    (a, b) => +new Date(b.startDate) - +new Date(a.startDate)
  );

  // คำนวณความยาวรอบเดือนเฉลี่ย
  const avg = avgCycle(cycles);

  // คำนวณวันที่ในรอบปัจจุบัน
  // ถ้ามีข้อมูล: ใช้ startDate ของรอบล่าสุด / ถ้าไม่มี: default วัน 14
  const day = sorted[0] ? dayOfCycle(sorted[0].startDate, avg) : 14;

  // หา phase ปัจจุบันจากวันที่ในรอบ
  const phase = getPhase(day);

  // ทำนายรอบถัดไป
  const pred = predict(cycles);

  // ชื่อผู้ใช้ ลองดึงจาก display_name (user_metadata) ก่อน ถ้าไม่มีใช้ email
  const userName =
    user?.user_metadata?.display_name ||
    user?.email?.split("@")[0] || // เอาแค่ส่วนก่อน @ ของ email
    "";


  // ── Loading Screen ─────────────────────────────────────────
  if (authLoading) return (
    // แสดงโลโก้ตรงกลางระหว่างรอ Supabase ตรวจสอบ session
    <div className="min-h-screen flex items-center justify-center bg-[#fdf1f0]">
      <div className="text-center">
        {/* วงกลมโลโก้ */}
        <div className="w-[42px] h-[42px] rounded-full border-[1.5px] border-[#FF2878] flex items-center justify-center bg-white mx-auto mb-4 shadow-[0_4px_16px_rgba(255,40,120,0.15)]">
          <span className="font-serif text-[17px] italic text-[#FF2878]">hb</span>
        </div>
        <p className="font-sans text-[12px] text-[#C8A0B0]">Loading...</p>
      </div>
    </div>
  );

  // ── Routing ────────────────────────────────────────────────
  // ถ้ายังไม่ login และยังไม่กด sign in → แสดง Landing page
  if (!user && !showLogin) return <Landing onLogin={() => setShowLogin(true)} />;

  // ถ้ายังไม่ login แต่กด sign in แล้ว → แสดง Login page
  // onLogin รับ name แต่ส่ง empty function เพราะ page.tsx
  // จะรับ user จาก onAuthStateChanged แทน
  if (!user && showLogin) return <Login onLogin={() => {}} />;


  // ── Main App Layout (หลัง login) ───────────────────────────
  return (
    // Container หลัก: flex row ให้ Sidebar อยู่ซ้าย, content อยู่ขวา
    // h-[100dvh] = ความสูง 100% ของหน้าจอ (dvh = dynamic viewport height รองรับ mobile)
    // overflow-hidden = ไม่ให้ทั้งหน้า scroll (ให้ main scroll แทน)
    <div className="flex h-[100dvh] overflow-hidden bg-[#fdf1f0]">

      {/* Sidebar: เมนูซ้าย */}
      <Sidebar
        tab={tab}
        userName={userName}
        phase={phase}
        onTab={setTab}       // เมื่อกดเมนู → เปลี่ยน tab
        onLogout={logout}    // เมื่อกด sign out → เรียก logout()
      />

      {/* Main content area: scroll ได้แนวตั้ง */}
      {/* padding ปรับตาม breakpoint: mobile น้อย → desktop มาก */}
      <main className="flex-1 h-full overflow-y-auto px-3 py-4 sm:px-5 sm:py-5 md:px-8 md:py-8 lg:px-[52px] lg:py-[42px]">

        {/* Error banner: แสดงเมื่อโหลด/บันทึก/ลบข้อมูลล้มเหลว ปิดได้ด้วยปุ่ม × */}
        {error && (
          <div className="flex items-start justify-between gap-3 mb-4 rounded-[10px] border border-[#FFADD0] bg-[#FFF0F4] px-3.5 py-2.5 font-sans text-[12px] font-semibold text-[#FF2878]">
            <span>⚠ {error}</span>
            <button
              onClick={() => setError(null)}
              aria-label="Dismiss error"
              className="shrink-0 leading-none text-[#FF2878] cursor-pointer"
            >
              ×
            </button>
          </div>
        )}

        {/* แสดง HomeTab ถ้า tab === "home" */}
        {tab === "home" && (
          <HomeTab
            userName={userName}
            day={day}
            phase={phase}
            cycles={cycles}     // ข้อมูลดิบทั้งหมด (ใช้ใน CalendarStrip)
            sorted={sorted}     // ข้อมูลเรียงแล้ว (ใช้ใน History)
            avg={avg}
            pred={pred}
            edit={edit}          // รอบที่กำลัง edit (null = mode เพิ่มใหม่)
            onSave={handleSave}
            onEdit={setEdit}     // กด edit ใน HistoryRow → setEdit(cycle)
            onDelete={handleDelete}
            onCancelEdit={() => setEdit(null)} // กด cancel → ล้าง edit
          />
        )}

        {/* แสดง InsightsTab ถ้า tab === "summary" */}
        {tab === "summary" && (
          <InsightsTab
            cycles={cycles}
            sorted={sorted}
            phase={phase}
            day={day}
            avg={avg}
            pred={pred}
          />
        )}
      </main>
    </div>
  );
}