// ════════════════════════════════════════════════════════════════
//  app/components/Sidebar.tsx  —  เมนูซ้าย (Responsive)
//  Mobile: slim 56px strip + slide-out overlay
//  Desktop: collapsible 240px ↔ 64px
// ════════════════════════════════════════════════════════════════
"use client";
import { useState } from "react";
import { Tab, Phase, SERIF, SANS } from "../../src/lib/lib";

// NAV = รายการเมนูทั้งหมด
const NAV = [
  {
    id: "home" as Tab,      // ค่าที่ส่งกลับเมื่อกด
    label: "Home",          // ชื่อที่แสดง
    icon: (a: boolean) => ( // a = active? → ถ้า active ใช้ strokeWidth 2 (หนากว่า)
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={a ? 2 : 1.6}>
        <path d="M3 10.5L10 3.5L17 10.5V17H13V13H7V17H3V10.5Z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "summary" as Tab,
    label: "Insights",
    icon: (a: boolean) => (
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={a ? 2 : 1.6}>
        <polyline points="3,14 7,9 11,12 17,6" /> {/* เส้นกราฟ */}
        <rect x="2" y="2" width="16" height="16" rx="2.5" /> {/* กรอบ */}
      </svg>
    ),
  },
];

// ── ไอคอนสำหรับปุ่มเปิด/ปิด sidebar ──────────────────────────

const HamburgerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M3 5h14M3 10h14M3 15h14" strokeLinecap="round" /> {/* เส้น 3 ขีด */}
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M4 4l12 12M16 4L4 16" strokeLinecap="round" /> {/* เครื่องหมาย X */}
  </svg>
);

// Props ที่รับจาก page.tsx
interface Props {
  tab: Tab;
  userName: string;
  phase: Phase;
  onTab: (t: Tab) => void;   // callback เมื่อกดเปลี่ยนแท็บ
  onLogout: () => void;       // callback เมื่อกด Sign Out
}

