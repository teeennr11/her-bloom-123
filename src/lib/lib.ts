// ════════════════════════════════════════════════════════════════
//  src/lib/lib.ts  —  ไฟล์กลาง: Types, ค่าคงที่, และฟังก์ชันช่วย
// ════════════════════════════════════════════════════════════════

// ── ประกาศ Type (โครงสร้างข้อมูล) ──────────────────────────────

// Cycle = ข้อมูลรอบเดือนแต่ละรอบที่ผู้ใช้บันทึก
export interface Cycle {
  id: string;        // รหัสเฉพาะของแต่ละรอบ (ใช้ timestamp เป็น id)
  startDate: string; // วันที่เริ่มรอบเดือน รูปแบบ "YYYY-MM-DD"
  endDate: string;   // วันที่สิ้นสุดรอบเดือน รูปแบบ "YYYY-MM-DD"
  notes: string;     // หมายเหตุที่ผู้ใช้พิมพ์เพิ่มเติม
  flow?: string;     // ความแรงของประจำเดือน: "light" | "medium" | "heavy" (optional)
  moods?: string[];  // รายการอาการต่างๆ เช่น ["Cramps","Fatigue"] (optional)
}

// Phase = ข้อมูลแต่ละช่วงของรอบเดือน (มี 4 ช่วง)
export interface Phase {
  id: string;                // ชื่อย่อ เช่น "period", "follicular", "ovulation", "luteal"
  name: string;              // ชื่อเต็มที่แสดงบน UI เช่น "Period Phase"
  range: [number, number];   // ช่วงวันที่ที่เป็น phase นี้ เช่น [1, 5] = วันที่ 1-5
  color: string;             // สีของ phase นี้ ใช้ใน UI เช่น "#FF2878"
  ringTrack: string;         // สีพื้นหลังของวงแหวนใน Ring component
  tip: string;               // คำแนะนำสำหรับ phase นี้ แสดงใน Insights
  pregnancy: string;         // โอกาสตั้งครรภ์ใน phase นี้ เช่น "Very Low", "High"
}

// Pred = ผลการทำนายรอบเดือนถัดไป
export interface Pred {
  nextPeriod: Date;   // วันที่คาดว่ารอบเดือนจะมาครั้งต่อไป
  ovulation: Date;    // วันที่คาดว่าจะตกไข่
  fertileStart: Date; // วันแรกของช่วงเจริญพันธุ์ (ตกไข่ - 5 วัน)
  fertileEnd: Date;   // วันสุดท้ายของช่วงเจริญพันธุ์ (ตกไข่ + 5 วัน)
  avgCycle: number;   // ความยาวรอบเดือนเฉลี่ย (วัน)
}

// Form = ข้อมูลในฟอร์มที่ผู้ใช้กรอก ก่อนบันทึกเป็น Cycle
export interface Form {
  startDate: string; // วันที่เริ่ม
  endDate: string;   // วันที่สิ้นสุด
  notes: string;     // หมายเหตุ
  flow: string;      // ความแรง
  moods: string[];   // อาการ
}

// Tab = ชื่อแท็บที่ใช้สลับหน้า
export type Tab = "home" | "summary";


// ── ค่าคงที่สำหรับ Design (สี, ขนาด, เงา) ─────────────────────

export const T = {
  pink:    "#FF2878",  // สีชมพูหลัก ใช้ปุ่ม, accent
  rose:    "#0d0b0c",  // สีชมพูอ่อนกว่า ใช้ gradient
  blush:   "#FFADD0",  // สีชมพูพาสเทล ใช้ border บางจุด
  petal:   "#FFF0F6",  // สีพื้นหลังชมพูอ่อนมาก
  bg:      "#56293a",  // สีพื้นหลังทั้งหน้า
  white:   "#FFFFFF",  // สีขาว
  deep:    "#1A0A10",  // สีดำอมม่วง ใช้กับตัวหนังสือหลัก
  mauve:   "#C8A0B0",  // สีเทาอมชมพู ใช้ข้อความรอง
  muted:   "#A08090",  // สีเทาอมชมพูเข้มขึ้น
  border:  "#F0CCD8",  // สี border ของ card
  inputBg: "#FFF8FB",  // สีพื้นหลัง input
  inputBdr:"#EDD0DC",  // สี border ของ input
  shadow:  "0 4px 20px rgba(255,40,120,0.08)", // เงา card มาตรฐาน
  grad:    "linear-gradient(135deg,#FF2878,#FF7AB5)", // gradient ปุ่มหลัก
  sideW:   230,        // ความกว้าง sidebar (px)
};

