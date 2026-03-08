// ════════════════════════════════════════════════════════════════
//  app/components/Login.tsx  —  หน้า Login / Register
// ════════════════════════════════════════════════════════════════
"use client";
import { useState } from "react";
// Firebase Auth functions
import {
  createUserWithEmailAndPassword, // สร้างบัญชีใหม่
  signInWithEmailAndPassword,      // เข้าสู่ระบบด้วย email/password
  updateProfile,                   // อัปเดต displayName หลังสมัคร
} from "firebase/auth";
import { auth } from "../../src/lib/firebase";

export default function Login({ onLogin }: { onLogin: (name: string) => void }) {

  // ── State ทั้งหมดของฟอร์ม ──────────────────────────────────
  const [isReg, setIsReg] = useState(false);  // false = Login mode, true = Register mode
  const [name,  setName]  = useState("");     // ชื่อ (เฉพาะ Register)
  const [email, setEmail] = useState("");     // อีเมล
  const [pass,  setPass]  = useState("");     // รหัสผ่าน
  const [conf,  setConf]  = useState("");     // ยืนยันรหัสผ่าน (เฉพาะ Register)
  const [err,   setErr]   = useState("");     // error message
  const [show,  setShow]  = useState(false);  // แสดง/ซ่อน password
  const [loading, setLoading] = useState(false); // กำลัง submit อยู่ไหม

  // submit: ฟังก์ชันหลักเมื่อกดปุ่ม Login หรือ Create Account
  async function submit() {
    setErr("");        // ล้าง error เก่า
    setLoading(true);  // เริ่ม loading

    try {
      if (isReg) {
        // ── Register mode ──────────────────────────────────
        if (!name.trim()) { setErr("Please enter your name"); setLoading(false); return; }
        // ตรวจสอบ name ไม่ว่าง

        if (pass !== conf) { setErr("Passwords do not match"); setLoading(false); return; }
        // ตรวจสอบ password ตรงกัน

        if (pass.length < 6) { setErr("Password must be at least 6 characters"); setLoading(false); return; }
        // Firebase ต้องการ password อย่างน้อย 6 ตัว

        // สร้างบัญชีใหม่ใน Firebase Auth
        const cred = await createUserWithEmailAndPassword(auth, email, pass);

        // บันทึก displayName หลังสร้างบัญชีสำเร็จ
        await updateProfile(cred.user, { displayName: name });

        onLogin(name); // บอก page.tsx ว่า login สำเร็จ
      } else {
        // ── Login mode ──────────────────────────────────────
        const cred = await signInWithEmailAndPassword(auth, email, pass);
        // Firebase จะ authenticate และคืน credential

        // ใช้ displayName ถ้ามี ถ้าไม่มีใช้ email แทน
        onLogin(cred.user.displayName || email);
      }
    } catch (e: any) {
      // แปลง Firebase error code เป็นข้อความที่อ่านง่าย
      const msg: Record<string, string> = {
        "auth/email-already-in-use": "Email already in use",
        "auth/user-not-found":       "Account not found",
        "auth/wrong-password":       "Incorrect password",
        "auth/invalid-email":        "Invalid email address",
        "auth/invalid-credential":   "Invalid email or password",
      };
      setErr(msg[e.code] || e.message); // ถ้าไม่มีใน map ใช้ message ดิบ
    }
    setLoading(false); // ปิด loading ไม่ว่าจะสำเร็จหรือไม่
  }

  // class พื้นฐาน input
  const inpClass = "w-full px-4 py-[13px] bg-white/80 border-[1.5px] border-[#F0CCD8] rounded-2xl text-[14px] font-sans text-[#1A0A10] outline-none box-border transition-all duration-200 focus:border-[#FF2878] focus:ring-[3px] focus:ring-[#FF2878]/20";
  const lblClass = "block text-[9px] font-semibold text-[#C8A0B0] tracking-[0.16em] mb-[7px] uppercase font-sans";

  return (
    // พื้นหลัง + จัดให้อยู่กลางหน้าจอ
    <div className="min-h-screen flex items-center justify-center bg-[#FDF0F5] relative overflow-hidden">
      {/* เงา gradient มุม top-right */}
      <div className="absolute -top-[80px] -right-[80px] w-[340px] h-[340px] rounded-full bg-[#FF2878]/5 blur-[50px] pointer-events-none" />
      {/* เงา gradient มุม bottom-left */}
      <div className="absolute -bottom-[60px] -left-[60px] w-[280px] h-[280px] rounded-full bg-[#FF7AB5]/10 blur-[40px] pointer-events-none" />

      {/* Card หลัก: glass effect */}
      <div className="glass-card w-full max-w-[420px] rounded-[32px] px-[42px] py-12 shadow-[0_24px_64px_rgba(255,40,120,0.12)] relative z-10">

        {/* Header: โลโก้ + subtitle */}
        <div className="text-center mb-9">
          <div className="flex items-center justify-center gap-3 mb-1.5">
            {/* วงกลมโลโก้ */}
            <div className="w-[46px] h-[46px] rounded-full border-[1.5px] border-[#FF2878] flex items-center justify-center bg-white shadow-[0_4px_16px_rgba(255,40,120,0.15)] shrink-0">
              <span className="font-serif text-[18px] italic text-[#FF2878] tracking-[-0.04em]">hb</span>
            </div>
            <div className="text-left">
              <div className="font-serif text-[20px] font-bold text-[#1A0A10] leading-none">Her Bloom</div>
              <div className="font-sans text-[8px] font-medium text-[#FF2878] tracking-[0.22em] mt-[3px]">CYCLE TRACKER</div>
            </div>
          </div>
          {/* subtitle เปลี่ยนตาม mode */}
          <p className="text-[13px] text-[#A08090] mt-4 font-sans font-light">
            {isReg ? "Create your account" : "Welcome back"}
          </p>
        </div>

        {/* Toggle Tab: Sign In / Register */}
        <div className="flex bg-[#FFF0F6] rounded-xl p-1 mb-7 border border-[#F0CCD8]">
          {["Sign In", "Register"].map((l, i) => (
            <button key={l}
              onClick={() => { setIsReg(i === 1); setErr(""); }}
              // i=0 → Sign In (isReg=false) / i=1 → Register (isReg=true)
              className={`flex-1 py-[9px] rounded-[10px] border-none font-sans font-semibold text-[13px] cursor-pointer transition-all duration-200 ${
                (i === 1) === isReg
                  ? "bg-[#FF2878] text-white"     // active tab
                  : "bg-transparent text-[#C8A0B0]" // inactive tab
              }`}>
              {l}
            </button>
          ))}
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-3.5">
          {/* Name field: เฉพาะ Register */}
          {isReg && (
            <div>
              <label className={lblClass}>Your Name</label>
              <input placeholder="e.g. Tasnin" value={name}
                onChange={e => setName(e.target.value)} className={inpClass} />
            </div>
          )}

          {/* Email */}
          <div>
            <label className={lblClass}>Email</label>
            <input type="email" placeholder="you@email.com" value={email}
              onChange={e => setEmail(e.target.value)} className={inpClass} />
          </div>

          {/* Password + toggle show/hide */}
          <div>
            <label className={lblClass}>Password</label>
            <div className="relative">
              <input
                type={show ? "text" : "password"} // toggle ระหว่างแสดง/ซ่อน
                placeholder="••••••••" value={pass}
                onChange={e => setPass(e.target.value)}
                onKeyDown={e => e.key === "Enter" && submit()} // กด Enter = submit
                className={`${inpClass} pr-11`}
              />
              {/* ปุ่ม toggle แสดง/ซ่อน password */}
              <button onClick={() => setShow(!show)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-[15px] text-[#FFADD0]">
                {show ? "◎" : "○"} {/* ไอคอนตา: เปิด = ◎, ปิด = ○ */}
              </button>
            </div>
          </div>

          {/* Confirm Password: เฉพาะ Register */}
          {isReg && (
            <div>
              <label className={lblClass}>Confirm Password</label>
              <input type={show ? "text" : "password"} placeholder="••••••••" value={conf}
                onChange={e => setConf(e.target.value)}
                onKeyDown={e => e.key === "Enter" && submit()}
                className={inpClass} />
            </div>
          )}

          {/* Error Banner */}
          {err && (
            <div className="bg-[#FFF0F4] border border-[#FFADD0] rounded-[10px] px-3.5 py-2.5 text-[12px] text-[#FF2878] font-semibold font-sans">
              ⚠ {err}
            </div>
          )}

          {/* Submit Button */}
          <button onClick={submit} disabled={loading}
            className={`w-full p-3.5 mt-1 text-white border-none rounded-2xl font-sans font-semibold text-[14px] transition-all duration-150 ${
              loading
                ? "bg-[#FFB0D0] cursor-not-allowed"  // disabled style ระหว่าง loading
                : "bg-gradient-to-br from-[#FF2878] to-[#FF7AB5] cursor-pointer shadow-[0_6px_22px_rgba(255,40,120,0.28)] hover:opacity-90 hover:-translate-y-px"
            }`}>
            {loading ? "Loading..." : (isReg ? "Create Account" : "Sign In")}
            {/* ข้อความปุ่มเปลี่ยนตาม state */}
          </button>
        </div>
      </div>
    </div>
  );
}
