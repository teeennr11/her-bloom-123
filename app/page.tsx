//  app/page.tsx  —  หน้าหลัก (Root Page) จัดการ State ทั้งหมด
"use client"; // บอก Next.js ว่า component นี้รันบน Browser (ไม่ใช่ Server)

// นำเข้า React hooks
import { useState, useEffect } from "react";

// นำเข้า Firebase Auth functions
import { onAuthStateChanged, signOut, User } from "firebase/auth";
// onAuthStateChanged = subscribe ฟังการเปลี่ยนแปลงสถานะ login
// signOut = ฟังก์ชัน logout
// User = type ของข้อมูลผู้ใช้ Firebase

// นำเข้า Firebase Realtime Database functions
import { ref, onValue, set } from "firebase/database";
// ref = สร้าง reference (ที่อยู่) ในฐานข้อมูล เช่น "users/uid/cycles"
// onValue = subscribe ฟังการเปลี่ยนแปลงข้อมูลแบบ realtime
// set = เขียนข้อมูลทับ (overwrite) ที่ reference นั้น

// นำเข้า instance ของ Firebase
import { auth, db } from "../src/lib/firebase";

// นำเข้า type และฟังก์ชันจาก lib
import {
  T, SERIF, SANS,           // ค่า design token และ font
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
  // authLoading = true ระหว่างที่ Firebase กำลังตรวจสอบว่า login อยู่ไหม
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

  // ── useEffect: ฟัง Auth State ──────────────────────────────
  useEffect(() => {
    // onAuthStateChanged จะถูกเรียกทุกครั้งที่สถานะ login เปลี่ยน
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);           // อัปเดต user (u = null ถ้า logout)
      setAuthLoading(false); // ตรวจสอบเสร็จแล้ว ปิด loading
    });
    return () => unsub(); // cleanup: ยกเลิก subscription เมื่อ component unmount
  }, []); // [] = รันครั้งเดียวตอน mount


  // ── useEffect: ฟังข้อมูลรอบเดือนจาก Firebase ──────────────
  useEffect(() => {
    if (!user) {
      setCycles([]); // ถ้า logout แล้ว ล้างข้อมูลรอบเดือน
      return;
    }

    // สร้าง reference ไปยัง "users/{uid}/cycles" ใน database
    const unsub = onValue(ref(db, `users/${user.uid}/cycles`), (snap) => {
      const data = snap.val(); // snap.val() = ข้อมูลดิบจาก Firebase (object หรือ null)

      // Object.values แปลง { id1: {...}, id2: {...} } → [{...}, {...}]
      setCycles(data ? (Object.values(data) as Cycle[]) : []);
    });

    return () => unsub(); // cleanup เมื่อ user เปลี่ยนหรือ component unmount
  }, [user]); // รันใหม่ทุกครั้งที่ user เปลี่ยน


  // ── handleSave: บันทึกรอบเดือนใหม่หรืออัปเดตที่มีอยู่ ────
  async function handleSave(f: Form, id?: string) {
    if (!user) { alert("Not logged in"); return; } // ป้องกันถ้า user เป็น null

    try {
      const newId = id || Date.now().toString();
      // ถ้ามี id (กำลัง edit) ใช้ id เดิม / ถ้าไม่มี (สร้างใหม่) ใช้ timestamp เป็น id

      // เขียนข้อมูลไปที่ "users/{uid}/cycles/{newId}"
      await set(ref(db, `users/${user.uid}/cycles/${newId}`), {
        id: newId, // เก็บ id ไว้ใน object ด้วย เพื่อให้ดึงออกมาได้ง่าย
        ...f,      // spread form data ทั้งหมด (startDate, endDate, notes, flow, moods)
      });

      setEdit(null); // ล้าง edit state หลังบันทึกสำเร็จ
    } catch (e: any) {
      alert("Save failed: " + e.message); // แสดง error ถ้าบันทึกไม่ได้
    }
  }


  // ── handleDelete: ลบรอบเดือน ───────────────────────────────
  async function handleDelete(id: string) {
    if (!user) return;

    try {
      // set ค่าเป็น null = ลบ node นั้นออกจาก Firebase
      await set(ref(db, `users/${user.uid}/cycles/${id}`), null);
    } catch (e: any) {
      alert("Delete failed: " + e.message);
    }
  }


  // ── logout: ออกจากระบบ ─────────────────────────────────────
  async function logout() {
    await signOut(auth);     // เรียก Firebase sign out
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

  // ชื่อผู้ใช้ ลองดึงจาก displayName ก่อน ถ้าไม่มีใช้ email
  const userName =
    auth.currentUser?.displayName ||
    user?.displayName ||
    user?.email?.split("@")[0] || // เอาแค่ส่วนก่อน @ ของ email
    "";


  // ── Loading Screen ─────────────────────────────────────────
  if (authLoading) return (
    // แสดงโลโก้ตรงกลางระหว่างรอ Firebase ตรวจสอบ session
    <div style={{
      minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center",
      background: T.bg, // สีพื้นหลัง
    }}>
      <div style={{ textAlign: "center" }}>
        {/* วงกลมโลโก้ */}
        <div style={{
          width: 42, height: 42, borderRadius: "50%",
          border: `1.5px solid ${T.pink}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "white",
          margin: "0 auto 16px",
          boxShadow: "0 4px 16px rgba(255,40,120,0.15)",
        }}>
          <span style={{ fontFamily: SERIF, fontSize: 17, fontStyle: "italic", color: T.pink }}>hb</span>
        </div>
        <p style={{ fontFamily: SANS, fontSize: 12, color: T.mauve }}>Loading...</p>
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
    <div className="flex h-[100dvh] overflow-hidden" style={{ background: T.bg }}>

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