export const SERIF = "'Libre Baskerville', serif"; // ฟอนต์ serif ใช้กับหัวข้อ, ตัวเลข
export const SANS  = "'Inter', sans-serif";         // ฟอนต์ sans-serif ใช้กับข้อความทั่วไป


// ── ข้อมูลทั้ง 4 Phase ของรอบเดือน ─────────────────────────────

export const PHASES: Phase[] = [
  {
    id: "period",              // ช่วงมีประจำเดือน
    name: "Period Phase",
    range: [1, 5] as [number, number],   // วันที่ 1-5 ของรอบ
    color: "#FF2878",
    ringTrack: "#F5D8E8",
    tip: "Rest and be kind to yourself today.",
    pregnancy: "Very Low",
  },
  {
    id: "follicular",          // ช่วงฟอลลิคูลาร์ (ไข่กำลังพัฒนา)
    name: "Follicular Phase",
    range: [6, 13] as [number, number],  // วันที่ 6-13
    color: "#FF6FA8",
    ringTrack: "#FAE0EE",
    tip: "Energy is rising. A great time to start something new.",
    pregnancy: "Low",
  },
  {
    id: "ovulation",           // ช่วงตกไข่
    name: "Ovulation Phase",
    range: [14, 17] as [number, number], // วันที่ 14-17
    color: "#E0207A",
    ringTrack: "#F5D8E8",
    tip: "Peak energy and confidence this week. Great time for important decisions.",
    pregnancy: "High",         // โอกาสตั้งครรภ์สูงสุด
  },
  {
    id: "luteal",              // ช่วงลูเทียล (หลังตกไข่)
    name: "Luteal Phase",
    range: [18, 28] as [number, number], // วันที่ 18-28
    color: "#C0609A",
    ringTrack: "#EDD5E5",
    tip: "Wind down and practice self-care.",
    pregnancy: "Low",
  },
];

// EF = Empty Form = ค่าเริ่มต้น (ว่าง) ของฟอร์ม ใช้ reset ฟอร์มหลังบันทึก
export const EF: Form = { startDate: "", endDate: "", notes: "", flow: "", moods: [] };


// ── ฟังก์ชันช่วย (Utility Functions) ──────────────────────────

// getPhase: รับวันที่ในรอบ → คืน Phase ที่ตรงกัน
// ถ้าไม่เจอ phase ใดเลย (เกิน 28 วัน) คืน PHASES[3] (Luteal)
export const getPhase = (d: number) =>
  PHASES.find(p => d >= p.range[0] && d <= p.range[1]) ?? PHASES[3];


// avgCycle: คำนวณความยาวรอบเดือนเฉลี่ยจากประวัติทั้งหมด
export function avgCycle(cs: Cycle[]) {
  if (cs.length < 2) return 28; // ถ้าข้อมูลน้อยกว่า 2 รอบ คืนค่า default 28 วัน

  // เรียงจากใหม่ → เก่า
  const s = [...cs].sort((a, b) => +new Date(b.startDate) - +new Date(a.startDate));

  const g: number[] = []; // อาร์เรย์เก็บความห่างระหว่างรอบ (วัน)

  for (let i = 0; i < s.length - 1; i++) {
    // คำนวณจำนวนวันระหว่าง startDate ของรอบที่ i กับ i+1
    const v = Math.floor(
      (+new Date(s[i].startDate) - +new Date(s[i + 1].startDate)) / 86400000
      //                                                             ↑ 1000ms × 60s × 60min × 24h = 1 วัน
    );
    if (v > 15 && v < 60) g.push(v); // กรองเฉพาะค่าที่สมเหตุสมผล (15-60 วัน)
  }

  // ถ้ามีข้อมูลพอ: คืนค่าเฉลี่ย / ถ้าไม่มี: คืน 28
  return g.length
    ? Math.round(g.reduce((a, b) => a + b, 0) / g.length)
    : 28;
}


