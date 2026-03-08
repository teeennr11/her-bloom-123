//  app/components/Landing.tsx  —  หน้าแรก (ก่อน Login)
"use client";

export default function Landing({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="min-h-screen relative overflow-x-hidden font-sans bg-[#FDF5F8] text-[#1A0A10]">

      {/* ── Navbar: ติดด้านบน fixed ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-16 py-3.5 md:py-5 border-b border-[#F0CCD8] bg-[#FDF5F8]/90 backdrop-blur-[14px]">
        {/* โลโก้ */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex items-center justify-center rounded-full shrink-0 w-[34px] h-[34px] md:w-[38px] md:h-[38px] bg-white border-[1.5px] border-[#FF2878] shadow-[0_4px_12px_rgba(255,40,120,0.14)]">
            <span className="font-serif italic text-[14px] md:text-[16px] text-[#FF2878]">hb</span>
          </div>
          <span className="font-serif text-[15px] md:text-[17px] font-bold text-[#1A0A10]">Her Bloom</span>
        </div>

        {/* ปุ่ม Nav */}
        <div className="flex items-center gap-2 md:gap-2.5">
          {/* Sign In: ซ่อนบน mobile เล็ก */}
          <button className="hidden sm:block px-4 md:px-5 py-2 text-[12px] md:text-[13px] font-medium rounded-full cursor-pointer transition-all duration-150 border-[1.5px] border-[#FF2878] bg-white font-sans text-[#FF2878]"
            onClick={onLogin}>
            Sign In
          </button>
          {/* Get Started: แสดงทุก size */}
          <button className="px-4 md:px-5 py-2 text-[12px] md:text-[13px] font-semibold text-white rounded-full cursor-pointer bg-gradient-to-br from-[#FF2878] to-[#FF7AB5] shadow-[0_4px_18px_rgba(255,40,120,0.3)] hover:opacity-90 hover:-translate-y-px min-h-[36px]"
            onClick={onLogin}>
            Get Started
          </button>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center relative overflow-hidden px-5 md:px-8 pt-24 md:pt-28 pb-16 md:pb-20">
        {/* Background gradients ตกแต่ง */}
        <div className="absolute rounded-full pointer-events-none -top-[140px] -left-[100px] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-[radial-gradient(circle,rgba(255,122,181,0.35)_0%,transparent_68%)]"/>
        <div className="absolute rounded-full pointer-events-none -bottom-[120px] -right-[80px] w-[320px] md:w-[500px] h-[320px] md:h-[500px] bg-[radial-gradient(circle,rgba(255,40,120,0.22)_0%,transparent_68%)]"/>

        {/* Badge pill */}
        <div className="fu fu1 relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 md:mb-8 text-[10px] md:text-[11px] font-medium border border-[#F0CCD8] text-[#FF2878] tracking-[.04em] shadow-[0_4px_20px_rgba(255,40,120,0.1)] bg-white/80 backdrop-blur-[10px]">
          <div className="rounded-full w-1.5 h-1.5 bg-[#FF2878] animate-[pulseGlow_2s_infinite]"/>
          {/* จุดกระพริบ + ข้อความ tagline */}
          Track · Understand · Bloom
        </div>

        {/* Hero heading */}
        <h1 className="fu fu1 relative z-10 text-[42px] sm:text-[54px] md:text-[68px] font-normal leading-[1.07] tracking-tight mb-4 md:mb-5 max-w-2xl font-serif text-[#1A0A10]">
          Know your body,<br/>every <em className="italic text-[#FF2878]">cycle.</em>
        </h1>

        {/* Hero subtitle */}
        <p className="fu fu2 relative z-10 text-[13px] md:text-[15px] font-light leading-relaxed text-center mb-8 md:mb-10 max-w-sm md:max-w-md text-[#A08090] px-2 md:px-0">
          Log your period every day, understand your own pattern,<br className="hidden md:block"/>
          and get predictions that get smarter every cycle.
        </p>

        {/* CTA Buttons */}
        <div className="fu fu2 relative z-10 flex items-center gap-2.5 md:gap-3 justify-center flex-wrap">
          <button className="px-8 md:px-10 py-3.5 md:py-4 text-[13px] md:text-[14px] font-semibold text-white rounded-full bg-gradient-to-br from-[#FF2878] to-[#FF7AB5] shadow-[0_8px_28px_rgba(255,40,120,0.32)] hover:opacity-90 hover:-translate-y-px min-h-[44px]"
            onClick={onLogin}>
            Get Started
          </button>
          <button className="px-6 md:px-8 py-3.5 md:py-4 text-[13px] md:text-[14px] font-medium rounded-full text-[#FF2878] border-[1.5px] border-[#F0CCD8] bg-white/80 backdrop-blur-[10px] hover:border-[#FF2878] min-h-[44px]"
            onClick={onLogin}>
            Learn More
          </button>
        </div>
      </section>

      {/* เส้นคั่น horizontal */}
      <div className="w-full h-px bg-[linear-gradient(90deg,transparent,#F0CCD8,transparent)]"/>

      {/* ── Features Section ── */}
      <section className="py-16 md:py-24 px-4 sm:px-8 md:px-16 bg-white">
        <div className="text-center mb-10 md:mb-14">
          <p className="font-sans text-[9px] font-semibold tracking-[0.24em] uppercase mb-3 text-[#FF2878]">Features</p>
          <h2 className="font-serif text-[28px] md:text-[38px] font-normal leading-snug text-[#1A0A10]">
            Everything you need, in<em className="italic text-[#FF2878]"> Her Bloom</em>
          </h2>
        </div>

        {/* Grid: Mobile 1col → Tablet 2col → Desktop 3col */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-[#F0CCD8]">
          {/* gap-[1px] + bg = ทำให้เห็น border เป็นเส้นระหว่าง card */}
          {[
            { n: "01", title: "Daily Logging",    desc: "Log your period with start date, end date, flow intensity, and symptoms. Simple, fast, and accurate every time." },
            { n: "02", title: "Smart Prediction", desc: "Predicts your next period, fertile window, and ovulation from your own pattern. Gets more accurate every cycle." },
            { n: "03", title: "Mood & Symptoms",  desc: "Track mood, symptoms, and flow intensity daily. Understand yourself more deeply with every cycle." },
            { n: "04", title: "Cycle History",    desc: "View past cycles with visual bars. See daily flow and shifting patterns over time." },
            { n: "05", title: "Cloud Sync",       desc: "Data syncs in real time via Firebase. Access your cycle from any device, anywhere, anytime." },
            { n: "06", title: "Private & Secure", desc: "Your data belongs to you alone. Never shared, always protected with Firebase Auth." },
          ].map(f => (
            <div key={f.n} className="p-6 md:p-9 transition-colors duration-150 bg-white hover:bg-[#FFFAF8]">
              <p className="font-serif text-[12px] mb-4 tracking-[0.04em] text-[#FFADD0]">{f.n}</p>
              <p className="font-serif text-[16px] md:text-[19px] mb-2.5 text-[#1A0A10]">{f.title}</p>
              <p className="font-sans text-[12px] md:text-[13px] font-light leading-loose text-[#A08090]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Section (dark background) ── */}
      <section className="relative overflow-hidden flex flex-col items-center justify-center text-center min-h-screen bg-[#1A0A10] px-6 md:px-8">
        <div className="absolute rounded-full pointer-events-none -top-[100px] -right-[100px] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(255,40,120,0.2)_0%,transparent_65%)]"/>
        <div className="absolute rounded-full pointer-events-none -bottom-[80px] -left-[80px] w-[320px] h-[320px] bg-[radial-gradient(circle,rgba(255,122,181,0.12)_0%,transparent_65%)]"/>
        <h2 className="relative z-10 font-serif text-[36px] sm:text-[44px] md:text-[50px] font-normal leading-tight mb-4 text-white">
          Ready to<br/><em className="italic text-[#FF7AB5]">Bloom?</em>
        </h2>
        <p className="relative z-10 font-sans text-[13px] md:text-[14px] font-light mb-8 md:mb-10 text-white/40">
          Start logging your first cycle today. Free, no ads.
        </p>
        <div className="relative z-10 flex items-center gap-2.5 md:gap-3 justify-center flex-wrap">
          <button onClick={onLogin} className="font-sans px-7 md:px-9 py-3.5 md:py-4 text-[13px] md:text-[14px] font-medium text-white rounded-full border-[1.5px] border-white/30 bg-white/10 hover:opacity-90 hover:-translate-y-px min-h-[44px]">
            Sign In
          </button>
          <button onClick={onLogin} className="font-sans px-8 md:px-10 py-3.5 md:py-4 text-[13px] md:text-[14px] font-semibold text-white rounded-full bg-gradient-to-br from-[#FF2878] to-[#FF7AB5] shadow-[0_8px_32px_rgba(255,40,120,0.4)] hover:opacity-90 hover:-translate-y-px min-h-[44px]">
            Get Started →
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-2 px-6 md:px-16 py-6 md:py-8 bg-[#1A0A10] border-t border-white/5">
        <span className="font-serif text-[14px] md:text-[15px] text-white/35">
          Her <em className="italic text-[#FF7AB5]/60">Bloom</em>
        </span>
        <span className="font-sans text-[10px] md:text-[11px] text-white/20">© 2026 Her Bloom · Cycle Tracker</span>
      </footer>
    </div>
  );
}