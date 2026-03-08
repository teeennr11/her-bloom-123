//  app/components/Cards.tsx  —  Card components ขนาดเล็ก
"use client";

// InfoCard: card แสดงข้อมูลพร้อมไอคอน (ใช้ใน HomeTab)
export function InfoCard({
  icon, label, value, sub
}: {
  icon: React.ReactNode;  // SVG ไอคอน
  label: string;           // ชื่อหัวข้อ (ตัวเล็ก)
  value: string;           // ค่าหลัก (ตัวใหญ่)
  sub?: string;            // ข้อความเสริม (ตัวเล็กมาก, optional)
}) {
  return (
    <div className="flex flex-col rounded-[18px] p-4 bg-white border border-[#F0CCD8] shadow-[0_4px_20px_rgba(255,40,120,0.08)]">
      {/* กล่องไอคอน */}
      <div className="w-[30px] h-[30px] rounded-[9px] flex items-center justify-center mb-[11px] bg-[#FFF0F6] border border-[#F0CCD8]">
        {icon}
      </div>
      {/* Label: ตัวพิมพ์เล็กทั้งหมด tracking กว้าง */}
      <div className="font-sans text-[8px] font-semibold tracking-[0.16em] uppercase mb-[5px] text-[#D0A0B4]">
        {label}
      </div>
      {/* Value: ตัวใหญ่ serif */}
      <div className="font-serif text-[20px] font-bold leading-[1.1] flex-1 text-[#1A0A10]">
        {value}
      </div>
      {/* Sub: ข้อความเล็กเสริม */}
      {sub && <div className="font-sans text-[10px] font-light mt-[3px] text-[#C8A0B0]">{sub}</div>}
    </div>
  );
}

// InsightCard: card สำหรับ Insights tab (ไม่มีไอคอน, มี accent color)
export function InsightCard({
  label, value, sub, accent
}: {
  label: string;
  value: string;
  sub?: string;
  accent: string; // สีที่ใช้กับ label
}) {
  return (
    <div className="rounded-[18px] px-6 py-[22px] bg-white border border-[#F0CCD8] shadow-[0_4px_20px_rgba(255,40,120,0.08)]">
      <p className="font-sans text-[9px] font-semibold tracking-[0.14em] uppercase mb-[10px]" style={{ color: accent }}>
        {label}
      </p>
      <p className="font-serif text-[20px] font-bold text-[#1A0A10]">{value}</p>
      {sub && <p className="font-sans text-[11px] font-light mt-[5px] text-[#C8A0B0]">{sub}</p>}
    </div>
  );
}