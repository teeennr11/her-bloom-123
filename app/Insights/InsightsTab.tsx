//  app/Insights/InsightsTab.tsx  —  หน้า Insights (แท็บ Summary)
"use client";

import { Cycle, Phase, Pred, fmtS, daysUntil, dur } from "../../src/lib/lib";

type Props = {
  cycles: Cycle[];
  sorted: Cycle[];
  phase: Phase;
  day: number;
  avg: number;
  pred: Pred | null;
};

export default function InsightsTab({ cycles, sorted, phase, day, avg, pred }: Props) {

  // คำนวณข้อมูลระยะเวลาของแต่ละรอบ
  const durations = sorted.map(c => ({
    date: fmtS(new Date(c.startDate)), // วันที่เริ่ม (แบบสั้น)
    dur: dur(c.startDate, c.endDate),   // ระยะเวลา (วัน)
  }));

  // คำนวณความยาวระหว่างรอบ (cycle length)
  const lengths: number[] = [];
  for (let i = 0; i < sorted.length - 1; i++) {
    // ผลต่างระหว่าง startDate ของรอบติดกัน
    const v = Math.floor(
      (+new Date(sorted[i].startDate) - +new Date(sorted[i + 1].startDate)) / 86400000
    );
    if (v > 15 && v < 60) lengths.push(v); // กรองค่าสมเหตุสมผล
  }

  // ค่าเฉลี่ยระยะเวลาของประจำเดือน
  const validDurations = durations.filter(d => d.dur); // กรองเฉพาะที่มีข้อมูล endDate
  const avgDur = validDurations.length
    ? Math.round(validDurations.reduce((a, b) => a + (b.dur || 0), 0) / validDurations.length)
    : null;

  // ค่า max สำหรับ normalize bar chart
  const maxLen = lengths.length ? Math.max(...lengths) : avg;
  const maxDur = durations.some(d => d.dur) ? Math.max(...durations.map(d => d.dur || 0)) : 7;

  // ค่าสำหรับ Upcoming section
  const daysLeft  = pred ? Math.max(0, daysUntil(pred.nextPeriod)) : null; // วันที่เหลือถึงรอบหน้า
  const daysToOv  = pred ? Math.max(0, daysUntil(pred.ovulation))  : null; // วันที่เหลือถึงตกไข่
  const inFertile = pred
    ? daysUntil(pred.fertileStart) <= 0 && daysUntil(pred.fertileEnd) >= 0
    : false; // ตอนนี้อยู่ในช่วงเจริญพันธุ์ไหม

  // class พื้นฐานของ card ทุกตัวใน Insights
  const cardBase = "bg-white border border-[#F0CCD8] rounded-[20px] shadow-[0_4px_20px_rgba(255,40,120,0.08)]";

  return (
    <div className="fu">
      {/* Header */}
      <div className="mb-5 md:mb-8">
        <h2 className="font-serif text-[22px] md:text-[28px] font-normal text-[#1A0A10]">Insights</h2>
        <p className="font-sans text-[11px] font-light mt-1 tracking-[0.04em] text-[#C8A0B0]">Based on your cycle history</p>
      </div>

      {/* ถ้าไม่มีข้อมูล แสดง empty state */}
      {!cycles.length ? (
        <div className={`${cardBase} px-6 py-16 text-center`}>
          <div className="text-[32px] mb-3">🌸</div>
          <p className="font-serif text-[16px] mb-2 text-[#1A0A10]">No data yet</p>
          <p className="font-sans text-[13px] font-light text-[#C8A0B0]">Log your first cycle on the Home tab to see insights</p>
        </div>
      ) : (
        <>
          {/* ── 4 Stat Cards ── */}
          {/* Mobile: 2 คอลัมน์ / Desktop: 4 คอลัมน์ */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3.5 mb-4 md:mb-5">
            {[
              { label: "Cycles Logged", value: String(cycles.length), sub: "total records",       accent: "#FF2878" },
              { label: "Avg Cycle",     value: `${avg} days`,          sub: "cycle length avg",   accent: "#FF7AB5" },
              { label: "Avg Period",    value: avgDur ? `${avgDur} days` : "—", sub: "duration avg", accent: "#C4B5E8" },
              { label: "Current Phase", value: phase.name,             sub: `Day ${day} of cycle`, accent: phase.color },
            ].map(c => (
              <div key={c.label} className={`${cardBase} rounded-[18px] p-4 md:p-5`}>
                <div className="font-sans text-[7px] md:text-[8px] font-semibold tracking-[.16em] uppercase mb-1.5 md:mb-2" style={{ color: c.accent }}>
                  {c.label}
                </div>
                <div className="font-serif text-[15px] md:text-[20px] leading-none mb-1 text-[#1A0A10]">{c.value}</div>
                <div className="font-sans text-[9px] md:text-[10px] font-light text-[#C8A0B0]">{c.sub}</div>
              </div>
            ))}
          </div>

          {/* ── Upcoming + Phase Tip ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 md:gap-4 mb-3.5 md:mb-4">

            {/* Upcoming card */}
            <div className={`${cardBase} p-4 md:p-6`}>
              <div className="font-sans text-[9px] font-semibold tracking-[.18em] uppercase mb-4 text-[#FF2878]">Upcoming</div>
              {pred ? (
                <div className="flex flex-col gap-2.5 md:gap-3.5">
                  {[
                    { label: "Next Period",    days: daysLeft, date: fmtS(pred.nextPeriod), color: "#FF2878", bg: "#FFF0F6" },
                    { label: "Ovulation",      days: daysToOv, date: fmtS(pred.ovulation),  color: "#9B59B6", bg: "#F4F0FC" },
                    { label: "Fertile Window", days: null, date: `${fmtS(pred.fertileStart)} – ${fmtS(pred.fertileEnd)}`, color: "#FF7AB5", bg: "#FFF5F9" },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between px-3 py-2.5 md:px-3.5 md:py-3 rounded-xl border"
                      style={{ background: item.bg, borderColor: `${item.color}20` }}>
                      <div>
                        <div className="font-sans text-[9px] md:text-[10px] font-semibold mb-0.5" style={{ color: item.color }}>{item.label}</div>
                        <div className="font-serif text-[12px] md:text-[13px] text-[#1A0A10]">{item.date}</div>
                      </div>
                      {/* แสดงตัวเลขวัน (เฉพาะ Next Period และ Ovulation) */}
                      {item.days !== null && (
                        <div className="text-center">
                          <div className="font-serif text-[20px] md:text-[22px] leading-none" style={{ color: item.color }}>{item.days}</div>
                          <div className="font-sans text-[8px] font-light text-[#C8A0B0]">days</div>
                        </div>
                      )}
                      {/* แสดง "NOW" badge สำหรับ Fertile Window ถ้าอยู่ในช่วงนี้ */}
                      {item.days === null && inFertile && (
                        <span className="font-sans px-2.5 py-[3px] rounded-full text-[9px] font-semibold text-white" style={{ background: item.color }}>NOW</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-sans text-[13px] font-light text-[#C8A0B0]">Log one more cycle to unlock predictions</p>
              )}
            </div>

            {/* Phase Tip card (gradient ชมพู) */}
            <div className="rounded-[20px] p-4 md:p-6 flex flex-col justify-between bg-gradient-to-br from-[#FF2878] to-[#FF7AB5] shadow-[0_8px_28px_rgba(255,40,120,0.22)]">
              <div>
                <div className="font-sans text-[9px] font-semibold tracking-[.18em] uppercase mb-2.5 md:mb-3 text-white/65">Phase Tip</div>
                <div className="font-serif text-[15px] md:text-[17px] font-normal leading-relaxed text-white">{phase.tip}</div>
              </div>
              <div className="mt-4 md:mt-5 px-3 md:px-3.5 py-2 md:py-2.5 rounded-xl bg-white/15">
                <div className="font-sans text-[9px] mb-[3px] tracking-[.1em] text-white/65">CURRENT PHASE</div>
                <div className="font-serif text-[13px] md:text-[15px] text-white">{phase.name} · Day {day}</div>
              </div>
            </div>
          </div>

          {/* ── Bar Chart: Cycle Length History ── */}
          {lengths.length > 0 && (
            <div className={`${cardBase} p-4 md:p-6 mb-3.5 md:mb-4`}>
              <div className="font-sans text-[9px] font-semibold tracking-[.18em] uppercase mb-1 text-[#FF2878]">Cycle Length History</div>
              <p className="font-sans text-[11px] font-light mb-4 md:mb-5 text-[#C8A0B0]">Days between each period</p>
              <div className="flex items-end gap-1.5 md:gap-2 h-16 md:h-20">
                {lengths.map((l, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="font-sans text-[8px] md:text-[9px] font-semibold text-[#FF2878]">{l}</div>
                    {/* ความสูง bar = (l / maxLen) × 48 + 8 → normalize เพื่อให้สูงสุดไม่เกิน 56px */}
                    <div className="w-full rounded-[6px] bg-gradient-to-br from-[#FF2878] to-[#FF7AB5] shadow-[0_2px_8px_rgba(255,40,120,0.2)]"
                      style={{ height: `${Math.round((l / maxLen) * 48) + 8}px` }} />
                  </div>
                ))}
              </div>
              <div className="mt-2.5 pt-2.5 flex items-center gap-1.5 border-t border-dashed border-[#F0CCD8]">
                <div className="w-5 h-[2px] rounded-full bg-[#FFADD0]" />
                <span className="font-sans text-[10px] font-light text-[#C8A0B0]">Average: {avg} days</span>
              </div>
            </div>
          )}

          {/* ── Horizontal Bar: Period Duration ── */}
          {durations.some(d => d.dur) && (
            <div className={`${cardBase} p-4 md:p-6 mb-3.5 md:mb-4`}>
              <div className="font-sans text-[9px] font-semibold tracking-[.18em] uppercase mb-1 text-[#C4B5E8]">Period Duration</div>
              <p className="font-sans text-[11px] font-light mb-4 md:mb-5 text-[#C8A0B0]">How long each period lasted</p>
              <div className="flex flex-col gap-2 md:gap-2.5">
                {durations.filter(d => d.dur).slice(0, 6).map((d, i) => (
                  // แสดงสูงสุด 6 รายการ
                  <div key={i} className="flex items-center gap-2 md:gap-3">
                    <div className="font-sans text-[9px] md:text-[10px] font-light w-[46px] md:w-[52px] shrink-0 text-[#C8A0B0]">{d.date}</div>
                    {/* Progress bar */}
                    <div className="flex-1 h-2 md:h-2.5 rounded-full overflow-hidden bg-[#FFF0F6]">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#C4B5E8] to-[#FF7AB5]"
                        style={{ width: `${Math.round(((d.dur || 0) / maxDur) * 100)}%` }} />
                        {/* ความกว้าง = (วัน / max) × 100% */}
                    </div>
                    <div className="font-serif text-[12px] md:text-[13px] w-8 md:w-10 text-right text-[#1A0A10]">{d.dur}d</div>
                  </div>
                ))}
              </div>
              {avgDur && (
                <div className="mt-3 pt-3 flex items-center gap-1.5 border-t border-dashed border-[#F0CCD8]">
                  <div className="w-5 h-[2px] rounded-full bg-[#C4B5E8]" />
                  <span className="font-sans text-[10px] font-light text-[#C8A0B0]">Average duration: {avgDur} days</span>
                </div>
              )}
            </div>
          )}

          {/* ── Symptoms Bar Chart ── */}
          {sorted.some(c => c.moods && c.moods.length > 0) && (() => {
            // IIFE: คำนวณข้อมูลแล้ว return JSX ทันที

            const allSymptoms = sorted.flatMap(c => c.moods || []);
            // flatMap รวม moods ทุก cycle เป็น array เดียว

            const counts: { [k: string]: number } = {};
            allSymptoms.forEach(s => { counts[s] = (counts[s] || 0) + 1; });
            // นับจำนวนครั้งที่เกิดแต่ละ symptom

            const topSymptoms = Object.entries(counts)
              .sort((a, b) => b[1] - a[1]) // เรียงจากมากไปน้อย
              .slice(0, 6);                 // เอาแค่ top 6

            const maxCount = Math.max(...topSymptoms.map(s => s[1]));

            return (
              <div className={`${cardBase} p-4 md:p-6 mb-3.5 md:mb-4`}>
                <div className="font-sans text-[9px] font-semibold tracking-[.18em] uppercase mb-1 text-[#9B7EC8]">Most Common Symptoms</div>
                <p className="font-sans text-[11px] font-light mb-4 md:mb-5 text-[#C8A0B0]">Across all your cycles</p>
                <div className="flex flex-col gap-2 md:gap-2.5">
                  {topSymptoms.map(([sym, count]) => (
                    <div key={sym} className="flex items-center gap-2 md:gap-3">
                      <div className="font-sans text-[10px] md:text-[11px] font-normal w-[100px] md:w-[130px] shrink-0 text-[#1A0A10]">{sym}</div>
                      <div className="flex-1 h-2 rounded-full overflow-hidden bg-[#F4F0FC]">
                        <div className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#9B7EC8] to-[#C4B5E8]"
                          style={{ width: `${Math.round((count / maxCount) * 100)}%` }} />
                      </div>
                      <div className="font-sans text-[9px] md:text-[11px] font-light w-[44px] md:w-[60px] text-right text-[#C8A0B0]">
                        {count}/{sorted.length} {/* เช่น "3/5 cycles" */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* ── Flow Distribution (3 วงกลม) ── */}
          {sorted.some(c => c.flow) && (() => {
            const flows = sorted.map(c => c.flow).filter(Boolean) as string[];
            const flowCount = { light: 0, medium: 0, heavy: 0 };
            flows.forEach(f => { if (f in flowCount) flowCount[f as keyof typeof flowCount]++; });
            // นับแต่ละ flow type

            const total = flows.length;

            return (
              <div className={`${cardBase} p-4 md:p-6`}>
                <div className="font-sans text-[9px] font-semibold tracking-[.18em] uppercase mb-1 text-[#FF7AB5]">Flow Distribution</div>
                <p className="font-sans text-[11px] font-light mb-4 md:mb-5 text-[#C8A0B0]">How heavy your periods tend to be</p>
                <div className="flex gap-2 md:gap-3">
                  {[
                    { label: "Light",  key: "light",  color: "#FFADD0", bg: "#FFF0F6" },
                    { label: "Medium", key: "medium", color: "#FF7AB5", bg: "#FFF5FA" },
                    { label: "Heavy",  key: "heavy",  color: "#FF2878", bg: "#FFF0F6" },
                  ].map(f => {
                    const count = flowCount[f.key as keyof typeof flowCount];
                    const pct = total ? Math.round((count / total) * 100) : 0; // เปอร์เซ็นต์
                    return (
                      <div key={f.key} className="flex-1 text-center px-2 md:px-3 py-3 md:py-4 rounded-2xl border"
                        style={{ background: f.bg, borderColor: `${f.color}40` }}>
                        <div className="font-serif text-[22px] md:text-[28px] font-bold leading-none" style={{ color: f.color }}>{pct}%</div>
                        <div className="font-sans text-[9px] md:text-[10px] font-normal mt-1.5 text-[#C8A0B0]">{f.label}</div>
                        <div className="font-sans text-[8px] md:text-[9px] font-light mt-0.5 text-[#C8A0B0]">{count} cycles</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </>
      )}
    </div>
  );
}