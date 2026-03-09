"use client";
import { Cycle, Form, Phase, Pred, fmtS, daysUntil } from "../../src/lib/lib";
import Ring from "./Ring";
import CycleForm from "./CycleForm";
import HistoryRow from "./HistoryRow";
import CalendarStrip from "./CalendarStrip";
import { InfoCard } from "./Cards";

type Props = {
  userName: string; day: number; phase: Phase; cycles: Cycle[]; sorted: Cycle[];
  avg: number; pred: Pred | null; edit: Cycle | null;
  onSave: (f: Form, id?: string) => void; onEdit: (c: Cycle) => void;
  onDelete: (id: string) => void; onCancelEdit: () => void;
};

export default function HomeTab({ userName, day, phase, cycles, sorted, avg, pred, edit, onSave, onEdit, onDelete, onCancelEdit }: Props) {
  const ip = { className: "w-3.5 h-3.5 text-[#FF2878]", viewBox: "0 0 20 20", fill: "none", stroke: "currentColor", strokeWidth: "1.7" };
  const latest = sorted[0];

  return (
    // ===== MOBILE: add top padding to clear fixed mobile header =====
    // ===== DESKTOP: standard spacing =====
    <div className="fu space-y-6 pt-[10px] md:pt-0">

      {/* ===== MOBILE: Stack header elements vertically =====
          ===== DESKTOP: Side by side with flex-row ===== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 mb-4">
        <div>
          {/* MOBILE: slightly smaller heading; DESKTOP: full size */}
          <h2 className="font-serif text-[24px] md:text-[30px] font-normal leading-none text-[#1A0A10]">
            Hello, <em className="italic text-[#FF2878] font-normal">{userName}</em>
          </h2>
          <p className="font-sans text-[10px] font-normal mt-1.5 tracking-[0.14em] text-[#C8A0B0] uppercase">
            {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        {/* MOBILE: self-start badge; DESKTOP: centered */}
        <div className="font-sans px-4 md:px-5 py-[9px] text-[11px] font-semibold text-white tracking-[0.06em] rounded-full bg-gradient-to-br from-[#FF2878] to-[#FF7AB5] shadow-[0_4px_16px_rgba(255,40,120,0.26)] self-start md:self-center">
          {phase.name} · Day {day}
        </div>
      </div>

      {/* CalendarStrip — full width on all screens */}
      <CalendarStrip cycles={cycles} />

      {/* ===== MOBILE: Stack ring + form vertically (single column) =====
          ===== DESKTOP: Two-column grid side by side ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch mb-6">

        {/* Left column: Ring + info cards */}
        <div className="flex flex-col gap-2.5">
          <div className="flex-1 rounded-[28px] px-5 pt-[30px] pb-[22px] text-center relative overflow-hidden bg-white border border-[#F0CCD8] shadow-[0_6px_28px_rgba(255,40,120,0.07)]">
            <div className="absolute top-[-50px] left-1/2 -translate-x-1/2 w-[280px] h-[280px] rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(255,40,120,0.05)_0%,transparent_65%)]" />
            <Ring day={day} phase={phase} />
            {/* MOBILE: wrap legend items; DESKTOP: single row */}
            <div className="flex justify-center gap-3 md:gap-3.5 mt-[18px] flex-wrap relative z-10">
              {[
                { c: "bg-[#D94070]", l: "Period" },
                { c: "bg-[#F07A9E]", l: "Follicular" },
                { c: "bg-[#F5B8CC]", l: "Ovulation" },
                { c: "bg-[#C878A8]", l: "Luteal" },
              ].map(x => (
                <div key={x.l} className="font-sans flex items-center gap-1 text-[9px] font-normal text-[#C8A0B0]">
                  <div className={`w-[7px] h-[7px] rounded-full ${x.c}`} />{x.l}
                </div>
              ))}
            </div>
          </div>

          {/* ===== MOBILE: 2-column mini info cards (same as desktop) ===== */}
          <div className="grid grid-cols-2 gap-2.5">
            <InfoCard
              icon={<svg {...ip}><rect x="3" y="4" width="14" height="13" rx="2" /><path d="M3 8h14M7 2v4M13 2v4" /></svg>}
              label="Next Period" value={pred ? fmtS(pred.nextPeriod) : "—"}
              sub={pred ? `in ${Math.max(0, daysUntil(pred.nextPeriod))} days` : "Log to predict"} />
            <InfoCard
              icon={<svg {...ip}><path d="M10 2C10 2 4 6.5 4 11.5a6 6 0 0012 0C16 6.5 10 2 10 2z" /></svg>}
              label="Fertile Window" value={pred ? `${fmtS(pred.fertileStart)}–${fmtS(pred.fertileEnd)}` : "—"}
              sub="ovulation ± 5 days" />

            <div className="rounded-[18px] p-4 bg-white border border-[#F0CCD8] shadow-[0_4px_20px_rgba(255,40,120,0.08)]">
              <div className="w-[30px] h-[30px] rounded-[9px] flex items-center justify-center mb-[11px] bg-[#FFF0F6] border border-[#F0CCD8]">
                <svg {...ip}><circle cx="10" cy="7" r="3.5" /><path d="M3.5 18c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" /></svg>
              </div>
              <div className="font-sans text-[8px] font-semibold tracking-[0.16em] uppercase mb-[5px] text-[#D0A0B4]">Pregnancy</div>
              <span className="font-sans inline-block px-[11px] py-[3px] rounded-full text-[10px] font-semibold bg-[#FFF0F6] text-[#FF2878] border border-[#F0CCD8]">
                ● {phase.pregnancy}
              </span>
              <div className="font-sans text-[10px] font-light mt-1.5 text-[#C8A0B0]">current phase</div>
            </div>

            <InfoCard
              icon={<svg {...ip}><circle cx="10" cy="10" r="7" /><path d="M10 6.5v3.8l2.5 1.5" /></svg>}
              label="Last Period" value={latest ? fmtS(new Date(latest.startDate)) : "—"}
              sub={latest ? `${avg}-day avg` : "No records yet"} />
          </div>
        </div>

        {/* Right column: Cycle Form */}
        <div className="flex flex-col h-full">
          {/* MOBILE: smaller padding; DESKTOP: larger padding */}
          <div className="flex-1 rounded-[28px] px-4 py-5 md:px-6 md:py-[26px] bg-white border border-[#F0CCD8] shadow-[0_4px_20px_rgba(255,40,120,0.08)]">
            <CycleForm phase={phase} edit={edit} onSave={onSave} onCancel={onCancelEdit} />
          </div>
        </div>
      </div>

      {/* ===== History section ===== */}
      <div>
        <div className="flex items-baseline justify-between mb-3.5">
          <h3 className="font-serif text-[20px] md:text-[22px] font-bold text-[#1A0A10]">History</h3>
          <span className="font-sans text-[10px] text-[#C8A0B0]">{cycles.length} record{cycles.length !== 1 ? "s" : ""}</span>
        </div>

        {sorted.length === 0 ? (
          <div className="rounded-2xl px-6 py-12 text-center bg-white border border-[#F0CCD8] shadow-[0_4px_20px_rgba(255,40,120,0.08)]">
            <p className="font-sans text-[13px] font-light text-[#C8A0B0]">No records yet. Log your first period above.</p>
          </div>
        ) : (
          <div>
            {sorted.map(c => (
              <HistoryRow
                key={c.id} cycle={c} phase={phase}
                onEdit={c => { onEdit(c); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
