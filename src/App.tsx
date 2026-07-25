import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowRight,
  ChevronRight,
  Menu,
  X,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Star,
  Check,
  Sparkles,
  Crown,
  Award,
  TrendingUp, 
  ArrowUpRight,
  Plus,
  Minus,
  Coffee,
  PhoneCall,
  Eye,
} from "lucide-react";
import { Reveal } from "./components/Reveal";
import { BrandModal } from "./components/BrandModal";
import { LegalModal } from "./components/LegalModal";
import { UpcomingLaunches } from "./components/UpcomingLaunches";
import { AdminPortal } from "./components/AdminPortal";
import { DATABASE_MODE, type SaveResult } from "./lib/database";
import {
  BRANDS,
  FEATURES,
  BENEFITS,
  TESTIMONIALS,
  PLANS,
  FAQS,
  TRUST_LOGOS,
  STATS,
  CITIES,
  CONTACT_PHONE,
  CONTACT_EMAIL,
  LOCATION,
  SOCIAL_LINKS,
  waLink,
  type BrandData,
} from "./data";

// Inline SVG social icons
const Instagram = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const Facebook = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const Linkedin = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
const WhatsApp = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M19.05 4.94A9.9 9.9 0 0 0 12.04 2C6.52 2 2 6.5 2 12.02c0 1.76.46 3.47 1.34 4.98L2 22l5.15-1.32a9.93 9.93 0 0 0 4.89 1.24h.01c5.52 0 10.04-4.5 10.04-10.02a9.93 9.93 0 0 0-3.04-7.01Zm-7.01 15.38h-.01a8.26 8.26 0 0 1-4.21-1.15l-.3-.18-3.06.78.82-2.98-.2-.31a8.23 8.23 0 0 1-1.26-4.35c0-4.58 3.74-8.31 8.33-8.31 2.22 0 4.31.87 5.88 2.44a8.22 8.22 0 0 1 2.44 5.87c0 4.59-3.74 8.19-8.43 8.19Zm4.57-6.22c-.25-.13-1.48-.73-1.7-.8-.23-.09-.4-.13-.57.13-.17.25-.66.8-.81.97-.15.17-.3.19-.55.06-.25-.13-1.05-.39-2-.99-.74-.47-1.24-1.05-1.38-1.3-.15-.25-.02-.39.11-.52.11-.11.25-.3.38-.45.13-.15.17-.25.26-.42.09-.17.05-.31-.02-.44-.07-.13-.57-1.37-.78-1.87-.2-.48-.4-.42-.56-.42h-.47c-.16 0-.42.06-.64.31-.22.25-.84.82-.84 2.01s.87 2.34 1 2.5c.13.17 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.18 1.1.16 1.52.1.46-.07 1.48-.61 1.69-1.21.21-.6.21-1.11.15-1.21-.06-.1-.23-.16-.48-.29Z" />
  </svg>
);

/* ---------- NAV ---------- */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const links = [
    { href: "#brands", label: "Brands" },
    { href: "#features", label: "Why FCK" },
    { href: "#showcase", label: "Menu" },
    { href: "#upcoming", label: "Upcoming" },
    { href: "#testimonials", label: "Stories" },
    { href: "#pricing", label: "Franchise" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-xl bg-cream-50/90 border-b border-maroon-900/15 shadow-[0_10px_40px_-20px_rgba(91,20,20,0.3)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8 sm:py-4">
        <a href="#top" className="flex items-center gap-2.5 group">
          <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700 text-white shadow-lg shadow-orange-500/30 transition-transform group-hover:scale-105">
            <Crown size={18} className="drop-shadow" />
            <span className="pointer-events-none absolute -inset-0.5 rounded-xl ring-1 ring-white/40" />
          </span>
          <div className="leading-tight">
            <div className="font-display text-[15px] font-bold tracking-tight text-maroon-950 sm:text-base">
              Family Cafe King
            </div>
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-900">
              350+ Outlets Nationwide
            </div>
          </div>
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-3.5 py-2 text-[14px] font-bold text-maroon-950 transition hover:bg-maroon-900/10 hover:text-maroon-900"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 lg:flex">
          <a
            href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`}
            className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13.5px] font-bold text-maroon-950 transition hover:bg-maroon-900/10"
          >
            <PhoneCall size={14} className="text-orange-700" /> {CONTACT_PHONE}
          </a>
          <a
            href="#lead"
            className="group relative overflow-hidden rounded-full bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700 px-5 py-2.5 text-[13.5px] font-bold text-white shadow-lg shadow-orange-500/30 transition hover:shadow-orange-500/50"
          >
            <span className="relative z-10 inline-flex items-center gap-1.5">
              Get Franchise <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </a>
        </div>

        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-maroon-900/20 bg-white/80 backdrop-blur lg:hidden text-maroon-950"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-[max-height] duration-500 ease-out ${
          open ? "max-h-[80vh]" : "max-h-0"
        }`}
      >
        <div className="mx-4 mb-4 rounded-2xl border border-maroon-900/15 bg-cream-50/98 p-3 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-[15px] font-bold text-maroon-950 hover:bg-maroon-900/10"
              >
                {l.label}
                <ChevronRight size={16} className="text-maroon-800" />
              </a>
            ))}
            <a
              href="#lead"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/30"
            >
              Get Franchise <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ---------- HERO ---------- */
