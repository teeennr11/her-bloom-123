"use client";
import { useState, useEffect } from "react";
import { Phase, Cycle, Form, EF } from "../../src/lib/lib";

// Props ที่ component รับเข้ามา
interface Props { phase: Phase; edit: Cycle | null; onSave: (f: Form, id?: string) => void; onCancel: () => void; }

// ตัวเลือกระดับการไหล พร้อมจำนวนหยดน้ำที่แสดง
const FLOWS = [
  { id: "light", label: "Light", drops: 1 },
  { id: "medium", label: "Medium", drops: 2 },
  { id: "heavy", label: "Heavy", drops: 3 },
];
// รายการ symptom ทั้งหมดที่ให้ผู้ใช้เลือก
const SYMPTOMS = [
  "Cramps", "Fatigue", "Nausea", "Headache",
  "Mood swings", "Bloating", "Back pain", "Fever",
  "Breast tenderness", "Spotting",
];

export default function CycleForm({ phase, edit, onSave, onCancel }: Props) {
  const [form, setForm] = useState<Form>(EF); // state ฟอร์ม, EF = Empty Form (ค่าเริ่มต้นว่างเปล่า)
  const [errs, setErrs] = useState<Partial<Record<keyof Form, string>>>({}); // error message แยกตาม field

  useEffect(() => {
    // ถ้ามี edit record → ดึงค่ามาใส่ฟอร์ม / ถ้าไม่มี → reset เป็น empty
    setForm(edit ? { startDate: edit.startDate, endDate: edit.endDate, notes: edit.notes, flow: edit.flow || "", moods: edit.moods || [] } : EF);
    setErrs({}); // ล้าง error ทุกครั้งที่ edit เปลี่ยน
  }, [edit]);

  function validate() {
    const e: Partial<Record<keyof Form, string>> = {};
    if (!form.startDate) e.startDate = "Please select a start date"; // บังคับกรอก startDate
    if (form.endDate && form.endDate < form.startDate) e.endDate = "End date must be after start date"; // endDate ต้องไม่ก่อน startDate
    setErrs(e); return !Object.keys(e).length; // คืน true ถ้าไม่มี error
  }

  function save() { if (!validate()) return; onSave(form, edit?.id); setForm(EF); setErrs({}); } // validate → ส่งข้อมูลพร้อม id (edit mode) → reset

  // เพิ่ม/ลบ symptom ออกจาก array moods
  function toggleSymptom(s: string) {
    setForm(f => ({ ...f, moods: f.moods.includes(s) ? f.moods.filter(m => m !== s) : [...f.moods, s] }));
  }

  const today = new Date().toISOString().split("T")[0]; // วันนี้รูปแบบ YYYY-MM-DD ใช้เป็น max ของ date input

  // className พื้นฐานสำหรับ input/textarea ทุกช่อง
  const inpBase = "w-full px-4 py-3 rounded-xl text-[13px] font-light outline-none transition-all duration-200 border bg-[#FFF8FB] text-[#1A0A10] font-sans focus:ring-[3px] min-h-[44px]";
  // className สำหรับ label แต่ละช่อง
  const lblClass = "block text-[8px] font-semibold tracking-[0.16em] uppercase mb-2 text-[#D0A0B4] font-sans";

  return (
    <div className="flex flex-col h-full gap-4">
      {/* หัวข้อฟอร์ม */}
      <p className="font-serif text-[20px] md:text-[22px] font-bold text-[#1A0A10]">
        Log <em className="not-italic font-normal italic text-[#FF2878]">Period</em>
      </p>

      <div className="flex flex-col gap-4">

        {/* Start Date */}
        <div className="flex flex-col gap-1">
          <label className={lblClass}>Start Date <span className="text-[#FF2878]">*</span></label>
          <input
            type="date" max={today} value={form.startDate}
            className={`${inpBase} ${errs.startDate ? 'border-[#FFFFFF]' : 'FF2878-[#EDD0DC]'}`} // เส้นแดงเมื่อ error
            style={{ '--tw-ring-color': `${phase.color}18`, outlineColor: phase.color } as React.CSSProperties} // ใช้สี phase สำหรับ focus ring
            onChange={e => { setForm({ ...form, startDate: e.target.value }); setErrs({ ...errs, startDate: undefined }); }} // ล้าง error ทันทีที่แก้ไข
          />
          {errs.startDate && <p className="font-sans text-[11px] mt-1 text-[#FF2878]">{errs.startDate}</p>} {/* แสดง error ถ้ามี */}
        </div>

        {/* End Date */}
        <div className="flex flex-col gap-1">
          <label className={lblClass}>End Date <span className="font-light text-[#C8A0B0]">(optional)</span></label>
          <input
            type="date" min={form.startDate || undefined} max={today} value={form.endDate || ''} // min ล็อกไม่ให้เลือกก่อน startDate
            className={`${inpBase} ${errs.endDate ? 'border-[#FFFFFF]' : 'border-[#FFFFFF]'}`}
            style={{ '--tw-ring-color': `${phase.color}18`, outlineColor: phase.color } as React.CSSProperties}
            onChange={e => { setForm({ ...form, endDate: e.target.value }); setErrs({ ...errs, endDate: undefined }); }}
          />
          {errs.endDate && <p className="font-sans text-[11px] mt-1 text-[#FF2878]">{errs.endDate}</p>}
        </div>

        {/* Flow */}
        <div className="flex flex-col gap-2">
          <label className={lblClass}>Flow</label>
          {/* Grid 3 คอลัมน์ แต่ละปุ่มแทนระดับการไหล */}
          <div className="grid grid-cols-3 gap-2">
            {FLOWS.map(f => {
              const isActive = form.flow === f.id; // ตรวจว่า flow นี้ถูกเลือกอยู่ไหม
              return (
                <button
                  key={f.id} type="button"
                  onClick={() => setForm(fm => ({ ...fm, flow: fm.flow === f.id ? "" : f.id }))} // คลิกซ้ำ = deselect
                  className={`flex flex-col items-center gap-1 py-3 px-2 rounded-2xl transition-all border-[1.5px] min-h-[44px] ${isActive ? 'border-[#FF2878] bg-[#FFF0F6]' : 'border-[#F0CCD8] bg-white'}`}
                >
                  <div className="flex gap-px">
                    {[0, 1, 2].map(i => <span key={i} className="text-[13px]" style={{ opacity: i < f.drops ? 1 : 0.2 }}>💧</span>)} {/* หยดที่เกิน drops จะโปร่งใส */}
                  </div>
                  <span className={`font-sans text-[11px] ${isActive ? 'font-semibold text-[#FF2878]' : 'font-light text-[#A08090]'}`}>{f.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Symptoms */}
        <div className="flex flex-col gap-2">
          <label className={lblClass}>Symptoms <span className="font-light text-[#C8A0B0]">(optional)</span></label>
          {/* Pills แบบ wrap — กด toggle เพิ่ม/ลบ symptom */}
          <div className="flex flex-wrap gap-1.5">
            {SYMPTOMS.map(s => {
              const isActive = form.moods.includes(s); // ตรวจว่า symptom นี้ถูกเลือกไหม
              return (
                <button
                  key={s} type="button" onClick={() => toggleSymptom(s)}
                  className={`font-sans px-3 py-2 sm:py-1.5 rounded-full text-[11px] transition-all border-[1.5px] cursor-pointer min-h-[32px] ${isActive ? 'border-[#FF2878] bg-[#FFF0F6] text-[#FF2878] font-medium' : 'border-[#F0CCD8] bg-white text-[#A08090] font-light'}`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-1">
          <label className={lblClass}>Notes <span className="font-light text-[#C8A0B0]">(optional)</span></label>
          <textarea
            rows={2} placeholder="Add notes..." value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
            className={`${inpBase} resize-none border-[#EDD0DC]`} // resize-none ปิดการปรับขนาด
            style={{ '--tw-ring-color': `${phase.color}18`, outlineColor: phase.color } as React.CSSProperties}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 mt-0.5">
          <button
            type="button" onClick={save}
            className="font-sans flex-1 py-3 text-[14px] font-semibold text-white rounded-2xl bg-gradient-to-br from-[#FF2878] to-[#FF7AB5] shadow-[0_6px_20px_rgba(255,40,120,0.26)] transition-all active:scale-[0.98] min-h-[48px]"
          >
            {edit ? "Update Record" : "Save Record"} {/* ข้อความเปลี่ยนตาม mode */}
          </button>
          {edit && ( // แสดงปุ่ม Cancel เฉพาะตอน edit mode
            <button
              type="button" onClick={onCancel}
              className="font-sans px-5 py-3 text-[14px] font-medium rounded-2xl border border-[#F0CCD8] bg-[#FFF0F6] text-[#C8A0B0] min-h-[48px]"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}