//  app/components/CalendarStrip.tsx  —  แถบปฏิทิน 7 วัน
"use client";

import { useState } from "react";
import { Cycle } from "../../src/lib/lib";

export default function CalendarStrip({ cycles }: { cycles: Cycle[] }) {

  const today = new Date();       // วันนี้
  today.setHours(0, 0, 0, 0);    // รีเซ็ตเวลาเป็น 00:00 เพื่อเทียบแค่วัน

  const [offset, setOffset] = useState(0);
  // offset = เลื่อนสัปดาห์: 0 = สัปดาห์ปัจจุบัน, -1 = สัปดาห์ที่แล้ว, +1 = สัปดาห์ถัดไป

  // สร้างอาร์เรย์ 7 วัน โดยวันนี้อยู่ตรงกลาง (index 3)
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    // i=0 → วันนี้ - 3, i=3 → วันนี้, i=6 → วันนี้ + 3
    // + offset*7 เพื่อเลื่อนสัปดาห์
    d.setDate(today.getDate() - 3 + i + offset * 7);
    return d;
  });

  // ฟังก์ชันช่วยแปลงเลขเป็น 2 หลัก เช่น 1 → "01"
  const pad = (n: number) => String(n).padStart(2, "0");

  // แปลง Date เป็น string รูปแบบ "YYYY-MM-DD"
  const toStr = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  // ฟังก์ชันตรวจสอบสถานะของแต่ละวัน
  const isToday  = (d: Date) => toStr(d) === toStr(today); // วันนี้ไหม
  const isFuture = (d: Date) => d > today;                 // อนาคตไหม
  const isPeriod = (d: Date) => cycles.some(c => {
    // เช็คว่าวัน d อยู่ในช่วง startDate - endDate ของ cycle ใดก็ได้ไหม
    const s = new Date(c.startDate + "T00:00:00"); // เพิ่ม time เพื่อป้องกัน timezone offset
    const e = c.endDate ? new Date(c.endDate + "T00:00:00") : s; // ถ้าไม่มี endDate ใช้ startDate
    return d >= s && d <= e;
  });

  const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"]; // ตัวย่อวันอาทิตย์-เสาร์
  const monthLabel = days[3].toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  // ใช้วันกลาง (index 3) เป็นตัวแทน เช่น "March 2026"

  return (
    <div className="bg-white border border-[#F0CCD8] rounded-[20px] px-3 py-2 sm:px-[18px] sm:py-[10px] mb-6 shadow-[0_2px_10px_rgba(255,40,120,0.04)]">
      {/* Header: ชื่อเดือน + ปุ่มเลื่อนซ้าย/ขวา */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-serif text-[12px] sm:text-[13px] font-normal text-[#1A0A10]">
          {monthLabel}
        </span>
        <div className="flex gap-1.5">
          {[
            { lbl: "‹", fn: () => setOffset(o => o - 1) }, // เลื่อนซ้าย = สัปดาห์ที่แล้ว
            { lbl: "›", fn: () => setOffset(o => o + 1) }, // เลื่อนขวา = สัปดาห์ถัดไป
          ].map(b => (
            <button key={b.lbl} onClick={b.fn}
              className="w-[32px] h-[32px] sm:w-[26px] sm:h-[26px] flex items-center justify-center text-[14px] sm:text-[13px] rounded-full border border-[#F0CCD8] bg-white text-[#A08090] hover:bg-[#FFF5F8] hover:text-[#FF2878] active:scale-95 transition-all cursor-pointer">
              {b.lbl}
            </button>
          ))}
        </div>
      </div>

      {/* Grid 7 ช่อง สำหรับ 7 วัน */}
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
        {days.map((d, i) => {
          const tod = isToday(d);  // วันนี้?
          const per = isPeriod(d); // วันมีประจำเดือน?
          const fut = isFuture(d); // อนาคต?

          return (
            <div
              key={i}
              className={`flex flex-col items-center gap-[3px] py-[6px] px-[1px] sm:py-[5px] sm:px-[2px] rounded-xl transition-all
                ${tod ? "bg-gradient-to-br from-[#FF2878] to-[#FF7AB5] shadow-sm" : "bg-transparent"}
                ${fut ? "opacity-35" : "opacity-100"}`}
                // วันนี้: พื้นชมพู gradient / วันอื่น: ใส
                // วันอนาคต: จางลง 35%
            >
              {/* ป้ายวัน: "Today" หรือ M/T/W... */}
              <span className={`font-sans text-[7px] sm:text-[8px] font-semibold tracking-[.06em]
                ${tod ? "text-white/75" : "text-[#C8A0B0]"}`}>
                {tod ? "Today" : DAY_LABELS[d.getDay()]}
              </span>

              {/* ตัวเลขวันที่ */}
              <span className={`font-sans text-[12px] sm:text-[13px] leading-none
                ${tod  ? "font-bold text-white"          // วันนี้: ขาว bold
                : per  ? "font-medium text-[#FF2878]"    // มีประจำเดือน: ชมพู
                       : "font-normal text-[#1A0A10]"}`}> {/* ปกติ: ดำ */}
                {d.getDate()}
              </span>

              {/* จุดใต้ตัวเลข */}
              <div className={`w-1 h-1 rounded-full
                ${tod ? "bg-white/50"       // วันนี้: จุดขาว
                : per ? "bg-[#FF2878]"      // มีประจำเดือน: จุดชมพู
                      : "bg-transparent"}`} // ปกติ: ไม่มีจุด
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}


// 