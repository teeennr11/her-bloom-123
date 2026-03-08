//  app/components/Ring.tsx  —  วงแหวนวิชวลไลซ์รอบเดือน (SVG)
"use client";

import { Phase } from "../../src/lib/lib";

// ข้อมูลสีและจำนวนวันของแต่ละ phase สำหรับวาดส่วนโค้ง
const PHASES_ARC = [
  { from: "#D94070", to: "#E8557A", days: 5  }, // Period: 5 วัน
  { from: "#F07A9E", to: "#F599B4", days: 8  }, // Follicular: 8 วัน
  { from: "#F5B8CC", to: "#FAD0DE", days: 4  }, // Ovulation: 4 วัน
  { from: "#C878A8", to: "#DCA0C4", days: 11 }, // Luteal: 11 วัน
];                                                // รวม = 28 วัน

export default function Ring({ day, phase }: { day: number; phase: Phase }) {

  const sz = 240; // ขนาด SVG (px)
  const R  = 96;  // รัศมีของวงแหวน (px)
  const C  = 2 * Math.PI * R; // เส้นรอบวง = 2πr ≈ 603.2 px
  const cx = sz / 2; // จุดศูนย์กลาง x = 120
  const cy = sz / 2; // จุดศูนย์กลาง y = 120

  let cumDays = 0; // สะสมจำนวนวัน เพื่อคำนวณ offset ของแต่ละส่วนโค้ง

  const arcs = PHASES_ARC.map((p, i) => {
    const len = (p.days / 28) * C;
    // ความยาวส่วนโค้ง = สัดส่วนวัน × เส้นรอบวงทั้งหมด

    const offset = -(cumDays / 28) * C;
    // strokeDashoffset: เลื่อนจุดเริ่มของส่วนโค้ง
    // ลบ เพราะต้องการเลื่อนทวนเข็ม

    cumDays += p.days; // สะสมวัน

    // วันเริ่ม/สิ้นสุดของ phase นี้ (index 0=Period, 1=Follicular, ...)
    const starts = [1, 6, 14, 18][i];
    const ends   = [5, 13, 17, 28][i];
    const isCurrent = day >= starts && day <= ends; // day ปัจจุบันอยู่ใน phase นี้ไหม

    return { ...p, len, offset, isCurrent, idx: i };
  });

  // คำนวณตำแหน่ง dot ที่เลื่อนตาม day
  const endAngle = (Math.min(day, 28) / 28) * 360 - 90;
  // แปลง day → องศา (0° = 12 นาฬิกา = วันที่ 1)
  // -90 เพราะ SVG 0° = ตำแหน่ง 3 นาฬิกา ต้องเลื่อน

  const endRad = (endAngle * Math.PI) / 180; // แปลงองศา → เรเดียน
  const ex = cx + R * Math.cos(endRad);       // x ของ dot (จากสูตรวงกลม)
  const ey = cy + R * Math.sin(endRad);       // y ของ dot

  return (
    <div className="relative mx-auto" style={{ width: sz, height: sz }}>
      <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`} className="absolute top-0 left-0 overflow-visible">
        <defs>
          {/* Gradient สำหรับ sweep (ไม่ได้ใช้ใน code ปัจจุบัน แต่ reserve ไว้) */}
          <linearGradient id="sweep" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#D94070" />
            <stop offset="28%"  stopColor="#F07A9E" />
            <stop offset="58%"  stopColor="#F5B8CC" />
            <stop offset="100%" stopColor="#C878A8" />
          </linearGradient>

          {/* Filter เพิ่มเงา glow ให้ส่วนโค้ง active */}
          <filter id="arcglow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="7" result="blur" /> {/* เบลอ */}
            <feMerge>
              <feMergeNode in="blur" />            {/* layer เบลอ */}
              <feMergeNode in="SourceGraphic" />   {/* layer ต้นฉบับ (ทับบน) */}
            </feMerge>
          </filter>

          {/* Filter เพิ่ม glow ให้ dot */}
          <filter id="dotglow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gradient พื้นหน้าวงใน (ดูเหมือนแสงส่อง) */}
          <radialGradient id="faceBg" cx="45%" cy="35%" r="70%">
            <stop offset="0%"   stopColor="#ffffff" />
            <stop offset="60%"  stopColor="#FFF6FA" />
            <stop offset="100%" stopColor="#FFE8F2" />
          </radialGradient>

          {/* Gradient สำหรับ border วงใน */}
          <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#FFD0E8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFB0D0" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* วงกลม Track (พื้นหลังวงแหวน สีชมพูอ่อน) */}
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="#FDE8F2" strokeWidth="14" />

        {/* วาดส่วนโค้งของ phase ที่ไม่ active (จาง) */}
        {arcs.filter(a => !a.isCurrent).map((a) => (
          <circle key={a.idx} cx={cx} cy={cy} r={R} fill="none"
            stroke={a.from}
            strokeWidth="12"
            strokeDasharray={`${a.len - 6} ${C - a.len + 6}`}
            // strokeDasharray: "ความยาวส่วนที่เห็น" + "ความยาวช่องว่าง"
            // -6 เพื่อเว้นช่องเล็กน้อยระหว่าง phase
            strokeDashoffset={a.offset} // เลื่อนจุดเริ่ม
            strokeLinecap="round"       // ปลายโค้งมน
            className="opacity-55"      // จาง 55%
            transform={`rotate(-90 ${cx} ${cy})`}
            // หมุน -90° เพื่อให้ Day 1 อยู่ที่ 12 นาฬิกา
          />
        ))}

        {/* วาดส่วนโค้งของ phase ที่ active (สว่าง + glow) */}
        {arcs.filter(a => a.isCurrent).map((a) => (
          <circle key={`c${a.idx}`} cx={cx} cy={cy} r={R} fill="none"
            stroke={a.from}
            strokeWidth="16"     // หนากว่า inactive
            strokeDasharray={`${a.len - 4} ${C - a.len + 4}`}
            strokeDashoffset={a.offset}
            strokeLinecap="round"
            filter="url(#arcglow)" // เพิ่ม glow
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        ))}

        {/* Dot สีชมพูที่ตำแหน่ง 12 นาฬิกา (Day 1) */}
        <circle cx={cx} cy={cy - R} r={7} fill="#FF2878" filter="url(#dotglow)" className="opacity-90" />
        <circle cx={cx} cy={cy - R} r={3} fill="white" /> {/* จุดขาวข้างใน */}

        {/* Dot สีตาม phase ที่เลื่อนตาม day */}
        <circle cx={ex} cy={ey} r={8} fill={phase.color} filter="url(#dotglow)" className="opacity-95" />
        <circle cx={ex} cy={ey} r={3.5} fill="white" />
        <circle cx={ex + 1} cy={ey - 1} r={1.2} fill="white" className="opacity-60" /> {/* highlight เล็กๆ */}

        {/* วงกลมด้านใน (หน้าตา) */}
        <circle cx={cx} cy={cy} r={R - 20} fill="url(#faceBg)" />
        <circle cx={cx} cy={cy} r={R - 20} fill="none" stroke="url(#borderGrad)" strokeWidth="1.5" />
      </svg>

      {/* ข้อความตรงกลางวง (ทับบน SVG) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-0">
        <span className="font-sans text-[8px] tracking-[0.3em] text-[#D8A8BC] font-semibold uppercase mb-[2px]">
          Period Day
        </span>

        {/* ตัวเลข day ขนาดใหญ่ สีตาม phase */}
        <span
          className="font-serif text-[58px] font-bold leading-[1] tracking-[-0.03em]"
          style={{ color: phase.color, textShadow: `0 2px 16px ${phase.color}44` }}
        >
          {day}
        </span>

        {/* SVG หน้าตาน่ารัก (mascot) */}
        <svg width="64" height="38" viewBox="0 0 64 38" className="mt-1">
          {/* แก้มสีชมพู */}
          <ellipse cx="10" cy="22" rx="9" ry="5.5" fill="#FFB0CC" className="opacity-35" />
          <ellipse cx="54" cy="22" rx="9" ry="5.5" fill="#FFB0CC" className="opacity-35" />
          {/* ดวงตา (oval สีดำ) */}
          <ellipse cx="20" cy="13" rx="5" ry="5.5" fill="#2A1020" />
          <ellipse cx="44" cy="13" rx="5" ry="5.5" fill="#2A1020" />
          {/* highlight ตา */}
          <circle cx="22.5" cy="10.5" r="2.2" fill="white" />
          <circle cx="46.5" cy="10.5" r="2.2" fill="white" />
          <circle cx="21" cy="14" r="1" fill="white" className="opacity-50" />
          <circle cx="45" cy="14" r="1" fill="white" className="opacity-50" />
          {/* ปาก (เส้นโค้ง Q = quadratic bezier) */}
          <path d="M20 29 Q32 40 44 29" fill="none" stroke="#2A1020" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}