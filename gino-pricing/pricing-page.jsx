import { useState, useEffect, useRef } from "react";

// ─── EXCHANGE RATE ─────────────────────────────────────────────────────────
// 1 USD = K19.30 ZMW (March 2026, xe.com)
// All prices benchmarked to international (US/UK) creative agency market rates

const SERVICES = {
  archviz: {
    label: "Architectural Viz",
    icon: "◈",
    description: "Interior-focused photorealistic renders for designers, agencies & exhibition stands",
    usageLabel: "Render Scenes",
    usageUnit: "scenes",
    usageRange: [1, 15],
    usageStep: 1,
    plans: {
      basic: {
        name: "Starter",
        tagline: "Interior concept renders",
        color: "#A07850",
        usdRef: "$900",
        basePrice: 17500,
        usageBase: 2,
        pricePerUnit: 6000,
        deliverable: "2 interior render scenes",
        turnaround: "7–10 days",
        features: [
          "Interior spaces only",
          "Medium-LOD models (furniture library assets)",
          "2K PBR texture maps",
          "3-point artificial lighting setup",
          "Basic ambient occlusion",
          "4K render output",
          "2 revision rounds",
          "Web & print-ready exports",
        ],
      },
      pro: {
        name: "Professional",
        tagline: "High-fidelity interior + exterior",
        color: "#C9A84C",
        usdRef: "$3,200",
        basePrice: 62000,
        usageBase: 3,
        pricePerUnit: 4800,
        deliverable: "3 high-fidelity scenes",
        turnaround: "4–6 days",
        features: [
          "Interior spaces + exterior facade",
          "High-LOD models with custom key assets",
          "4K PBR textures + material detail passes",
          "HDRI sky dome for exterior lighting",
          "Ray-traced soft shadows & reflections",
          "God rays / volumetric light effects",
          "6K render output",
          "Unlimited revisions",
          "CAD / DWG file support",
        ],
      },
      enterprise: {
        name: "Cinematic",
        tagline: "Exhibition & large-format ultra quality",
        color: "#7BAFC9",
        usdRef: "$8,500",
        basePrice: 164000,
        usageBase: 5,
        pricePerUnit: 3200,
        deliverable: "5 ultra-fidelity scenes",
        turnaround: "Express 48hr available",
        features: [
          "Interior, exterior & exhibition environments",
          "Ultra-high-LOD fully custom modelled scene",
          "8K PBR textures + displacement & SSS maps",
          "Full ray-traced global illumination",
          "Atmospheric & volumetric effects",
          "Large-format print-ready (billboard scale)",
          "360° panoramic / VR-ready output",
          "Animated walkthrough option",
          "Source files on handover",
        ],
      },
    },
  },
  motion: {
    label: "Motion Design",
    icon: "◎",
    description: "2D & 3D animations that bring your brand narrative to life",
    usageLabel: "Animation Duration",
    usageUnit: "seconds",
    usageRange: [15, 120],
    usageStep: 15,
    plans: {
      basic: {
        name: "Starter",
        tagline: "2D motion graphics",
        color: "#A07850",
        usdRef: "$1,500",
        basePrice: 29000,
        usageBase: 30,
        pricePerUnit: 800,
        deliverable: "30-second 2D animation",
        turnaround: "7 days",
        features: [
          "Up to 30s of 2D motion graphics",
          "Flat / kinetic design style",
          "1080p HD export",
          "2 revision rounds",
          "Royalty-free music bed",
          "Social media format included",
        ],
      },
      pro: {
        name: "Professional",
        tagline: "3D + 2D production",
        color: "#C9A84C",
        usdRef: "$4,500",
        basePrice: 87000,
        usageBase: 60,
        pricePerUnit: 600,
        deliverable: "60-second 3D/2D production",
        turnaround: "4–5 days",
        features: [
          "Up to 60s of 3D + 2D animation",
          "Character or product animation",
          "4K cinematic export",
          "Unlimited revisions",
          "Custom sound design",
          "Cut-down social edits (3 sizes)",
          "Storyboard included",
        ],
      },
      enterprise: {
        name: "Cinematic",
        tagline: "Full film production",
        color: "#7BAFC9",
        usdRef: "$12,000",
        basePrice: 232000,
        usageBase: 120,
        pricePerUnit: 400,
        deliverable: "Full cinematic production",
        turnaround: "Express 48hr available",
        features: [
          "Unlimited animation duration",
          "Full 3D cinematic production",
          "4K + broadcast master",
          "Original score & voiceover",
          "Dedicated animator team",
          "Multi-platform delivery",
          "Full commercial licensing",
        ],
      },
    },
  },
  graphics: {
    label: "Graphics & Print",
    icon: "◇",
    description: "Brand identity, marketing collateral & print-ready design",
    usageLabel: "Design Deliverables",
    usageUnit: "assets",
    usageRange: [1, 30],
    usageStep: 1,
    plans: {
      basic: {
        name: "Starter",
        tagline: "Brand essentials",
        color: "#A07850",
        usdRef: "$1,000",
        basePrice: 19500,
        usageBase: 5,
        pricePerUnit: 2500,
        deliverable: "5 design assets",
        turnaround: "5–7 days",
        features: [
          "Up to 5 design assets",
          "Logo + basic brand guide",
          "Print-ready PDF/AI files",
          "2 revision rounds",
          "3 social media templates",
          "Colour & font specification",
        ],
      },
      pro: {
        name: "Professional",
        tagline: "Full brand identity",
        color: "#C9A84C",
        usdRef: "$3,200",
        basePrice: 62000,
        usageBase: 15,
        pricePerUnit: 1800,
        deliverable: "15-asset brand identity",
        turnaround: "3–4 days",
        features: [
          "Up to 15 design assets",
          "Complete brand identity system",
          "Business stationery suite",
          "Unlimited revisions",
          "10 social media templates",
          "Brand style guide (PDF)",
          "Billboard / large-format ready",
        ],
      },
      enterprise: {
        name: "Cinematic",
        tagline: "Full rebrand package",
        color: "#7BAFC9",
        usdRef: "$8,000",
        basePrice: 155000,
        usageBase: 30,
        pricePerUnit: 1200,
        deliverable: "Unlimited assets + rebrand",
        turnaround: "Express 24hr available",
        features: [
          "Unlimited design assets",
          "Full rebrand strategy",
          "Annual brand audit included",
          "Dedicated designer on call",
          "All source files (AI, PSD, Figma)",
          "Packaging & merchandise design",
          "Corporate brand manual",
        ],
      },
    },
  },
  photo: {
    label: "Photography & Video",
    icon: "◉",
    description: "High-quality stills & cinematic video that capture your essence",
    usageLabel: "Edited Deliverables",
    usageUnit: "files",
    usageRange: [10, 120],
    usageStep: 10,
    plans: {
      basic: {
        name: "Starter",
        tagline: "Half-day shoot",
        color: "#A07850",
        usdRef: "$900",
        basePrice: 17500,
        usageBase: 20,
        pricePerUnit: 800,
        deliverable: "20 edited hi-res photos",
        turnaround: "3 days",
        features: [
          "4-hour shoot session",
          "20 retouched hi-res photos",
          "1 location",
          "Private online gallery",
          "Commercial usage rights",
          "Web + print optimised",
        ],
      },
      pro: {
        name: "Professional",
        tagline: "Full-day production",
        color: "#C9A84C",
        usdRef: "$2,800",
        basePrice: 54000,
        usageBase: 50,
        pricePerUnit: 550,
        deliverable: "50 photos + 60s video",
        turnaround: "2 days",
        features: [
          "8-hour shoot session",
          "50 retouched hi-res photos",
          "Promo video (60s edited)",
          "Up to 3 locations",
          "Drone aerial footage",
          "Colour graded master",
          "RAW files on request",
        ],
      },
      enterprise: {
        name: "Cinematic",
        tagline: "Multi-day campaign",
        color: "#7BAFC9",
        usdRef: "$7,500",
        basePrice: 145000,
        usageBase: 100,
        pricePerUnit: 350,
        deliverable: "Unlimited + full video",
        turnaround: "Same-day preview",
        features: [
          "Multi-day shoot (up to 3 days)",
          "Unlimited edited deliverables",
          "Full video production",
          "Unlimited locations",
          "Studio lighting rig + drone",
          "Same-day preview gallery",
          "Dedicated production team",
        ],
      },
    },
  },
  web: {
    label: "Web Design & Dev",
    icon: "◫",
    description: "Custom websites that elevate your brand in the digital realm",
    usageLabel: "Website Pages",
    usageUnit: "pages",
    usageRange: [3, 25],
    usageStep: 1,
    plans: {
      basic: {
        name: "Starter",
        tagline: "Brochure website",
        color: "#A07850",
        usdRef: "$2,500",
        basePrice: 48500,
        usageBase: 5,
        pricePerUnit: 4500,
        deliverable: "5-page responsive site",
        turnaround: "2 weeks",
        features: [
          "Up to 5 custom-designed pages",
          "Mobile-first responsive design",
          "Contact form + map integration",
          "Basic SEO setup",
          "1 revision round",
          "Hosting setup guidance",
        ],
      },
      pro: {
        name: "Professional",
        tagline: "Custom CMS website",
        color: "#C9A84C",
        usdRef: "$7,000",
        basePrice: 135000,
        usageBase: 10,
        pricePerUnit: 3200,
        deliverable: "10-page CMS site",
        turnaround: "1 week",
        features: [
          "Up to 10 custom-designed pages",
          "Bespoke UI/UX design system",
          "CMS (blog / portfolio / news)",
          "Advanced SEO + analytics",
          "Unlimited revisions",
          "3-month post-launch support",
          "Performance optimisation",
        ],
      },
      enterprise: {
        name: "Cinematic",
        tagline: "Full-stack web app",
        color: "#7BAFC9",
        usdRef: "$20,000",
        basePrice: 386000,
        usageBase: 20,
        pricePerUnit: 2200,
        deliverable: "Custom web application",
        turnaround: "48hr express available",
        features: [
          "Unlimited pages",
          "Custom web application",
          "E-commerce / booking system",
          "API + payment integrations",
          "Dedicated dev team",
          "Priority 48hr support SLA",
          "Ongoing maintenance plan",
        ],
      },
    },
  },
};