// ════════════════════════════════════════════════════════════════
export default function Sidebar({ tab, userName, onTab, onLogout }: Props) {

  const [isOpen, setIsOpen] = useState(false);
  // isOpen = state ของ mobile overlay sidebar (true = เปิดอยู่)

  const [desktopExpanded, setDesktopExpanded] = useState(true);
  // desktopExpanded = state ของ desktop sidebar
  // true = กว้าง 240px มีชื่อ / false = แคบ 64px แค่ไอคอน

  // class ของปุ่ม hamburger (ใช้ซ้ำหลายที่)
  const hamburgerBtn =
    "w-[38px] h-[38px] flex items-center justify-center rounded-xl border border-[#F0CCD8] bg-white text-[#A08090] hover:bg-[#FFF5F8] hover:text-[#FF2878] active:scale-95 transition-all shrink-0 cursor-pointer";


  // ── FullSidebarContent: เนื้อหา sidebar แบบเต็ม ─────────────
  // ใช้ใน mobile overlay และสามารถนำไปปรับใช้ใน desktop ด้วย
  const FullSidebarContent = ({ onClose }: { onClose: () => void }) => (
    <>
      {/* Header: โลโก้ + ปุ่มปิด */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-[#F0CCD8] shrink-0">
        <div className="flex items-center gap-3">
          {/* วงกลมโลโก้ hb */}
          <div className="flex items-center justify-center shrink-0 w-[38px] h-[38px] rounded-full border-[1.5px] border-[#FF2878] bg-white shadow-[0_4px_14px_rgba(255,40,120,0.14)]">
            <span style={{ fontFamily: SERIF }} className="text-[16px] italic text-[#FF2878] tracking-tighter">hb</span>
          </div>
          <div>
            <div style={{ fontFamily: SERIF }} className="text-[15px] font-bold leading-none text-[#3D2C33]">Her Bloom</div>
            <div style={{ fontFamily: SANS }} className="text-[7px] font-medium tracking-[0.22em] mt-[3px] text-[#FF2878]">CYCLE TRACKER</div>
          </div>
        </div>
        {/* ปุ่มปิด sidebar */}
        <button onClick={onClose} className={hamburgerBtn} aria-label="Close sidebar">
          <CloseIcon />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 px-3.5 py-4 flex-1">
        {NAV.map((item) => {
          const active = tab === item.id; // ตรวจสอบว่าเมนูนี้ active อยู่ไหม
          return (
            <button
              key={item.id}
              onClick={() => {
                onTab(item.id); // เปลี่ยนแท็บ
                onClose();       // ปิด mobile overlay หลังกดเมนู
              }}
              style={{ fontFamily: SANS }}
              className={`flex items-center gap-3 w-full text-left text-[13px] px-4 py-3 rounded-xl transition-all duration-200 border min-h-[44px] cursor-pointer ${
                active
                  ? "border-[#F0CCD8] bg-[#FFF5F8] text-[#FF2878] font-semibold" // style active
                  : "border-transparent text-[#7A6670] hover:bg-[#FFF5F8] font-normal" // style ปกติ
              }`}
            >
              {item.icon(active)} {/* ไอคอน (หนาขึ้นถ้า active) */}
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer: user info + sign out button */}
      <div className="flex flex-col gap-3 px-3.5 py-4 border-t border-[#F0CCD8] shrink-0">
        {/* แสดงตัวอักษรแรกของชื่อ + ชื่อผู้ใช้ */}
        <div className="flex items-center gap-2.5 px-1">
          <div
            style={{ fontFamily: SERIF }}
            className="flex items-center justify-center shrink-0 w-8 h-8 rounded-full text-[13px] font-medium text-white italic bg-gradient-to-r from-[#FF2878] to-[#FF70A6]"
          >
            {userName[0]?.toUpperCase()} {/* ตัวอักษรแรกของชื่อ เป็น avatar */}
          </div>
          <div>
            <div style={{ fontFamily: SANS }} className="text-[13px] font-medium text-[#3D2C33]">{userName}</div>
            <div style={{ fontFamily: SANS }} className="text-[9px] tracking-[0.1em] text-[#7A6670]">MY CYCLE</div>
          </div>
        </div>

        {/* ปุ่ม Sign Out */}
        <button
          onClick={() => { onLogout(); onClose(); }} // logout แล้วปิด overlay
          style={{ fontFamily: SANS }}
          className="w-full flex items-center gap-2 px-3.5 py-2.5 text-[12px] font-semibold text-white rounded-xl bg-gradient-to-r from-[#FF2878] to-[#FF70A6] shadow-[0_4px_16px_rgba(255,40,120,0.28)] hover:opacity-90 transition-all min-h-[44px] cursor-pointer"
        >
          {/* ไอคอน logout (ลูกศรออก) */}
          <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M13 15l5-5-5-5M18 10H7M10 3H4a1 1 0 00-1 1v12a1 1 0 001 1h6" />
          </svg>
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* ════════════════════════════════════════════════════
          MOBILE (ต่ำกว่า md breakpoint = < 768px)
          แสดง strip แคบ 56px ด้านซ้ายตลอดเวลา
          เมื่อกด hamburger จะ slide overlay ออกมา
          ════════════════════════════════════════════════════ */}

      {/* MOBILE: แถบแคบ 56px ติดซ้ายตลอด */}
      <aside className="md:hidden sticky top-0 self-start flex flex-col h-screen w-[56px] min-w-[56px] bg-white border-r border-[#F0CCD8] shadow-[2px_0_10px_rgba(255,40,120,0.04)] z-30">

        {/* ปุ่ม hamburger บนสุด */}
        <div className="flex justify-center py-4 border-b border-[#F0CCD8]">
          <button
            onClick={() => setIsOpen(true)} // เปิด full overlay
            className={hamburgerBtn}
            aria-label="Open sidebar"
          >
            <HamburgerIcon />
          </button>
        </div>

        {/* ไอคอนเมนู (ไม่มีชื่อ) */}
        <nav className="flex flex-col items-center gap-1 py-4 flex-1">
          {NAV.map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTab(item.id)} // เปลี่ยนแท็บโดยตรง ไม่ต้องปิด overlay
                title={item.label} // tooltip เมื่อ hover
                className={`w-[40px] h-[40px] flex items-center justify-center rounded-xl transition-all duration-200 border cursor-pointer ${
                  active ? "border-[#F0CCD8] bg-[#FFF5F8] text-[#FF2878]" : "border-transparent text-[#A08090] hover:bg-[#FFF5F8]"
                }`}
              >
                {item.icon(active)}
              </button>
            );
          })}
        </nav>

        {/* Avatar ผู้ใช้ล่างสุด */}
        <div className="flex justify-center py-4 border-t border-[#F0CCD8]">
          <div
            title={userName}
            style={{ fontFamily: SERIF }}
            className="flex items-center justify-center w-8 h-8 rounded-full text-[12px] font-medium text-white italic bg-gradient-to-r from-[#FF2878] to-[#FF70A6] cursor-default"
          >
            {userName[0]?.toUpperCase()}
          </div>
        </div>
      </aside>

      {/* MOBILE: Backdrop (พื้นหลังมืด) เมื่อ overlay เปิด */}
      <div
        onClick={() => setIsOpen(false)} // กดพื้นหลัง = ปิด overlay
        className={`md:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          // ถ้า isOpen: แสดงและรับ click / ถ้าไม่: ซ่อนและไม่รับ click
        }`}
      />

      {/* MOBILE: Full sidebar slide จากซ้าย */}
      <aside
        className={`md:hidden fixed top-0 left-0 z-50 h-full w-[260px] flex flex-col bg-white border-r border-[#F0CCD8] shadow-[4px_0_24px_rgba(255,40,120,0.12)] transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
          // เปิด: เลื่อนเข้าหน้าจอ / ปิด: เลื่อนออกซ้าย
        }`}
      >
        <FullSidebarContent onClose={() => setIsOpen(false)} />
      </aside>


      {/* ════════════════════════════════════════════════════
          DESKTOP (md+ = >= 768px)
          sidebar ติดซ้ายตลอด ยุบ/ขยายได้
          ════════════════════════════════════════════════════ */}
      <aside
        className={`hidden md:flex sticky top-0 self-start flex-col h-screen bg-white border-r border-[#F0CCD8] transition-[width] duration-300 overflow-hidden ${
          desktopExpanded ? "w-[240px] min-w-[240px]" : "w-[64px] min-w-[64px]"
          // ขยาย = 240px / ยุบ = 64px (แค่ไอคอน)
        }`}
      >
        {/* Header: โลโก้ (เมื่อขยาย) + ปุ่ม toggle */}
        <div
          className={`flex items-center shrink-0 border-b border-[#F0CCD8] transition-all duration-300 ${
            desktopExpanded ? "justify-between px-5 py-[26px]" : "justify-center px-0 py-[26px]"
          }`}
        >
          {/* แสดงโลโก้เฉพาะตอนขยาย */}
          {desktopExpanded && (
            <div className="flex items-center gap-3 flex-1 min-w-0 mr-2">
              <div className="flex items-center justify-center shrink-0 w-[38px] h-[38px] rounded-full border-[1.5px] border-[#FF2878] bg-white shadow-[0_4px_14px_rgba(255,40,120,0.14)]">
                <span style={{ fontFamily: SERIF }} className="text-[16px] italic text-[#FF2878] tracking-tighter">hb</span>
              </div>
              <div className="min-w-0">
                <div style={{ fontFamily: SERIF }} className="text-[15px] font-bold leading-none text-[#3D2C33] truncate">Her Bloom</div>
                <div style={{ fontFamily: SANS }} className="text-[7px] font-medium tracking-[0.22em] mt-1 text-[#FF2878]">CYCLE TRACKER</div>
              </div>
            </div>
          )}
          {/* ปุ่ม toggle ขยาย/ยุบ */}
          <button
            onClick={() => setDesktopExpanded(o => !o)} // toggle
            className={hamburgerBtn}
            aria-label={desktopExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {desktopExpanded ? <CloseIcon /> : <HamburgerIcon />}
          </button>
        </div>

        {/* Desktop Nav */}
        <nav className="flex flex-col gap-1 px-2 py-4 flex-1">
          {NAV.map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTab(item.id)}
                style={{ fontFamily: SANS }}
                title={!desktopExpanded ? item.label : undefined} // tooltip เฉพาะตอนยุบ
                className={`flex items-center w-full text-left text-[13px] rounded-xl transition-all duration-200 border min-h-[44px] cursor-pointer ${
                  desktopExpanded ? "gap-2.5 px-4 py-3" : "justify-center px-0 py-3"
                  // ขยาย: มีชื่อ + padding ปกติ / ยุบ: จัดกลาง ไม่มีชื่อ
                } ${
                  active ? "border-[#F0CCD8] bg-[#FFF5F8] text-[#FF2878] font-semibold"
                         : "border-transparent text-[#7A6670] hover:bg-[#FFF5F8] font-normal"
                }`}
              >
                {item.icon(active)}
                {desktopExpanded && <span className="truncate">{item.label}</span>}
                {/* แสดงชื่อเฉพาะตอน expanded */}
              </button>
            );
          })}
        </nav>

        {/* Desktop Footer */}
        <div className="flex flex-col gap-3 px-2 py-4 border-t border-[#F0CCD8] shrink-0">
          {desktopExpanded ? (
            // ── Expanded mode: แสดงชื่อ + ปุ่ม sign out เต็ม ──
            <>
              <div className="flex items-center gap-2.5 px-2">
                <div style={{ fontFamily: SERIF }} className="flex items-center justify-center shrink-0 w-8 h-8 rounded-full text-[13px] font-medium text-white italic bg-gradient-to-r from-[#FF2878] to-[#FF70A6]">
                  {userName[0]?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div style={{ fontFamily: SANS }} className="text-[13px] font-medium text-[#3D2C33] truncate">{userName}</div>
                  <div style={{ fontFamily: SANS }} className="text-[9px] tracking-[0.1em] text-[#7A6670]">MY CYCLE</div>
                </div>
              </div>
              <button onClick={onLogout} style={{ fontFamily: SANS }}
                className="w-full flex items-center gap-2 px-3.5 py-2.5 text-[12px] font-semibold text-white rounded-xl bg-gradient-to-r from-[#FF2878] to-[#FF70A6] shadow-[0_4px_16px_rgba(255,40,120,0.28)] hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer">
                <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M13 15l5-5-5-5M18 10H7M10 3H4a1 1 0 00-1 1v12a1 1 0 001 1h6" />
                </svg>
                Sign Out
              </button>
            </>
          ) : (
            // ── Collapsed mode: แค่ avatar + ไอคอน logout ──
            <>
              <div className="flex justify-center">
                <div title={userName} style={{ fontFamily: SERIF }}
                  className="flex items-center justify-center w-8 h-8 rounded-full text-[13px] font-medium text-white italic bg-gradient-to-r from-[#FF2878] to-[#FF70A6] cursor-default">
                  {userName[0]?.toUpperCase()}
                </div>
              </div>
              <button onClick={onLogout} title="Sign Out"
                className="flex justify-center items-center w-full py-2 rounded-xl text-[#FF2878] hover:bg-[#FFF5F8] transition-all min-h-[40px] cursor-pointer">
                <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M13 15l5-5-5-5M18 10H7M10 3H4a1 1 0 00-1 1v12a1 1 0 001 1h6" />
                </svg>
              </button>
            </>
          )}
        </div>
      </aside>
    </>
  );
}