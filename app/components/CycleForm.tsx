//  app/components/CycleForm.tsx  —  ฟอร์มบันทึก/แก้ไขรอบเดือน
"use client";

import { useState, useEffect } from "react";
import { Phase, Cycle, Form, EF } from "../../src/lib/lib";

interface Props {
  phase: Phase;                              // phase ปัจจุบัน (ใช้กำหนดสี)
  edit: Cycle | null;                        // รอบที่แก้ไข (null = เพิ่มใหม่)
  onSave: (f: Form, id?: string) => void;   // callback บันทึก
  onCancel: () => void;                      // callback ยกเลิก edit
}

// ตัวเลือกความแรงของประจำเดือน
const FLOWS = [
  { id: "light",  label: "Light",  drops: 1 }, // 1 หยด
  { id: "medium", label: "Medium", drops: 2 }, // 2 หยด
  { id: "heavy",  label: "Heavy",  drops: 3 }, // 3 หยด
];

// รายการอาการที่เลือกได้
const SYMPTOMS = [
  "Cramps", "Fatigue", "Nausea", "Headache",
  "Mood swings", "Bloating", "Back pain", "Fever",
  "Breast tenderness", "Spotting",
];

export default function CycleForm({ phase, edit, onSave, onCancel }: Props) {

  const [form, setForm] = useState<Form>(EF);
  // form = state ของข้อมูลในฟอร์ม เริ่มต้นว่าง (EF = Empty Form)

  const [errs, setErrs] = useState<Partial<Record<keyof Form, string>>>({});
  // errs = object เก็บ error message ของแต่ละ field
  // เช่น { startDate: "Please select a start date" }

  // เมื่อ edit prop เปลี่ยน (เปลี่ยนรอบที่แก้ไข หรือกด cancel)
  useEffect(() => {
    setForm(
      edit
        ? {
            // ถ้ากำลัง edit: เติมฟอร์มด้วยข้อมูลเดิม
            startDate: edit.startDate,
            endDate:   edit.endDate,
            notes:     edit.notes,
            flow:      edit.flow  || "",
            moods:     edit.moods || [],
          }
        : EF // ถ้าไม่ได้ edit: reset ฟอร์มให้ว่าง
    );
    setErrs({}); // ล้าง error ทุกครั้ง
  }, [edit]);

  // validate: ตรวจสอบข้อมูลในฟอร์มก่อนบันทึก
  function validate() {
    const e: Partial<Record<keyof Form, string>> = {};
    if (!form.startDate) e.startDate = "Please select a start date"; // บังคับกรอก
    if (form.endDate && form.endDate < form.startDate)
      e.endDate = "End date must be after start date"; // endDate ต้องไม่ก่อน startDate
    setErrs(e);
    return !Object.keys(e).length; // คืน true ถ้าไม่มี error
  }

  // save: กด save → validate → ถ้าผ่าน เรียก onSave → reset ฟอร์ม
  function save() {
    if (!validate()) return; // หยุดถ้า validate ไม่ผ่าน
    onSave(form, edit?.id);  // ส่งข้อมูลขึ้นไป page.tsx (edit?.id = undefined ถ้าเพิ่มใหม่)
    setForm(EF);              // reset ฟอร์ม
    setErrs({});              // ล้าง error
  }

  // toggleSymptom: เพิ่ม/ลบ symptom จาก moods array
  function toggleSymptom(s: string) {
    setForm(f => ({
      ...f,
      moods: f.moods.includes(s)
        ? f.moods.filter(m => m !== s) // ถ้ามีอยู่แล้ว → เอาออก
        : [...f.moods, s],              // ถ้ายังไม่มี → เพิ่มเข้า
    }));
  }

  const today = new Date().toISOString().split("T")[0];
  // วันนี้ในรูปแบบ "YYYY-MM-DD" ใช้เป็น max ของ date input (ป้องกันเลือกอนาคต)

  const inpBase = "w-full px-4 py-3 rounded-xl text-[13px] font-light outline-none transition-all duration-200 border bg-[#FFF8FB] text-[#1A0A10] font-sans focus:ring-[3px] min-h-[44px]";
  // class พื้นฐานของ input ทุกตัว

  const lblClass = "block text-[8px] font-semibold tracking-[0.16em] uppercase mb-2 text-[#D0A0B4] font-sans";
  // class ของ label ทุกตัว

  return (
    <div className="flex flex-col h-full gap-4">
      <p className="font-serif text-[20px] md:text-[22px] font-bold text-[#1A0A10]">
        Log <em className="not-italic font-normal italic text-[#FF2878]">Period</em>
      </p>

      <div className="flex flex-col gap-4">

        {/* Start Date */}
        <div className="flex flex-col gap-1">
          <label className={lblClass}>Start Date <span className="text-[#FF2878]">*</span></label>
          <input
            type="date"
            max={today}           // ไม่อนุญาตเลือกวันอนาคต
            value={form.startDate}
            className={`${inpBase} ${errs.startDate ? "border-[#FF2878]" : "border-[#EDD0DC]"}`}
            // border แดงถ้ามี error
            style={{ "--tw-ring-color": `${phase.color}18`, outlineColor: phase.color } as React.CSSProperties}
            // สี ring/outline ตาม phase
            onChange={e => {
              setForm({ ...form, startDate: e.target.value }); // อัปเดต state
              setErrs({ ...errs, startDate: undefined });       // ล้าง error ของ field นี้
            }}
          />
          {errs.startDate && <p className="font-sans text-[11px] mt-1 text-[#FF2878]">{errs.startDate}</p>}
          {/* แสดง error message */}
        </div>

        {/* End Date */}
        <div className="flex flex-col gap-1">
          <label className={lblClass}>End Date <span className="font-light text-[#C8A0B0]">(optional)</span></label>
          <input
            type="date"
            min={form.startDate || undefined} // endDate ต้องไม่ก่อน startDate
            max={today}
            value={form.endDate || ""}
            className={`${inpBase} ${errs.endDate ? "border-[#FF2878]" : "border-[#EDD0DC]"}`}
            style={{ "--tw-ring-color": `${phase.color}18`, outlineColor: phase.color } as React.CSSProperties}
            onChange={e => {
              setForm({ ...form, endDate: e.target.value });
              setErrs({ ...errs, endDate: undefined });
            }}
          />
          {errs.endDate && <p className="font-sans text-[11px] mt-1 text-[#FF2878]">{errs.endDate}</p>}
        </div>

        {/* Flow selector */}
        <div className="flex flex-col gap-2">
          <label className={lblClass}>Flow</label>
          <div className="grid grid-cols-3 gap-2">
            {FLOWS.map(f => {
              const isActive = form.flow === f.id; // กด active อยู่ไหม
              return (
                <button
                  key={f.id} type="button"
                  onClick={() => setForm(fm => ({
                    ...fm,
                    flow: fm.flow === f.id ? "" : f.id, // กดซ้ำ = deselect
                  }))}
                  className={`flex flex-col items-center gap-1 py-3 px-2 rounded-2xl transition-all border-[1.5px] min-h-[44px]
                    ${isActive ? "border-[#FF2878] bg-[#FFF0F6]" : "border-[#F0CCD8] bg-white"}`}
                >
                  {/* แสดงหยดน้ำตาม drops: active = เต็ม, ไม่ active = จาง */}
                  <div className="flex gap-px">
                    {[0, 1, 2].map(i => (
                      <span key={i} className="text-[13px]" style={{ opacity: i < f.drops ? 1 : 0.2 }}>
                        💧
                      </span>
                    ))}
                  </div>
                  <span className={`font-sans text-[11px] ${isActive ? "font-semibold text-[#FF2878]" : "font-light text-[#A08090]"}`}>
                    {f.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Symptoms */}
        <div className="flex flex-col gap-2">
          <label className={lblClass}>Symptoms <span className="font-light text-[#C8A0B0]">(optional)</span></label>
          <div className="flex flex-wrap gap-1.5">
            {SYMPTOMS.map(s => {
              const isActive = form.moods.includes(s);
              return (
                <button
                  key={s} type="button" onClick={() => toggleSymptom(s)}
                  className={`font-sans px-3 py-2 sm:py-1.5 rounded-full text-[11px] transition-all border-[1.5px] cursor-pointer min-h-[32px]
                    ${isActive
                      ? "border-[#FF2878] bg-[#FFF0F6] text-[#FF2878] font-medium" // เลือกแล้ว
                      : "border-[#F0CCD8] bg-white text-[#A08090] font-light"}`}   // ยังไม่เลือก
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notes textarea */}
        <div className="flex flex-col gap-1">
          <label className={lblClass}>Notes <span className="font-light text-[#C8A0B0]">(optional)</span></label>
          <textarea
            rows={2} placeholder="Add notes..."
            value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
            className={`${inpBase} resize-none border-[#EDD0DC]`}
            style={{ "--tw-ring-color": `${phase.color}18`, outlineColor: phase.color } as React.CSSProperties}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2.5 mt-0.5">
          {/* ปุ่ม Save / Update */}
          <button type="button" onClick={save}
            className="font-sans flex-1 py-3 text-[14px] font-semibold text-white rounded-2xl bg-gradient-to-br from-[#FF2878] to-[#FF7AB5] shadow-[0_6px_20px_rgba(255,40,120,0.26)] transition-all active:scale-[0.98] min-h-[48px]">
            {edit ? "Update Record" : "Save Record"}
            {/* ชื่อปุ่มเปลี่ยนตาม mode */}
          </button>

          {/* ปุ่ม Cancel แสดงเฉพาะตอน edit */}
          {edit && (
            <button type="button" onClick={onCancel}
              className="font-sans px-5 py-3 text-[14px] font-medium rounded-2xl border border-[#F0CCD8] bg-[#FFF0F6] text-[#C8A0B0] min-h-[48px]">
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