function Hero({ onOpenBrand }: { onOpenBrand: (brand: BrandData) => void }) {
  const words = useMemo(() => BRANDS.map((b) => b.name), []);
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % words.length), 2800);
    return () => clearInterval(id);
  }, [words.length]);

  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28 lg:pt-40">
      {/* Ambient background */}
      <div className="radial-warm absolute inset-0 -z-10" />
      <div className="absolute inset-0 -z-10 opacity-70 bg-grain" />
      <div className="pointer-events-none absolute -left-24 top-24 -z-10 h-96 w-96 rounded-full bg-gradient-to-br from-amber-400/40 to-orange-600/30 blur-3xl animate-blob" />
      <div className="pointer-events-none absolute -right-24 top-40 -z-10 h-[26rem] w-[26rem] rounded-full bg-gradient-to-br from-rose-500/30 to-maroon-700/30 blur-3xl animate-blob" style={{ animationDelay: "3s" }} />

      {/* Decorative toran garland */}
      <svg
        className="pointer-events-none absolute inset-x-0 top-16 -z-10 h-10 w-full opacity-60"
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
      >
        <path d="M0 4 Q 600 44 1200 4" stroke="#d97314" strokeWidth="1.5" fill="none" />
        {Array.from({ length: 30 }).map((_, k) => {
          const t = k / 29;
          const x = t * 1200;
          const y = 4 + Math.sin(t * Math.PI) * 30;
          return <circle key={k} cx={x} cy={y + 4} r="4" fill="#c9992a" />;
        })}
      </svg>

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        {/* LEFT copy */}
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-maroon-900/20 bg-white/80 px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.14em] text-maroon-950 backdrop-blur shadow-2xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-600" />
              </span>
              350+ Franchises All Over India
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-6 font-display text-[42px] font-bold leading-[1.02] tracking-tight text-maroon-950 sm:text-[58px] lg:text-[68px]">
              Own India's most <br className="hidden sm:block" />
              loved
              <span className="relative ml-3 inline-block">
                <span className="text-gradient-warm">café franchise</span>
                <svg
                  viewBox="0 0 320 14"
                  className="absolute -bottom-2 left-0 h-3 w-full"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <path
                    className="draw-stroke"
                    d="M4 10 Q80 2 160 8 T316 6"
                    stroke="#e4b74a"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <div className="mt-5 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[19px] sm:text-[22px]">
              <span className="text-maroon-950 font-bold">Starting today with</span>
              <span className="relative inline-flex h-9 w-56 items-baseline overflow-hidden sm:h-10 sm:w-64">
                <span
                  key={i}
                  className="word-flip font-display text-2xl font-bold text-gradient-gold sm:text-3xl"
                >
                  {words[i]}
                </span>
              </span>
            </div>
          </Reveal>

          <Reveal delay={220}>
            <p className="mt-6 max-w-xl text-[16.5px] font-medium leading-relaxed text-maroon-950 sm:text-[18px]">
              Join <b className="text-maroon-950 font-extrabold underline decoration-amber-400">350+ successful entrepreneurs</b> across 40+ Indian cities running
              proven, low-investment food franchises. Four iconic brands, complete setup support, and a
              business model designed for the Indian market — from Tier-1 metros to high streets.
            </p>
          </Reveal>

          <Reveal delay={280}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#lead"
                className="shine group inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700 px-6 py-3.5 text-[15px] font-bold text-white shadow-xl shadow-orange-500/30 transition-transform hover:-translate-y-0.5"
              >
                Apply for Franchise
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#brands"
                className="inline-flex items-center gap-2 rounded-full border border-maroon-900/25 bg-white/90 px-6 py-3.5 text-[15px] font-bold text-maroon-950 backdrop-blur transition hover:bg-white shadow-2xs"
              >
                Explore Brands
              </a>
              <a
                href={waLink("Family Cafe King Group")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-700"
              >
                <MessageCircle size={16} /> WhatsApp Us
              </a>
            </div>
          </Reveal>

          {/* Hero stats */}
          <Reveal delay={360}>
            <div className="mt-10 grid max-w-lg grid-cols-3 gap-3 sm:gap-5">
              {STATS.slice(0, 3).map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-maroon-900/15 bg-white/80 px-4 py-3.5 text-center backdrop-blur shadow-2xs"
                >
                  <div className="font-display text-xl font-bold text-maroon-950 sm:text-2xl">{s.value}</div>
                  <div className="mt-0.5 text-[11px] font-bold uppercase tracking-wide text-maroon-900">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* RIGHT visual */}
        <Reveal variant="scale" delay={200}>
          <HeroVisual currentBrand={BRANDS[i]} onOpen={() => onOpenBrand(BRANDS[i])} />
        </Reveal>
      </div>
    </section>
  );
}

