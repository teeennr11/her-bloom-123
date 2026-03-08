//  app/components/HistoryRow.tsx  —  แถวประวัติรอบเดือนแต่ละรอบ
"use client";

import { useState } from "react";
import { Cycle, Phase, dur, fmt } from "../../src/lib/lib";

interface Props {
  cycle: Cycle;
  phase: Phase;
  onEdit: (c: Cycle) => void;    // กดปุ่ม Edit
  onDelete: (id: string) => void; // กดปุ่ม Delete
}

// Map flow id → label พร้อมไอคอน
const FLOW_LABEL: Record<string, string> = {
  light:  "💧 Light",
  medium: "💧💧 Medium",
  heavy:  "💧💧💧 Heavy",
};

export default function HistoryRow({ cycle, phase, onEdit, onDelete }: Props) {

  const [confirm, setConfirm] = useState(false);
  // confirm = ต้องกดปุ่ม Delete 2 ครั้ง เพื่อป้องกัน delete ผิดพลาด
  // ครั้งแรก: confirm = false → เปลี่ยนเป็น true + ตั้ง timer
  // ครั้งที่สอง (ภายใน 3 วิ): confirm = true → ลบจริง

  const d = dur(cycle.startDate, cycle.endDate); // ระยะเวลา (วัน) ของรอบนี้

  function del() {
    if (confirm) {
      onDelete(cycle.id); // กดครั้งที่ 2 → ลบจริง
    } else {
      setConfirm(true); // กดครั้งแรก → เปลี่ยนเป็น "Confirm?"
      setTimeout(() => setConfirm(false), 3000); // หลัง 3 วิ reset กลับ
    }
  }

  // มีข้อมูล flow หรือ moods ไหม (ใช้ตัดสินใจว่าจะแสดง tags ด้านล่างหรือเปล่า)
  const hasExtra = cycle.flow || (cycle.moods && cycle.moods.length > 0);

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl px-5 py-[15px] mb-2 bg-white border border-[#F0CCD8] shadow-[0_2px_10px_rgba(255,40,120,0.04)]">

      {/* ซ้าย: เส้นสี + ข้อมูล */}
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        {/* เส้นสีแนวตั้ง ซ้ายสุด */}
        <div
          className="w-[3px] h-9 rounded-full shrink-0"
          style={{ background: `linear-gradient(180deg, ${phase.color}, #FFADD0)` }}
        />

        <div className="flex-1 min-w-0">
          {/* วันที่เริ่ม */}
          <div className="font-sans text-[13px] font-medium text-[#1A0A10]">
            {fmt(cycle.startDate)}
          </div>

          {/* วันที่สิ้นสุด + ระยะเวลา (ถ้ามี) */}
          {cycle.endDate && (
            <div className="font-sans text-[11px] font-light mt-0.5 text-[#C8A0B0]">
              Until {fmt(cycle.endDate, { day: "numeric", month: "short" })}
              {d && ` · ${d} day${d > 1 ? "s" : ""}`}
            </div>
          )}

          {/* หมายเหตุ (ถ้ามี) */}
          {cycle.notes && (
            <div className="font-serif text-[12px] italic mt-0.5 text-[#D8B0C0] truncate">
              "{cycle.notes}"
            </div>
          )}

          {/* Flow + Symptom tags (ถ้ามี) */}
          {hasExtra && (
            <div className="flex flex-wrap gap-[5px] mt-1.5">
              {cycle.flow && (
                <span className="font-sans px-2.5 py-[3px] rounded-full text-[9px] font-medium bg-[#FFF0F6] text-[#FF2878] border border-[#FFADD0]">
                  {FLOW_LABEL[cycle.flow] || cycle.flow}
                </span>
              )}
              {cycle.moods?.map(s => (
                <span key={s} className="font-sans px-2.5 py-[3px] rounded-full text-[9px] font-normal bg-[#F4F0FC] text-[#7B5EA0] border border-[#DDD0F4]">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ขวา: ปุ่ม Edit + Delete */}
      <div className="flex gap-1.5 shrink-0">
        <button onClick={() => onEdit(cycle)}
          className="font-sans px-4 py-[5px] text-[11px] font-medium rounded-lg bg-[#FFF8FB] text-[#C8A0B0] border border-[#EDD0DC] hover:bg-[#F0CCD8]/20 transition-all cursor-pointer">
          Edit
        </button>
        <button onClick={del}
          className={`font-sans px-4 py-[5px] text-[11px] font-medium rounded-lg transition-all duration-200 border cursor-pointer
            ${confirm
              ? "bg-[#FFF2F7] text-[#FF2878] border-[#F0CCD8]" // สีเปลี่ยนเมื่อรอยืนยัน
              : "bg-[#FFF8FB] text-[#C8A0B0] border-[#EDD0DC]"}`}>
          {confirm ? "Confirm?" : "Delete"} {/* ข้อความเปลี่ยน */}
        </button>
      </div>
    </div>
  );
}