// dayOfCycle: คำนวณว่าวันนี้เป็นวันที่เท่าไรในรอบเดือนปัจจุบัน
export function dayOfCycle(start: string, avg = 28) {
  const s = new Date(start);  // วันที่เริ่มรอบล่าสุด
  s.setHours(0, 0, 0, 0);     // รีเซ็ตเวลาเป็น 00:00:00 เพื่อเทียบแค่วัน

  const t = new Date();       // วันนี้
  t.setHours(0, 0, 0, 0);

  // จำนวนวันที่ผ่านมาตั้งแต่เริ่มรอบ
  const d = Math.floor((+t - +s) / 86400000);

  if (d < 0) return 1;        // ถ้าวันเริ่มอยู่ในอนาคต คืน 1
  return (d % avg) + 1;       // หารเอาเศษ (วนรอบ) แล้ว +1 เพราะวันแรก = 1 ไม่ใช่ 0
}


// predict: ทำนายรอบเดือนถัดไป, วันตกไข่, และช่วงเจริญพันธุ์
export function predict(cs: Cycle[]): Pred | null {
  if (!cs.length) return null; // ไม่มีข้อมูลเลย คืน null

  // เรียงจากใหม่ → เก่า เพื่อเอา startDate ล่าสุด
  const s = [...cs].sort((a, b) => +new Date(b.startDate) - +new Date(a.startDate));

  const avg = avgCycle(cs);           // ความยาวรอบเฉลี่ย
  const l = new Date(s[0].startDate); // วันที่เริ่มรอบล่าสุด

  // ฟังก์ชันช่วยบวกวัน: รับ Date + จำนวนวัน คืน Date ใหม่
  const add = (d: Date, n: number) => {
    const r = new Date(d);
    r.setDate(d.getDate() + n);
    return r;
  };

  const ov = add(l, avg - 14); // วันตกไข่ = เริ่มรอบ + (ความยาวรอบ - 14)
                                // เพราะไข่ตกก่อนรอบถัดไป ~14 วันเสมอ
  return {
    nextPeriod:  add(l, avg),    // รอบถัดไป = เริ่มรอบปัจจุบัน + ความยาวรอบ
    ovulation:   ov,
    fertileStart: add(ov, -5),   // ช่วงเจริญพันธุ์เริ่ม 5 วันก่อนตกไข่
    fertileEnd:   add(ov, 5),    // ช่วงเจริญพันธุ์สิ้นสุด 5 วันหลังตกไข่
    avgCycle:    avg,
  };
}


// dur: คำนวณระยะเวลา (วัน) ระหว่าง startDate และ endDate
export function dur(s: string, e: string) {
  if (!s || !e) return null; // ถ้าข้อมูลไม่ครบ คืน null

  // +1 เพราะนับรวมวันแรกและวันสุดท้ายด้วย (inclusive)
  const d = Math.floor((+new Date(e) - +new Date(s)) / 86400000) + 1;
  return d > 0 ? d : null; // ถ้า endDate ก่อน startDate คืน null
}


// fmt: แปลง Date เป็น string รูปแบบ locale "en-GB"
// ตัวอย่าง: fmt("2026-01-15") → "15 January 2026"
export function fmt(
  d: string | Date,
  o: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" }
) {
  return new Date(d).toLocaleDateString("en-GB", o);
}

// fmtS: แปลง Date เป็น string แบบสั้น
// ตัวอย่าง: fmtS(date) → "15 Jan"
export const fmtS = (d: Date) => fmt(d, { day: "numeric", month: "short" });

// daysUntil: คำนวณจำนวนวันที่เหลือจนถึงวันที่กำหนด
// ค่าบวก = อีกกี่วัน / ค่าลบ = ผ่านไปแล้วกี่วัน
export const daysUntil = (d: Date) =>
  Math.ceil(
    (d.getTime() - new Date().setHours(0, 0, 0, 0)) // ผลต่างระหว่างวันที่เป้าหมาย กับ เที่ยงคืนวันนี้
    / 86400000 // หารด้วย ms ต่อวัน
  );