function HeroVisual({
  currentBrand,
  onOpen,
}: {
  currentBrand: BrandData;
  onOpen: () => void;
}) {
  const Icon = currentBrand.icon;
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      {/* Main glass card */}
      <div className="relative rounded-[36px] bg-gradient-to-br from-maroon-900 via-maroon-800 to-maroon-950 p-1 shadow-[0_60px_120px_-30px_rgba(91,20,20,0.55)]">
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#1a0a0a] to-[#3a0f10] p-8 sm:p-10">
          {/* Ambient rings */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br from-amber-400/30 to-orange-500/10 blur-2xl animate-aurora" />
          <div className="pointer-events-none absolute -bottom-24 -left-12 h-64 w-64 rounded-full bg-gradient-to-br from-rose-500/25 to-fuchsia-500/10 blur-2xl animate-aurora" style={{ animationDelay: "3s" }} />

          {/* Signboard */}
          <div className="relative">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11.5px] font-bold uppercase tracking-[0.16em] text-amber-200 backdrop-blur">
                <Sparkles size={11} /> Family Cafe King Group
              </span>
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-emerald-300">
                350+ Outlets
              </span>
            </div>

            <div className="mt-8 flex items-end justify-between">
              <div>
                <div className="text-[13px] font-bold text-amber-200">Featured Brand</div>
                <div
                  key={currentBrand.key}
                  className="font-display text-3.5xl font-bold text-white sm:text-4xl"
                  style={{ animation: "wordFlip 2.8s ease-in-out" }}
                >
                  {currentBrand.name}
                </div>
                <div className="mt-1 text-[13.5px] font-medium text-amber-100">{currentBrand.tagline}</div>
              </div>

              {/* Cup / brand icon */}
              <div className="relative">
                <div
                  className={`grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br ${currentBrand.accentGradient} text-white shadow-2xl`}
                >
                  <Icon size={36} strokeWidth={2} />
                </div>
                {/* Steam */}
                <div className="pointer-events-none absolute -top-4 left-4 flex gap-1.5">
                  <span className="block h-4 w-0.5 rounded-full bg-amber-200 steam-1" />
                  <span className="block h-4 w-0.5 rounded-full bg-amber-200 steam-2" />
                  <span className="block h-4 w-0.5 rounded-full bg-amber-200 steam-3" />
                </div>
              </div>
            </div>

            {/* Investment strip */}
            <div className="mt-8 grid grid-cols-2 gap-3 rounded-2xl border border-white/15 bg-white/[0.08] p-3.5 backdrop-blur text-white">
              <div className="text-center">
                <div className="font-display text-lg font-bold text-amber-200">{currentBrand.priceDisplay}</div>
                <div className="text-[10.5px] font-bold uppercase tracking-wider text-white/80">Investment</div>
              </div>
              <div className="border-l border-white/15 text-center">
                <div className="font-display text-lg font-bold text-amber-200">{currentBrand.space}</div>
                <div className="text-[10.5px] font-bold uppercase tracking-wider text-white/80">Space Req.</div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex flex-wrap gap-1.5">
                {["Full SOPs", "Complete Kit", "Marketing Support"].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <button
                onClick={onOpen}
                className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-4 py-2 text-[12.5px] font-bold text-maroon-950 transition hover:bg-amber-300 shadow-md"
              >
                <Eye size={14} /> View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- SOCIAL PROOF ---------- */
function SocialProof() {
  const items = [...TRUST_LOGOS, ...TRUST_LOGOS];
  return (
    <section className="relative border-y border-maroon-900/15 bg-gradient-to-b from-cream-100/80 via-cream-50 to-cream-50 py-10">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="mb-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-[13px] font-extrabold uppercase tracking-[0.18em] text-maroon-950">
              350+ Franchises Operating Pan-India
            </p>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, k) => (
                <Star key={k} size={15} fill="#e4b74a" className="text-amber-500" />
              ))}
              <span className="ml-2 text-[13.5px] font-extrabold text-maroon-950">
                5.0/5 · Certified Quality Standard
              </span>
            </div>
          </div>
        </Reveal>

        <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_15%,#000_85%,transparent)]">
          <div className="flex w-max animate-marquee items-center gap-10 py-2">
            {items.map((t, k) => (
              <div key={k} className="flex items-center gap-2.5 whitespace-nowrap">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-amber-500/20 to-rose-500/15 text-amber-800">
                  <Award size={16} />
                </span>
                <span className="font-display text-[15.5px] font-bold text-maroon-950">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- BRANDS ---------- */
function Brands({ onOpenBrand }: { onOpenBrand: (brand: BrandData) => void }) {
  return (
    <section id="brands" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-14 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-maroon-900/15 bg-white/80 px-4 py-1.5 text-[11.5px] font-extrabold uppercase tracking-[0.16em] text-maroon-950 shadow-2xs">
              <Crown size={13} /> 4 Iconic Brands · 350+ Franchises
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-maroon-950 sm:text-5xl lg:text-6xl">
              Choose your <span className="text-gradient-warm">franchise brand</span>
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mx-auto mt-4 max-w-2xl text-[17px] font-medium leading-relaxed text-maroon-950">
              Each brand features exact starter kits, standardized SOPs, recipes, equipment, and full training.
              Click <b className="text-amber-800">View Details</b> to explore starter kits and menus for each brand.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {BRANDS.map((b, k) => {
            const Icon = b.icon;
            return (
              <Reveal key={b.key} delay={k * 80} variant="up">
                <article className="lift group relative flex h-full flex-col overflow-hidden rounded-3xl border border-maroon-900/15 bg-white p-6 shadow-sm">
                  <div
                    className={`absolute inset-x-0 top-0 h-2 bg-gradient-to-r ${b.accentGradient}`}
                    aria-hidden
                  />

                  <div className="flex items-center justify-between">
                    <div
                      className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${b.accentGradient} text-white shadow-lg`}
                    >
                      <Icon size={26} strokeWidth={2} />
                    </div>
                    <span className={`rounded-full ${b.chipBg} ${b.chipText} px-3 py-1 text-[11px] font-bold uppercase tracking-wider`}>
                      {b.priceDisplay}
                    </span>
                  </div>

                  <h3 className="mt-5 font-display text-2xl font-bold text-maroon-950">{b.name}</h3>
                  <p className="mt-1 text-[13px] font-bold uppercase tracking-wider text-amber-900">
                    {b.tagline}
                  </p>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-maroon-900 font-medium">{b.short}</p>

                  <div className="mt-5 space-y-2 rounded-2xl border border-maroon-900/10 bg-cream-50 p-3 text-[13px]">
                    <div className="flex justify-between">
                      <span className="font-semibold text-maroon-800">Area Required:</span>
                      <b className="text-maroon-950">{b.space}</b>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-maroon-800">Brand Fee:</span>
                      <b className="text-maroon-950">{b.investment.brandFee}</b>
                    </div>
                  </div>

                  <div className="mt-auto pt-6">
                    <button
                      onClick={() => onOpenBrand(b)}
                      className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700 px-5 py-3 text-[14px] font-bold text-white shadow-md shadow-orange-500/20 transition hover:shadow-orange-500/40 hover:-translate-y-0.5"
                    >
                      <Eye size={16} /> View Details
                    </button>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- FEATURES ---------- */
function Features() {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-gradient-to-b from-cream-50 via-cream-100/80 to-cream-50 py-20 sm:py-28"
    >
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-gradient-to-br from-amber-300/30 to-orange-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-gradient-to-br from-rose-400/25 to-maroon-700/20 blur-3xl" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-maroon-900/15 bg-white/80 px-4 py-1.5 text-[11.5px] font-extrabold uppercase tracking-[0.16em] text-maroon-950">
                <TrendingUp size={13} /> Why Family Cafe King
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-maroon-950 sm:text-5xl">
                Everything you need to <span className="text-gradient-warm">launch, run & scale</span>.
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-4 max-w-md text-[16.5px] font-medium leading-relaxed text-maroon-950">
                We walk with you through site selection, layout design, recipe SOP training, equipment setup, launch promotion, and daily operations across 350+ franchise outlets.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#lead"
                  className="shine group inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700 px-6 py-3.5 text-[15px] font-extrabold text-white shadow-xl shadow-orange-500/30 transition-transform hover:-translate-y-0.5"
                >
                  Talk to a Franchise Expert <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {FEATURES.map((f, k) => {
              const Icon = f.icon;
              return (
                <Reveal key={f.title} delay={k * 60}>
                  <div className="group h-full rounded-2xl border border-maroon-900/15 bg-white p-5 shadow-2xs transition hover:border-orange-500/40 hover:shadow-md">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-amber-500/20 to-rose-500/15 text-orange-800 transition-transform group-hover:scale-110">
                      <Icon size={20} />
                    </div>
                    <h3 className="mt-4 font-display text-lg font-bold text-maroon-950">{f.title}</h3>
                    <p className="mt-2 text-[14.5px] font-medium leading-relaxed text-maroon-900">{f.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- SHOWCASE (NO PRICES) ---------- */
function Showcase({ onOpenBrand }: { onOpenBrand: (brand: BrandData) => void }) {
  const showcaseItems = [
    { name: "Masala Kulhad Chai", tag: "Signature", brandKey: "chai", emoji: "☕", grad: "from-amber-500 to-rose-700" },
    { name: "Rajwadi Silver Paan", tag: "Bestseller", brandKey: "paan", emoji: "🌿", grad: "from-emerald-500 to-teal-800" },
    { name: "Oreo Shake Crunchy", tag: "Customer Fav", brandKey: "shake", emoji: "🥤", grad: "from-sky-500 to-indigo-700" },
    { name: "Rabri Malai Lassi", tag: "Royal", brandKey: "lassi", emoji: "🥛", grad: "from-yellow-400 to-orange-600" },
    { name: "Tandoori Chai", tag: "Viral", brandKey: "chai", emoji: "🍵", grad: "from-orange-600 to-maroon-800" },
    { name: "Chocolate Fire Paan", tag: "Specialty", brandKey: "paan", emoji: "🔥", grad: "from-fuchsia-500 to-rose-800" },
    { name: "Nutty Chocolate Shake", tag: "Premium", brandKey: "shake", emoji: "🍫", grad: "from-amber-600 to-orange-800" },
    { name: "Dry Fruit Royal Lassi", tag: "Traditional", brandKey: "lassi", emoji: "🥭", grad: "from-yellow-500 to-amber-700" },
  ];

  return (
    <section id="showcase" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-12 flex flex-col items-end justify-between gap-6 sm:flex-row">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-maroon-900/15 bg-white/80 px-4 py-1.5 text-[11.5px] font-extrabold uppercase tracking-[0.16em] text-maroon-950">
                <Coffee size={13} /> Menu Highlights
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold tracking-tight text-maroon-950 sm:text-5xl">
                Crowd-favourites crafted <span className="text-gradient-warm">for repeat business</span>.
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-3 max-w-xl text-[16.5px] font-medium leading-relaxed text-maroon-950">
                Standardized recipes and high margins. Click on any item or brand to explore the full itemized menu inside the Brand Deck.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {showcaseItems.map((it, k) => {
            const brandObj = BRANDS.find((b) => b.key === it.brandKey) || BRANDS[0];
            return (
              <Reveal key={it.name} delay={k * 60}>
                <article
                  onClick={() => onOpenBrand(brandObj)}
                  className="lift group relative cursor-pointer overflow-hidden rounded-3xl border border-maroon-900/15 bg-white p-4 shadow-2xs transition hover:border-orange-500/40"
                >
                  <div className={`relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br ${it.grad}`}>
                    <div className="absolute inset-0 grid place-items-center text-6xl transition-transform duration-700 group-hover:scale-110 sm:text-7xl">
                      {it.emoji}
                    </div>
                    <div className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-0.5 text-[10.5px] font-extrabold uppercase tracking-wider text-maroon-950 shadow-xs">
                      {it.tag}
                    </div>
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display text-[16.5px] font-bold leading-tight text-maroon-950">{it.name}</h3>
                      <p className="mt-1 text-[12px] font-bold uppercase tracking-wider text-amber-900">
                        {brandObj.name}
                      </p>
                    </div>
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-maroon-900/10 text-maroon-950 transition group-hover:bg-amber-500 group-hover:text-white">
                      <ArrowUpRight size={16} />
                    </span>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- BENEFITS (LONG TERM PROFITS) ---------- */
function Benefits() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1c0808] via-[#2d0a0a] to-[#150505] py-20 sm:py-28 text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-35 bg-grain" />
      <div className="pointer-events-none absolute -top-24 left-1/4 -z-10 h-96 w-96 rounded-full bg-amber-500/30 blur-3xl animate-blob" />
      <div className="pointer-events-none absolute -bottom-32 right-1/4 -z-10 h-96 w-96 rounded-full bg-rose-600/30 blur-3xl animate-blob" style={{ animationDelay: "4s" }} />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-14 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/50 bg-amber-500/20 px-4.5 py-2 text-[12px] font-extrabold uppercase tracking-[0.16em] text-amber-200 shadow-md backdrop-blur">
              <Sparkles size={14} className="text-amber-300" /> Built for Indian Entrepreneurs
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              A partnership built for <span className="text-gradient-gold">long-term profits</span>
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mx-auto mt-4 max-w-2xl text-[17px] font-semibold leading-relaxed text-amber-100">
              Low fixed costs, central raw material support, automated standard operating procedures, and 350+ operating outlets ensuring immediate brand recognition.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b, k) => {
            const Icon = b.icon;
            return (
              <Reveal key={b.title} delay={k * 80}>
                <div className="group h-full rounded-3xl border-2 border-amber-400/40 bg-[#2b0c0c]/90 p-6.5 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-1">
                  <div className="grid h-13 w-13 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-600 text-white shadow-lg shadow-amber-500/30 transition-transform group-hover:rotate-6 group-hover:scale-110">
                    <Icon size={24} strokeWidth={2.2} />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-bold text-white tracking-wide">{b.title}</h3>
                  <p className="mt-2.5 text-[15px] font-medium leading-relaxed text-amber-100">{b.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Stats strip */}
        <Reveal delay={200}>
          <div className="mt-14 grid grid-cols-2 gap-4 rounded-3xl border-2 border-amber-400/40 bg-[#240a0a]/90 p-7 shadow-2xl backdrop-blur-md sm:gap-6 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-4xl font-extrabold text-amber-300 drop-shadow sm:text-5xl">{s.value}</div>
                <div className="mt-1.5 text-[12.5px] font-extrabold uppercase tracking-wider text-amber-100">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Cities marquee */}
        <Reveal delay={280}>
          <div className="mt-10 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
            <div className="flex w-max animate-marquee items-center gap-3 py-2">
              {[...CITIES, ...CITIES].map((c, k) => (
                <span
                  key={k}
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-amber-400/40 bg-amber-500/15 px-4.5 py-2 text-[13.5px] font-bold text-amber-100 shadow-sm"
                >
                  <MapPin size={14} className="text-amber-300" /> {c}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- TESTIMONIALS ---------- */
function Testimonials() {
  return (
    <section id="testimonials" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-14 flex flex-col items-end justify-between gap-6 md:flex-row">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-maroon-900/15 bg-white/80 px-4 py-1.5 text-[11.5px] font-extrabold uppercase tracking-[0.16em] text-maroon-950">
                <Star size={13} fill="currentColor" /> Partner Testimonials
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold tracking-tight text-maroon-950 sm:text-5xl">
                Stories from <span className="text-gradient-warm">our 350+ franchise network</span>.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={140}>
            <div className="flex items-center gap-3 rounded-2xl border border-maroon-900/15 bg-white px-4 py-3 backdrop-blur shadow-2xs">
              <div className="flex -space-x-2">
                {["A", "P", "R", "M"].map((c, k) => (
                  <div
                    key={k}
                    className="grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-gradient-to-br from-amber-500 to-rose-600 text-[13px] font-bold text-white shadow"
                    style={{ zIndex: 10 - k }}
                  >
                    {c}
                  </div>
                ))}
              </div>
              <div className="leading-tight">
                <div className="text-[14px] font-bold text-maroon-950">350+ Outlets</div>
                <div className="text-[12px] font-medium text-maroon-800">Across 40+ Cities</div>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, k) => (
            <Reveal key={t.name} delay={k * 70}>
              <article className="lift flex h-full flex-col rounded-3xl border border-maroon-900/15 bg-white p-6 shadow-xs">
                <div className="flex items-center gap-1">
                  {[...Array(t.rating)].map((_, r) => (
                    <Star key={r} size={16} fill="#e4b74a" className="text-amber-500" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-[15px] font-medium leading-relaxed text-maroon-950">
                  <span className="font-display text-3xl leading-none text-amber-500">"</span>
                  {t.quote}
                </blockquote>
                <div className="mt-6 flex items-center gap-3 border-t border-maroon-900/10 pt-5">
                  <div
                    className={`grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br ${t.gradient} text-[13.5px] font-bold text-white shadow`}
                  >
                    {t.avatar}
                  </div>
                  <div className="flex-1 leading-tight">
                    <div className="text-[14.5px] font-bold text-maroon-950">{t.name}</div>
                    <div className="text-[12.5px] font-medium text-maroon-800">{t.city}</div>
                  </div>
                  <span className="rounded-full bg-maroon-900/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-maroon-950">
                    {t.brand}
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- PRICING ---------- */
function Pricing() {
  return (
    <section id="pricing" className="relative overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cream-50 via-cream-100/80 to-cream-50" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-amber-500/10 to-transparent" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-14 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-maroon-900/15 bg-white/80 px-4 py-1.5 text-[11.5px] font-extrabold uppercase tracking-[0.16em] text-maroon-950">
              <Crown size={13} /> Franchise Models
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-maroon-950 sm:text-5xl lg:text-6xl">
              Transparent investment. <span className="text-gradient-warm">Maximum returns.</span>
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mx-auto mt-4 max-w-2xl text-[17px] font-medium leading-relaxed text-maroon-950">
              Each package includes a complete Starter Kit with equipment, raw materials, digital branding assets, uniform, and 10 days hands-on training.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {PLANS.map((p, k) => (
            <Reveal key={p.name} delay={k * 100}>
              <div
                className={`lift group relative flex h-full flex-col overflow-hidden rounded-3xl p-8 backdrop-blur ${
                  p.highlighted
                    ? "border-2 border-amber-500/50 bg-gradient-to-b from-white via-cream-50 to-amber-50/70 shadow-[0_30px_80px_-20px_rgba(217,115,20,0.35)]"
                    : "border border-maroon-900/15 bg-white shadow-sm"
                }`}
              >
                {p.ribbon && (
                  <div className="absolute right-6 top-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-md">
                    {p.ribbon}
                  </div>
                )}

                <h3 className="font-display text-2xl font-bold text-maroon-950">{p.name}</h3>
                <p className="mt-1 text-[14px] font-medium text-maroon-800">{p.tagline}</p>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-display text-4xl font-bold text-maroon-950 sm:text-5xl">{p.price}</span>
                </div>
                <p className="mt-1 text-[12.5px] font-bold uppercase tracking-wider text-amber-900">{p.priceNote}</p>

                <ul className="mt-6 flex-1 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[14.5px] font-medium text-maroon-950">
                      <span
                        className={`mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center rounded-full ${
                          p.highlighted ? "bg-gradient-to-br from-amber-500 to-orange-600 text-white" : "bg-maroon-900/10 text-maroon-950"
                        }`}
                      >
                        <Check size={12} strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href="#lead"
                  className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-[14.5px] font-bold transition ${
                    p.highlighted
                      ? "bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700 text-white shadow-xl shadow-orange-500/30 hover:-translate-y-0.5"
                      : "border border-maroon-900/20 bg-white text-maroon-950 hover:bg-maroon-950 hover:text-cream-50"
                  }`}
                >
                  {p.cta}
                  <ArrowRight size={15} />
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <section id="faq" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <div className="mb-12 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-maroon-900/15 bg-white/80 px-4 py-1.5 text-[11.5px] font-extrabold uppercase tracking-[0.16em] text-maroon-950">
              Frequently Asked Questions
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-maroon-950 sm:text-5xl">
              Got questions? <span className="text-gradient-warm">We have answers.</span>
            </h2>
          </Reveal>
        </div>

        <div className="space-y-3.5">
          {FAQS.map((f, k) => {
            const isOpen = openIdx === k;
            return (
              <Reveal key={f.q} delay={k * 40}>
                <div
                  className={`overflow-hidden rounded-2xl border transition-all duration-500 ${
                    isOpen ? "border-orange-500/40 bg-white shadow-lg shadow-orange-500/10" : "border-maroon-900/15 bg-white/90 backdrop-blur"
                  }`}
                >
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : k)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                  >
                    <span className="font-display text-[16.5px] font-bold text-maroon-950 sm:text-[18px]">
                      {f.q}
                    </span>
                    <span
                      className={`grid h-8 w-8 flex-shrink-0 place-items-center rounded-full transition-all duration-300 ${
                        isOpen ? "rotate-180 bg-gradient-to-br from-amber-500 to-orange-600 text-white" : "bg-maroon-900/10 text-maroon-950"
                      }`}
                    >
                      {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-500 ease-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-[15px] font-medium leading-relaxed text-maroon-900 sm:px-6">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- LEAD FORM CTA (CONTACT SECTION) ---------- */
function LeadCTA({ initialBrand }: { initialBrand?: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<SaveResult | null>(null);
  const [saveError, setSaveError] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    brand: initialBrand || BRANDS[0].name,
    budget: "₹3 Lakhs ",
  });

  useEffect(() => {
    if (initialBrand) {
      setForm((f) => ({ ...f, brand: initialBrand }));
    }
  }, [initialBrand]);

const onSubmit = async (e: FormEvent) => {
  e.preventDefault();

  setSaving(true);
  setSaveError("");

  try {
    const response = await fetch("http://localhost:5000/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed");
    }

    alert("Lead Submitted Successfully");

    setForm({
      name: "",
      phone: "",
      email: "",
      city: "",
      brand: BRANDS[0].name,
      budget: "₹3 Lakhs",
    });
  } catch (err: any) {
    setSaveError(err.message);
    console.error(err);
  } finally {
    setSaving(false);
  }
};
    


  return (
    <section id="lead" className="relative overflow-hidden bg-gradient-to-br from-[#1d0707] via-[#2e090a] to-[#180505] py-20 sm:py-28 text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-35 bg-grain" />
      <div className="pointer-events-none absolute -left-32 top-20 -z-10 h-96 w-96 rounded-full bg-amber-500/30 blur-3xl animate-blob" />
      <div className="pointer-events-none absolute -right-24 bottom-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-rose-600/30 blur-3xl animate-blob" style={{ animationDelay: "4s" }} />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-16">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/50 bg-amber-500/20 px-4.5 py-2 text-[12px] font-extrabold uppercase tracking-[0.16em] text-amber-200 shadow-md backdrop-blur">
              <Sparkles size={14} className="text-amber-300" /> Start Your Franchise Journey
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Build your outlet with <span className="text-gradient-gold">Family Cafe King</span>
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-5 max-w-lg text-[17px] font-semibold leading-relaxed text-amber-100">
              Submit your enquiry below to receive an official franchise prospectus, itemized Starter Kit, and local city territory check within 24 hours.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <ul className="mt-8 space-y-4">
              {[
                "Direct contact with central franchise onboarding team",
                "Full Starter Kit details & itemized recipe list provided",
                "City-wise exclusive territory protection",
                "No hidden royalties or unexpected operational charges",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3.5 text-[15.5px] font-bold text-white">
                  <span className="mt-0.5 grid h-6 w-6 flex-shrink-0 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-orange-600 text-white shadow-md">
                    <Check size={14} strokeWidth={3} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={280}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 border-2 border-amber-400/50 px-5 py-3 text-[14px] font-extrabold text-amber-100 backdrop-blur transition hover:bg-amber-500/30 hover:text-white"
              >
                <Phone size={15} className="text-amber-300" /> {CONTACT_PHONE}
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 border-2 border-amber-400/50 px-5 py-3 text-[14px] font-extrabold text-amber-100 backdrop-blur transition hover:bg-amber-500/30 hover:text-white"
              >
                <Mail size={15} className="text-amber-300" /> {CONTACT_EMAIL}
              </a>
            </div>
          </Reveal>
        </div>

        {/* Form Box */}
        <Reveal variant="scale" delay={200}>
          <div className="relative rounded-[30px] bg-gradient-to-br from-amber-400 via-orange-500 to-rose-600 p-[2.5px] shadow-[0_40px_100px_-15px_rgba(0,0,0,0.8)]">
            <div className="rounded-[27.5px] bg-white p-6 sm:p-9 text-slate-950">
              {submitted ? (
                <div className="grid place-items-center py-12 text-center">
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-green-700 text-white shadow-lg">
                    <Check size={30} strokeWidth={3} />
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-extrabold text-maroon-950">
                    Enquiry Received!
                  </h3>
                  <p className="mt-2 max-w-sm text-[15.5px] font-semibold text-slate-800">
                    Thank you <b>{form.name}</b>! Our team will call on <b>{form.phone}</b> to share full details for <b>{form.brand}</b> in {form.city}.
                  </p>
                  {saveResult && (
                    <p className="mt-3 rounded-full bg-emerald-100 px-4 py-2 text-[12px] font-extrabold uppercase tracking-wider text-emerald-800">
                      Lead captured securely in {saveResult.storage === "supabase" ? "Supabase database" : "local demo storage"}
                    </p>
                  )}
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setSaveResult(null);
                      setSaveError("");
                    }}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-maroon-950 px-6 py-3 text-[14px] font-bold text-white hover:bg-maroon-900"
                  >
                    Submit another enquiry
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-6 flex items-center gap-3 border-b border-slate-200 pb-5">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700 text-white shadow-lg shadow-orange-500/30">
                      <Crown size={22} />
                    </span>
                    <div>
                      <h3 className="font-display text-2xl font-extrabold text-maroon-950">
                        Get Franchise Deck
                      </h3>
                      <p className="text-[13.5px] font-bold text-slate-700">
                        Zero commitment · Takes under 30 seconds
                      </p>
                    </div>
                  </div>

                  <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field
                        label="Full Name"
                        value={form.name}
                        onChange={(v) => setForm({ ...form, name: v })}
                        placeholder="e.g. Rohan Sharma"
                        required
                      />
                      <Field
                        label="Phone Number"
                        type="tel"
                        value={form.phone}
                        onChange={(v) => setForm({ ...form, phone: v })}
                        placeholder="+91 93411 27991"
                        required
                      />
                    </div>
                    <Field
                      label="Email Address"
                      type="email"
                      value={form.email}
                      onChange={(v) => setForm({ ...form, email: v })}
                      placeholder="your.email@gmail.com"
                      required
                    />
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field
                        label="Target City"
                        value={form.city}
                        onChange={(v) => setForm({ ...form, city: v })}
                        placeholder="e.g. Varanasi / Delhi"
                        required
                      />
                      <SelectField
                        label="Preferred Brand"
                        value={form.brand}
                        onChange={(v) => setForm({ ...form, brand: v })}
                        options={[...BRANDS.map((b) => b.name), "Multi-Brand Flagship"]}
                      />
                    </div>
                    <SelectField
                      label="Investment Range"
                      value={form.budget}
                      onChange={(v) => setForm({ ...form, budget: v })}
                      options={[
                        "₹1 Lakh  (Shake / Lassi)",
                        "₹2 Lakhs (Paan King)",
                        "₹3 Lakhs (Chai Cafe King)",
                        "₹7 Lakhs (Multi-Brand)",
                      ]}
                    />

                    {saveError && (
                      <p className="rounded-2xl bg-rose-100 px-4 py-3 text-[13px] font-bold text-rose-800">
                        {saveError}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={saving}
                      className="shine group relative mt-3 inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700 px-6 py-4 text-[16px] font-extrabold text-white shadow-xl shadow-orange-500/35 transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {saving ? "Saving Lead Securely..." : "Request Official Proposal"}
                      <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </button>
                    <p className="text-center text-[12px] font-bold text-slate-600">
                      🔒 Lead storage: {DATABASE_MODE === "supabase" ? "Live Supabase PostgreSQL" : "local demo database fallback"}
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-extrabold uppercase tracking-wider text-slate-900">
        {label} {required && <span className="text-rose-600">*</span>}
      </span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border-2 border-slate-300 bg-slate-50 px-4 py-3 text-[15px] font-bold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-orange-600 focus:bg-white focus:ring-4 focus:ring-orange-500/20"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-extrabold uppercase tracking-wider text-slate-900">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-xl border-2 border-slate-300 bg-slate-50 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%230f172a%22 stroke-width=%223%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><polyline points=%226 9 12 15 18 9%22/></svg>')] bg-[right_14px_center] bg-no-repeat px-4 py-3 pr-10 text-[15px] font-bold text-slate-950 outline-none transition focus:border-orange-600 focus:bg-white focus:ring-4 focus:ring-orange-500/20"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-white text-slate-950 font-bold">
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

/* ---------- FOOTER ---------- */
function Footer({
  onOpenBrand,
  onOpenLegal,
}: {
  onOpenBrand: (brand: BrandData) => void;
  onOpenLegal: (type: "privacy" | "terms") => void;
}) {
  return (
    <footer className="relative overflow-hidden bg-[#150606] pt-20 pb-10 text-cream-50">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <a href="#top" className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700 shadow-lg shadow-orange-500/30">
                <Crown size={18} />
              </span>
              <div className="leading-tight">
                <div className="font-display text-lg font-bold">Family Cafe King</div>
                <div className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-amber-300">
                  350+ Franchises Pan-India
                </div>
              </div>
            </a>
            <p className="mt-5 max-w-sm text-[14.5px] font-medium leading-relaxed text-amber-100">
              India's leading multi-brand café & QSR franchise group. Chai Cafe King, Paan King, Shake & Soda King, and Lassi King.
            </p>
            <div className="mt-6 flex gap-2">
              {[
                { Icon: Instagram, href: SOCIAL_LINKS.instagram },
                { Icon: Facebook, href: SOCIAL_LINKS.facebook },
                { Icon: Linkedin, href: SOCIAL_LINKS.linkedin },
                { Icon: WhatsApp, href: SOCIAL_LINKS.whatsapp },
              ].map(({ Icon, href }, k) => (
                <a
                  key={k}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Social Link"
                  className="grid h-10 w-10 place-items-center rounded-xl border border-amber-400/25 bg-white/10 text-amber-200 backdrop-blur transition hover:border-amber-400/60 hover:bg-white/20 hover:text-amber-100"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-[13px] font-bold uppercase tracking-[0.16em] text-amber-200">
              Our Brands
            </h4>
            <ul className="mt-5 space-y-3">
              {BRANDS.map((b) => (
                <li key={b.key}>
                  <button
                    onClick={() => onOpenBrand(b)}
                    className="inline-flex items-center gap-1.5 text-[14px] font-medium text-amber-100 transition hover:text-white"
                  >
                    <span className="link-underline">{b.name}</span>
                    <span className="text-[11px] text-amber-300">({b.priceDisplay})</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-[13px] font-bold uppercase tracking-[0.16em] text-amber-200">
              Quick Links
            </h4>
            <ul className="mt-5 space-y-3">
              {[
                { label: "Why FCK", href: "#features" },
                { label: "Menu Highlights", href: "#showcase" },
                { label: "Upcoming Launches", href: "#upcoming" },
                { label: "Franchise Packages", href: "#pricing" },
                { label: "Partner Stories", href: "#testimonials" },
                { label: "FAQ", href: "#faq" },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-[14px] font-medium text-amber-100 hover:text-white link-underline">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-[13px] font-bold uppercase tracking-[0.16em] text-amber-200">
              Get in Touch
            </h4>
            <ul className="mt-5 space-y-3 text-[14px] font-medium text-amber-100">
              <li>
                <a href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-white">
                  <Phone size={14} className="text-amber-300" /> {CONTACT_PHONE}
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-2 hover:text-white">
                  <Mail size={14} className="text-amber-300" /> {CONTACT_EMAIL}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-1 text-amber-300 flex-shrink-0" />
                <span>{LOCATION}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-amber-400/20 pt-8 sm:flex-row">
          <p className="text-[13px] font-medium text-amber-100">
            © {new Date().getFullYear()} Family Cafe King Group. All rights reserved. 350+ Outlets Nationwide.
          </p>
          <div className="flex flex-wrap items-center gap-5 text-[13px] font-bold text-amber-100">
            <button
              onClick={() => onOpenLegal("privacy")}
              className="link-underline transition hover:text-white cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onOpenLegal("terms")}
              className="link-underline transition hover:text-white cursor-pointer"
            >
              Terms of Service
            </button>
            <a href="#admin" className="link-underline transition hover:text-white">Admin Portal</a>
            <a href="#top" className="link-underline transition hover:text-white">Back to Top</a>
            <a href="#lead" className="link-underline transition hover:text-white">Get Prospectus</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------- STICKY MOBILE CTA ---------- */
function StickyMobileCTA() {
  return (
    <div className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-2 gap-2 rounded-2xl border border-maroon-900/20 bg-white/98 p-2 shadow-2xl backdrop-blur-xl lg:hidden">
      <a
        href={waLink("Family Cafe King Group")}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-3 text-[13.5px] font-bold text-white shadow-md"
      >
        <MessageCircle size={16} /> WhatsApp Us
      </a>
      <a
        href="#lead"
        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700 py-3 text-[13.5px] font-bold text-white shadow-md"
      >
        Get Franchise <ArrowRight size={15} />
      </a>
    </div>
  );
}

function WhatsAppChatButton() {
  return (
    <a
      href={waLink("Family Cafe King")}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Family Cafe King on WhatsApp"
      className="fixed bottom-20 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-[13px] font-bold text-white shadow-2xl shadow-emerald-600/30 transition hover:bg-emerald-700 hover:scale-[1.02] sm:bottom-6 sm:right-6 sm:px-5"
      title="Chat on WhatsApp"
    >
      <WhatsApp size={16} />
      <span className="hidden sm:inline">Chat on WhatsApp</span>
      <span className="sm:hidden">Chat</span>
    </a>
  );
}

/* ---------- MAIN APP ---------- */
export default function App() {
  const [selectedBrand, setSelectedBrand] = useState<BrandData | null>(null);
  const [leadBrand, setLeadBrand] = useState<string | undefined>(undefined);
  const [legalType, setLegalType] = useState<"privacy" | "terms" | null>(null);
  const [isAdminRoute, setIsAdminRoute] = useState(() => window.location.hash.startsWith("#admin"));

  useEffect(() => {
    const onHashChange = () => setIsAdminRoute(window.location.hash.startsWith("#admin"));
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const handleOpenBrand = (brand: BrandData) => {
    setSelectedBrand(brand);
  };

  const handleSelectLeadFromModal = (brandName: string) => {
    setLeadBrand(brandName);
    const leadElem = document.getElementById("lead");
    if (leadElem) {
      leadElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (isAdminRoute) {
    return <AdminPortal />;
  }

  return (
    <div className="relative min-h-screen bg-cream-50 text-maroon-950 antialiased selection:bg-amber-400 selection:text-maroon-950">
      <Nav />
      <main>
        <Hero onOpenBrand={handleOpenBrand} />
        <SocialProof />
        <Brands onOpenBrand={handleOpenBrand} />
        <Features />
        <Showcase onOpenBrand={handleOpenBrand} />
        <Benefits />
        <UpcomingLaunches />
        <Testimonials />
        <Pricing />
        <FAQ />
        <LeadCTA initialBrand={leadBrand} />
      </main>
      <Footer
        onOpenBrand={handleOpenBrand}
        onOpenLegal={(type) => setLegalType(type)}
      />
      <StickyMobileCTA />

      {/* Brand Details Modal */}
      <BrandModal
        brand={selectedBrand}
        onClose={() => setSelectedBrand(null)}
        onSelectLead={handleSelectLeadFromModal}
      />

      {/* Privacy Policy & Terms Modal */}
      <LegalModal
        type={legalType}
        onClose={() => setLegalType(null)}
      />

      {/* Persistent WhatsApp Chat CTA */}
      <WhatsAppChatButton />
    </div>
  );
}