// ─── UTILITIES ───────────────────────────────────────────────────────────────
function fmtK(n) {
  return "K" + Math.round(n).toLocaleString("en-ZM");
}

function useIsMobile() {
  const [v, setV] = useState(typeof window !== "undefined" ? window.innerWidth < 768 : false);
  useEffect(() => {
    const fn = () => setV(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return v;
}

function AnimatedNumber({ value }) {
  const [disp, setDisp] = useState(value);
  const ref = useRef(value);
  useEffect(() => {
    const s = ref.current, e = value, t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / 450, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisp(Math.round(s + (e - s) * ease));
      if (p < 1) requestAnimationFrame(tick);
      else ref.current = e;
    };
    requestAnimationFrame(tick);
  }, [value]);
  return <span>{Math.round(disp).toLocaleString("en-ZM")}</span>;
}

// ─── DESKTOP PLAN CARD ────────────────────────────────────────────────────────
function DesktopCard({ planKey, pd, usage, selected, onSelect, rush }) {
  const isSel = selected === planKey;
  const extra = Math.max(0, usage - pd.usageBase);
  const base = pd.basePrice + extra * pd.pricePerUnit;
  const total = rush ? Math.round(base * 1.35) : base;

  return (
    <div
      onClick={() => onSelect(planKey)}
      style={{
        flex: 1, minWidth: 0, cursor: "pointer", position: "relative",
        padding: "36px 28px",
        background: isSel ? "linear-gradient(155deg,#191410,#0d0b09)" : "linear-gradient(155deg,#111,#0a0a0a)",
        border: isSel ? `1.5px solid ${pd.color}` : "1.5px solid #1d1d1a",
        borderRadius: 6,
        transform: isSel ? "translateY(-8px)" : "translateY(0)",
        boxShadow: isSel ? `0 28px 64px rgba(0,0,0,0.6), inset 0 1px 0 ${pd.color}1a` : "0 4px 20px rgba(0,0,0,0.35)",
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {planKey === "pro" && (
        <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)", background: pd.color, color: "#000", fontFamily: "'DM Mono',monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", padding: "4px 14px", borderRadius: "0 0 6px 6px", textTransform: "uppercase", whiteSpace: "nowrap" }}>
          Best Value
        </div>
      )}

      {/* dot + name */}
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: isSel ? pd.color : "#252520", boxShadow: isSel ? `0 0 14px ${pd.color}99` : "none", marginBottom: 18, transition: "all 0.3s" }} />
      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 600, color: isSel ? "#fff" : "#666", letterSpacing: "-0.02em", marginBottom: 3, transition: "color 0.3s" }}>{pd.name}</div>
      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: isSel ? pd.color : "#303028", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6, transition: "color 0.3s" }}>{pd.tagline}</div>

      {/* USD ref */}
      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "#2e2e28", letterSpacing: "0.06em", marginBottom: 22, borderBottom: "1px solid #181814", paddingBottom: 18 }}>
        Intl. equiv. <span style={{ color: isSel ? "#4a4a40" : "#282824" }}>{pd.usdRef}</span>
      </div>

      {/* price */}
      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 46, fontWeight: 700, color: isSel ? "#fff" : "#3e3e3a", letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 4, transition: "color 0.3s" }}>
        <span style={{ fontSize: 18, fontWeight: 400, verticalAlign: "super" }}>K</span>
        <AnimatedNumber value={total} />
      </div>
      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "#2e2e28", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: extra > 0 ? 4 : 6 }}>
        per project {rush && <span style={{ color: "#E8854A" }}>· rush +35%</span>}
      </div>

      {extra > 0 && (
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "#383830", letterSpacing: "0.04em", marginBottom: 6 }}>
          Base K{pd.basePrice.toLocaleString()} + {extra} extra × K{pd.pricePerUnit.toLocaleString()}
        </div>
      )}

      {/* turnaround */}
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 24 }}>
        <div style={{ width: 4, height: 4, borderRadius: "50%", background: isSel ? pd.color : "#282824", transition: "background 0.3s" }} />
        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: isSel ? "#666" : "#282824", letterSpacing: "0.06em", textTransform: "uppercase", transition: "color 0.3s" }}>
          {pd.turnaround}
        </span>
      </div>

      {/* features */}
      <div style={{ marginBottom: 28 }}>
        {pd.features.map((f, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 9 }}>
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: isSel ? pd.color : "#252520", flexShrink: 0, marginTop: 5, transition: "background 0.3s" }} />
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: isSel ? "#888" : "#333", letterSpacing: "0.04em", lineHeight: 1.6, transition: "color 0.3s" }}>{f}</span>
          </div>
        ))}
      </div>

      <button style={{ width: "100%", padding: "13px 0", background: isSel ? pd.color : "transparent", color: isSel ? "#000" : "#2e2e28", border: isSel ? `1.5px solid ${pd.color}` : "1.5px solid #1e1e1a", borderRadius: 3, fontFamily: "'DM Mono',monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.3s" }}>
        {isSel ? "Request Quote →" : "Select"}
      </button>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function GinoPricing() {
  const isMobile = useIsMobile();
  const [service, setService] = useState("archviz");
  const [plan, setPlan] = useState("pro");
  const [rush, setRush] = useState(false);
  const [featOpen, setFeatOpen] = useState(false);
  const [usage, setUsage] = useState(() =>
    Object.fromEntries(Object.keys(SERVICES).map((s) => [s, SERVICES[s].usageRange[0]]))
  );

  const svc = SERVICES[service];
  const pd = svc.plans[plan];
  const u = usage[service];
  const extra = Math.max(0, u - pd.usageBase);
  const base = pd.basePrice + extra * pd.pricePerUnit;
  const total = rush ? Math.round(base * 1.35) : base;
  const sliderPct = ((u - svc.usageRange[0]) / (svc.usageRange[1] - svc.usageRange[0])) * 100;

  const handleService = (s) => { setService(s); setPlan("pro"); setFeatOpen(false); };

  return (
    <div style={{ minHeight: "100vh", background: "#070705", color: "#fff", fontFamily: "'DM Mono',monospace", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,600&family=DM+Mono:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        input[type=range]{-webkit-appearance:none;width:100%;height:2px;border-radius:1px;outline:none;cursor:pointer;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;cursor:pointer;transition:transform 0.15s;}
        input[type=range]::-webkit-slider-thumb:active{transform:scale(1.3);}
      `}</style>
      <style>{`
        .gs-slider{background:linear-gradient(to right,${pd.color} 0%,${pd.color} ${sliderPct}%,#1e1e1a ${sliderPct}%,#1e1e1a 100%);}
        .gs-slider::-webkit-slider-thumb{background:${pd.color};box-shadow:0 0 12px ${pd.color}88;}
      `}</style>

      <div style={{ maxWidth: 1120, margin: "0 auto", padding: isMobile ? "44px 0 130px" : "72px 24px 80px" }}>

        {/* HEADER */}
        <div style={{ textAlign: "center", padding: isMobile ? "0 20px" : 0, marginBottom: isMobile ? 36 : 56 }}>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.35em", color: "#302e26", textTransform: "uppercase", marginBottom: 14 }}>
            ◆ Gino Studios Zambia · Per Project Pricing
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? "clamp(40px,11vw,56px)" : "clamp(52px,7vw,82px)", fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 0.9, color: "#fff", marginBottom: 18 }}>
            You create the narrative.<br />
            <em style={{ color: "#C9A84C", fontStyle: "italic" }}>We price it simply.</em>
          </h1>
          <p style={{ fontFamily: "'DM Mono',monospace", fontSize: isMobile ? 10 : 11, color: "#3e3e36", letterSpacing: "0.08em", maxWidth: 400, margin: "0 auto", lineHeight: 1.9 }}>
            International market benchmarks. One price per project scope — no subscriptions, no surprises. All amounts in Zambian Kwacha.
          </p>
          <div style={{ marginTop: 14, fontFamily: "'DM Mono',monospace", fontSize: 9, color: "#28281e", letterSpacing: "0.06em" }}>
            Rate ref: 1 USD ≈ K19.30 · March 2026
          </div>
        </div>

        {/* SERVICE SELECTOR */}
        <div style={{ padding: isMobile ? "0 16px" : 0, marginBottom: isMobile ? 24 : 36 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.25em", color: "#252520", textTransform: "uppercase", marginBottom: 10 }}>01 · Choose Service</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {Object.entries(SERVICES).map(([key, s]) => {
              const active = service === key;
              return (
                <button key={key} onClick={() => handleService(key)} style={{
                  flex: isMobile ? "1 1 calc(50% - 4px)" : "none",
                  padding: isMobile ? "13px 8px" : "11px 18px",
                  background: active ? "#13120e" : "transparent",
                  border: active ? `1px solid ${SERVICES[key].plans.pro.color}` : "1px solid #1a1a17",
                  borderRadius: 4, color: active ? "#fff" : "#383830",
                  fontFamily: "'DM Mono',monospace", fontSize: 9,
                  letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer",
                  transition: "all 0.25s", display: "flex", alignItems: "center",
                  justifyContent: isMobile ? "center" : "flex-start", gap: 8,
                }}>
                  <span style={{ color: active ? SERVICES[key].plans.pro.color : "#2a2a24", fontSize: 13 }}>{s.icon}</span>
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* SCOPE SLIDER */}
        <div style={{ padding: isMobile ? "0 16px" : 0, marginBottom: isMobile ? 20 : 28 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.25em", color: "#252520", textTransform: "uppercase", marginBottom: 10 }}>02 · Define Scope</div>
          <div style={{ background: "#0c0c0a", border: "1px solid #181814", borderRadius: 6, padding: "22px 22px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 }}>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 16 : 19, color: "#555" }}>{svc.usageLabel}</div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "#28281e", marginTop: 3, letterSpacing: "0.06em" }}>{svc.description}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 36 : 46, fontWeight: 700, color: pd.color, lineHeight: 1 }}>{u}</span>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 8, color: "#2e2e28", textTransform: "uppercase", marginTop: 3 }}>
                  {u > pd.usageBase ? `+${extra} beyond base` : "within base"}
                </div>
              </div>
            </div>
            <input type="range" className="gs-slider" min={svc.usageRange[0]} max={svc.usageRange[1]} step={svc.usageStep} value={u} onChange={(e) => setUsage(p => ({ ...p, [service]: +e.target.value }))} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
              <span style={{ fontSize: 8, color: "#1e1e1a" }}>{svc.usageRange[0]} {svc.usageUnit}</span>
              <span style={{ fontSize: 8, color: "#1e1e1a" }}>{svc.usageRange[1]} {svc.usageUnit}</span>
            </div>
          </div>
        </div>

        {/* RUSH TOGGLE */}
        <div style={{ padding: isMobile ? "0 16px" : 0, marginBottom: isMobile ? 24 : 32 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.25em", color: "#252520", textTransform: "uppercase", marginBottom: 10 }}>03 · Delivery Speed</div>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { key: false, label: "Standard", sub: "Normal turnaround" },
              { key: true, label: "Rush", sub: "+35% · Priority delivery" },
            ].map((opt) => (
              <button key={String(opt.key)} onClick={() => setRush(opt.key)} style={{
                flex: 1, padding: isMobile ? "14px 12px" : "14px 20px",
                background: rush === opt.key ? (opt.key ? "#1a1008" : "#13120e") : "transparent",
                border: rush === opt.key ? `1.5px solid ${opt.key ? "#E8854A" : pd.color}` : "1.5px solid #1a1a17",
                borderRadius: 4, cursor: "pointer", transition: "all 0.25s",
                textAlign: "left",
              }}>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, fontWeight: 700, color: rush === opt.key ? (opt.key ? "#E8854A" : pd.color) : "#333", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3 }}>{opt.label}</div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "#2a2a24", letterSpacing: "0.05em" }}>{opt.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* PLAN CARDS */}
        <div style={{ padding: isMobile ? "0 16px" : 0, marginBottom: isMobile ? 20 : 32 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.25em", color: "#252520", textTransform: "uppercase", marginBottom: 10 }}>04 · Select Package</div>

          {isMobile ? (
            <>
              {/* Mobile pill selector */}
              <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
                {Object.entries(svc.plans).map(([pk, p]) => (
                  <button key={pk} onClick={() => setPlan(pk)} style={{
                    flex: 1, padding: "13px 4px",
                    background: plan === pk ? p.color : "#0f0f0c",
                    border: plan === pk ? `1px solid ${p.color}` : "1px solid #1a1a17",
                    borderRadius: 4, color: plan === pk ? "#000" : "#383830",
                    fontFamily: "'DM Mono',monospace", fontSize: 9, fontWeight: 700,
                    letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.25s",
                  }}>
                    {p.name}
                  </button>
                ))}
              </div>

              {/* Mobile plan card */}
              <div style={{ background: "linear-gradient(155deg,#161210,#0d0b09)", border: `1.5px solid ${pd.color}`, borderRadius: 8, padding: "24px 20px", boxShadow: `0 16px 48px rgba(0,0,0,0.5), inset 0 1px 0 ${pd.color}14` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: pd.color, boxShadow: `0 0 10px ${pd.color}88`, marginBottom: 10 }} />
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 600, color: "#fff", letterSpacing: "-0.02em" }}>{pd.name}</div>
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: pd.color, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 2 }}>{pd.tagline}</div>
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 8, color: "#282820", marginTop: 4 }}>Intl. equiv. {pd.usdRef}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 44, fontWeight: 700, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1 }}>
                      <span style={{ fontSize: 16, fontWeight: 400, verticalAlign: "super" }}>K</span>
                      <AnimatedNumber value={total} />
                    </div>
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 8, color: "#383830", textTransform: "uppercase", marginTop: 4 }}>per project</div>
                    {rush && <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 8, color: "#E8854A", marginTop: 2 }}>Rush +35%</div>}
                  </div>
                </div>

                {extra > 0 && (
                  <div style={{ background: "#0a0a08", border: "1px solid #1c1c18", borderRadius: 4, padding: "7px 12px", fontFamily: "'DM Mono',monospace", fontSize: 9, color: "#383830", marginBottom: 14 }}>
                    Base K{pd.basePrice.toLocaleString()} + {extra} extra × K{pd.pricePerUnit.toLocaleString()}
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: 7, paddingBottom: 14, borderBottom: "1px solid #181814", marginBottom: 14 }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: pd.color }} />
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "#555", letterSpacing: "0.06em", textTransform: "uppercase" }}>{pd.turnaround}</span>
                </div>

                <button onClick={() => setFeatOpen(v => !v)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "transparent", border: "none", padding: "10px 0", color: "#444", fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer" }}>
                  <span>What's included ({pd.features.length})</span>
                  <span style={{ fontSize: 18, color: pd.color, display: "inline-block", transform: featOpen ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
                </button>
                {featOpen && (
                  <div style={{ paddingTop: 12 }}>
                    {pd.features.map((f, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
                        <div style={{ width: 4, height: 4, borderRadius: "50%", background: pd.color, flexShrink: 0, marginTop: 5 }} />
                        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "#666", letterSpacing: "0.04em", lineHeight: 1.6 }}>{f}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: "flex", gap: 14 }}>
              {Object.entries(svc.plans).map(([pk, p]) => (
                <DesktopCard key={pk} planKey={pk} pd={p} usage={u} selected={plan} onSelect={setPlan} rush={rush} />
              ))}
            </div>
          )}
        </div>

        {/* SUMMARY */}
        {isMobile ? (
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(7,7,5,0.95)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderTop: `1px solid ${pd.color}44`, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 30 }}>
            <div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 7, color: "#282820", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 3 }}>
                {svc.label} · {pd.name} · {u} {svc.usageUnit}{rush ? " · Rush" : ""}
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 30, fontWeight: 700, color: "#fff", lineHeight: 1 }}>
                <span style={{ fontSize: 13, verticalAlign: "super", fontFamily: "'DM Mono',monospace", fontWeight: 400 }}>K</span>
                <AnimatedNumber value={total} />
              </div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 7, color: "#2e2e28", marginTop: 2, letterSpacing: "0.06em" }}>
                Per project · {pd.usdRef} intl. ref
              </div>
            </div>
            <button style={{ padding: "14px 20px", background: pd.color, color: "#000", border: "none", borderRadius: 4, fontFamily: "'DM Mono',monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer" }}>
              Request Quote →
            </button>
          </div>
        ) : (
          <div style={{ background: "linear-gradient(135deg,#0e0d0b,#111)", border: `1px solid ${pd.color}22`, borderRadius: 6, padding: "28px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24, marginTop: 8 }}>
            <div>
              <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "#252520", textTransform: "uppercase", marginBottom: 8 }}>Project Estimate</div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, color: "#555" }}>
                <span style={{ color: pd.color }}>{svc.label}</span>
                {" · "}<span style={{ color: "#777" }}>{pd.name}</span>
                {" · "}{u} {svc.usageUnit}
                {rush && <span style={{ color: "#E8854A" }}> · Rush delivery</span>}
              </div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "#282820", marginTop: 5, letterSpacing: "0.06em" }}>
                International equivalent: {pd.usdRef} USD · {pd.deliverable}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
              <div>
                <div style={{ fontSize: 8, letterSpacing: "0.15em", color: "#202018", textTransform: "uppercase", marginBottom: 4 }}>Project Total</div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 40, fontWeight: 700, color: "#fff", lineHeight: 1 }}>
                  <span style={{ fontSize: 16, fontWeight: 400, verticalAlign: "super" }}>K</span>
                  <AnimatedNumber value={total} />
                </div>
              </div>
              <button style={{ padding: "15px 36px", background: pd.color, color: "#000", border: "none", borderRadius: 3, fontFamily: "'DM Mono',monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>
                Request a Quote →
              </button>
            </div>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 32, padding: isMobile ? "0 20px" : 0 }}>
          <p style={{ fontSize: 9, color: "#1c1c18", letterSpacing: "0.1em" }}>
            All estimates are indicative · Final pricing confirmed after project brief · © 2024 Gino Studios Zambia
          </p>
        </div>
      </div>
    </div>
  );
}
