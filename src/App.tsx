import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowRight,
  ChevronRight,
  ChevronLeft,
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
import { CookieBanner } from "./components/CookieBanner";
import { StaffTrainingModal } from "./components/StaffTrainingModal";
import { CityBookingModal } from "./components/CityBookingModal";
import { UpcomingLaunches } from "./components/UpcomingLaunches";
import { AdminPortal } from "./components/AdminPortal";
import { DEFAULT_SLIDES, listSlides, saveLead, trackVisitor, type SlideRecord } from "./lib/database";
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
    { href: "#upcoming", label: "Upcoming" },
    { href: "#brands", label: "Brands" },
    { href: "#features", label: "Why FCK" },
    { href: "#showcase", label: "Menu" },
    { href: "#testimonials", label: "Stories" },
    { href: "#pricing", label: "Franchise" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled
        ? "backdrop-blur-xl bg-cream-50/90 border-b border-maroon-900/15 shadow-[0_10px_40px_-20px_rgba(91,20,20,0.3)]"
        : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8 sm:py-4">
        {/* Logo */}
        <a href="#top" className="flex items-center gap-2.5 group">
          <span className="relative grid h-11 w-11 flex-shrink-0 place-items-center overflow-hidden rounded-xl border border-maroon-900/15 bg-white p-1 shadow-md transition-transform group-hover:scale-105">
            <img
              src={
                BRANDS.find((b) => b.key === "fck")?.logo ||
                "https://customer-assets-m6fa6gv7.emergentagent.net/job_5c36eac6-4afa-404a-9f8a-3a2a73a148f4/artifacts/t8gmidb5_FCK%20LOGO.png"
              }
              alt="Family Cafe King Logo"
              className="max-h-full max-w-full object-contain"
            />
          </span>
          <div className="leading-tight">
            <div className="font-display text-[15px] font-bold tracking-tight text-maroon-950 sm:text-base">
              Family Cafe King
            </div>
          </div>
        </a>

        {/* Desktop nav links */}
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

        {/* Desktop right actions */}
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

        {/* Mobile right: Hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="grid h-9 w-9 place-items-center rounded-xl border border-maroon-900/20 bg-white/80 backdrop-blur text-maroon-950"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <div
        className={`lg:hidden overflow-hidden transition-[max-height] duration-500 ease-out ${open ? "max-h-[80vh]" : "max-h-0"}`}
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
  const [slides, setSlides] = useState<SlideRecord[]>(DEFAULT_SLIDES);
  const [slideIndex, setSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchSlides = () => {
      listSlides()
        .then((rows) => {
          if (!cancelled && rows.length > 0) {
            const active = rows.filter((r) => r.is_active !== false);
            setSlides(active.length > 0 ? active : DEFAULT_SLIDES);
          }
        })
        .catch(() => setSlides(DEFAULT_SLIDES));
    };

    fetchSlides();

    const handleUpdate = () => fetchSlides();
    window.addEventListener("fck_slides_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      cancelled = true;
      window.removeEventListener("fck_slides_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setSlideIndex((curr) => (curr + 1) % (slides.length || 1));
    }, 3500);
    return () => clearInterval(interval);
  }, [slides.length, isPaused]);

  const currentSlide = useMemo(() => {
    if (!slides.length) return DEFAULT_SLIDES[0];
    return slides[slideIndex % slides.length] || DEFAULT_SLIDES[0];
  }, [slides, slideIndex]);

  const matchedBrand = useMemo(() => {
    const found = BRANDS.find(
      (b) => b.name.toLowerCase() === currentSlide.brand_name.toLowerCase()
    );
    return found || BRANDS[0];
  }, [currentSlide.brand_name]);

  const nextSlide = () => setSlideIndex((curr) => (curr + 1) % (slides.length || 1));
  const prevSlide = () => setSlideIndex((curr) => (curr - 1 + slides.length) % (slides.length || 1));

  return (
    <section
      id="top"
      className="relative overflow-hidden pt-20 pb-10 sm:pt-28 sm:pb-16 lg:pt-40 lg:pb-28"
    >
      {/* Ambient background */}
      <div className="radial-warm absolute inset-0 -z-10" />
      <div className="absolute inset-0 -z-10 opacity-70 bg-grain" />
      <div className="pointer-events-none absolute -left-24 top-24 -z-10 h-96 w-96 rounded-full bg-gradient-to-br from-amber-400/40 to-orange-600/30 blur-3xl animate-blob" />
      <div
        className="pointer-events-none absolute -right-24 top-40 -z-10 h-[26rem] w-[26rem] rounded-full bg-gradient-to-br from-rose-500/30 to-maroon-700/30 blur-3xl animate-blob"
        style={{ animationDelay: "3s" }}
      />

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

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Mobile: only show slider centered */}
        <div className="block lg:hidden">
          <HeroVisual
            slide={currentSlide}
            matchedBrand={matchedBrand}
            totalSlides={slides.length}
            currentIndex={slideIndex}
            onNext={nextSlide}
            onPrev={prevSlide}
            onSelect={(idx) => setSlideIndex(idx)}
            onOpen={() => onOpenBrand(matchedBrand)}
            onHoverStart={() => setIsPaused(true)}
            onHoverEnd={() => setIsPaused(false)}
          />
        </div>

        {/* Desktop: two-column layout */}
        <div className="hidden lg:grid max-w-7xl grid-cols-[1.05fr_0.95fr] items-center gap-16">
          {/* LEFT copy */}
          <div>
            <Reveal>
              <div className="flex h-8 items-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-maroon-900/20 bg-white/80 px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.14em] text-maroon-950 backdrop-blur shadow-2xs">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-600" />
                  </span>
                  {currentSlide.badge_text || "350+ Franchises All Over India"}
                </span>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="mt-4 h-[175px] overflow-hidden">
                <h1
                  key={currentSlide.id + "-title"}
                  className="font-display text-[54px] font-bold leading-[1.06] tracking-tight text-maroon-950 transition-opacity duration-300 line-clamp-3"
                >
                  {currentSlide.title}
                </h1>
              </div>
            </Reveal>

            <Reveal delay={160}>
              <div className="mt-2 flex h-10 items-center overflow-hidden">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[22px]">
                  <span className="font-bold text-maroon-950">Featured Brand:</span>
                  <span className="relative inline-flex h-9 items-baseline overflow-hidden">
                    <span
                      key={currentSlide.id + "-brand"}
                      className="word-flip font-display text-3xl font-bold text-gradient-gold"
                    >
                      {currentSlide.brand_name}
                    </span>
                  </span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={220}>
              <div className="mt-3 h-[60px] overflow-hidden">
                <p
                  key={currentSlide.id + "-sub"}
                  className="max-w-xl text-[17.5px] font-medium leading-relaxed text-maroon-950 transition-opacity duration-300 line-clamp-2"
                >
                  {currentSlide.subtitle}
                </p>
              </div>
            </Reveal>

            <Reveal delay={280}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={currentSlide.cta_link || "#lead"}
                  className="shine group inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700 px-6 py-3.5 text-[15px] font-bold text-white shadow-xl shadow-orange-500/30 transition-transform hover:-translate-y-0.5"
                >
                  {currentSlide.cta_text || "Apply for Franchise"}
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
                    <div className="font-display text-xl font-bold text-maroon-950 lg:text-2xl">{s.value}</div>
                    <div className="mt-0.5 text-[11px] font-bold uppercase tracking-wide text-maroon-900">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* RIGHT visual slider */}
          <Reveal variant="scale" delay={200}>
            <HeroVisual
              slide={currentSlide}
              matchedBrand={matchedBrand}
              totalSlides={slides.length}
              currentIndex={slideIndex}
              onNext={nextSlide}
              onPrev={prevSlide}
              onSelect={(idx) => setSlideIndex(idx)}
              onOpen={() => onOpenBrand(matchedBrand)}
              onHoverStart={() => setIsPaused(true)}
              onHoverEnd={() => setIsPaused(false)}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function HeroVisual({
  slide,
  matchedBrand,
  totalSlides,
  currentIndex,
  onNext,
  onPrev,
  onSelect,
  onOpen,
  onHoverStart,
  onHoverEnd,
}: {
  slide: SlideRecord;
  matchedBrand: BrandData;
  totalSlides: number;
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onSelect: (index: number) => void;
  onOpen: () => void;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
}) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [visible, setVisible] = useState(true);
  // Buffered: only swap content AFTER fade-out completes → no blink
  const [displayedSlide, setDisplayedSlide] = useState(slide);
  const [displayedBrand, setDisplayedBrand] = useState(matchedBrand);

  useEffect(() => {
    if (slide.id === displayedSlide.id) return;
    // Step 1: fade out old content
    setVisible(false);
    const t = setTimeout(() => {
      // Step 2: swap to new content while invisible
      setDisplayedSlide(slide);
      setDisplayedBrand(matchedBrand);
      // Step 3: fade in new content
      setVisible(true);
    }, 220);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slide.id]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (diff > 40) onNext();
    else if (diff < -40) onPrev();
    setTouchStart(null);
  };

  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      {/* Main glass card slider */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={onHoverStart}
        onMouseLeave={onHoverEnd}
        className="relative rounded-[36px] bg-gradient-to-br from-maroon-900 via-maroon-800 to-maroon-950 p-1 shadow-[0_60px_120px_-30px_rgba(91,20,20,0.55)] touch-pan-y select-none"
      >
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#1a0a0a] to-[#3a0f10] p-5 sm:p-7 md:p-9">
          {/* Ambient rings */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br from-amber-400/30 to-orange-500/10 blur-2xl animate-aurora" />
          <div
            className="pointer-events-none absolute -bottom-24 -left-12 h-64 w-64 rounded-full bg-gradient-to-br from-rose-500/25 to-fuchsia-500/10 blur-2xl animate-aurora"
            style={{ animationDelay: "3s" }}
          />

          {/* Slide background image (uses displayedSlide) */}
          {displayedSlide.image_url && (
            <div className="pointer-events-none absolute inset-0 opacity-15">
              <img src={displayedSlide.image_url} alt="" className="h-full w-full object-cover blur-sm" />
            </div>
          )}

          {/* All dynamic content — fades as one unit */}
          <div
            className="relative z-10 transition-opacity duration-[220ms] ease-in-out"
            style={{ opacity: visible ? 1 : 0 }}
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11.5px] font-bold uppercase tracking-[0.16em] text-amber-200 backdrop-blur">
                <Sparkles size={11} /> {displayedSlide.badge_text || "Family Cafe King Group"}
              </span>
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-emerald-300">
                Live Slider
              </span>
            </div>

            <div className="mt-7 flex items-end justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-200 sm:text-[13px]">Featured Concept</div>
                <div className="mt-1 min-h-[36px]">
                  <div className="font-display text-[22px] font-extrabold text-white sm:text-3xl md:text-4xl">
                    {displayedSlide.brand_name}
                  </div>
                </div>
                <div className="mt-1 text-[12px] font-medium leading-snug text-amber-100/90 line-clamp-2 sm:text-[13.5px]">
                  {displayedSlide.subtitle || displayedBrand.tagline}
                </div>
              </div>

              {/* Food Image & Brand Logo Badge */}
              <div className="relative flex-none">
                <div className="relative grid h-20 w-20 sm:h-22 sm:w-22 place-items-center rounded-2xl p-1 bg-gradient-to-br from-amber-400/40 via-orange-500/30 to-rose-500/40 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5)] border border-amber-300/40 backdrop-blur-md overflow-hidden group transition-all duration-500">
                  {(() => {
                    const img = displayedSlide.image_url || displayedBrand.foodImage || displayedBrand.logo;
                    const BrandIcon = displayedBrand.icon;
                    return img ? (
                      <img
                        src={img}
                        alt={displayedSlide.brand_name}
                        className="h-full w-full rounded-xl object-cover transition-transform duration-700 ease-out group-hover:scale-110 shadow-inner"
                        onError={(e) => { (e.target as HTMLElement).style.display = "none"; }}
                      />
                    ) : (
                      <div
                        className={`grid h-full w-full place-items-center rounded-xl bg-gradient-to-br ${displayedBrand.accentGradient} text-white shadow-2xl`}
                        style={{ backgroundColor: displayedSlide.accent_color || undefined }}
                      >
                        <BrandIcon size={34} strokeWidth={2} />
                      </div>
                    );
                  })()}
                  {/* Mini accent logo badge */}
                  <div className={`absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br ${displayedBrand.accentGradient} text-white shadow-lg ring-2 ring-black/40`}>
                    {(() => { const BrandIcon = displayedBrand.icon; return <BrandIcon size={13} strokeWidth={2.5} />; })()}
                  </div>
                </div>
                {/* Steam animation */}
                <div className="pointer-events-none absolute -top-4 left-5 flex gap-1.5 z-20">
                  <span className="block h-4 w-0.5 rounded-full bg-amber-200 steam-1" />
                  <span className="block h-4 w-0.5 rounded-full bg-amber-200 steam-2" />
                  <span className="block h-4 w-0.5 rounded-full bg-amber-200 steam-3" />
                </div>
              </div>
            </div>

            {/* Investment strip */}
            <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl border border-white/15 bg-white/[0.08] p-3 backdrop-blur text-white sm:mt-7 sm:p-3.5">
              <div className="text-center">
                <div className="font-display text-[15px] font-bold text-amber-200 sm:text-lg">
                  {displayedSlide.price_display || displayedBrand.priceDisplay}
                </div>
                <div className="text-[9.5px] font-bold uppercase tracking-wider text-white/80 sm:text-[10.5px]">Investment</div>
              </div>
              <div className="border-l border-white/15 text-center">
                <div className="font-display text-[15px] font-bold text-amber-200 sm:text-lg">
                  {displayedSlide.space_req || displayedBrand.space}
                </div>
                <div className="text-[9.5px] font-bold uppercase tracking-wider text-white/80 sm:text-[10.5px]">Space Req.</div>
              </div>
            </div>

            {/* Controls & Nav */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={onPrev}
                  className="grid h-8 w-8 place-items-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 transition-all"
                  aria-label="Previous Hero Slide"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex items-center gap-1 px-1">
                  {Array.from({ length: totalSlides }).map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onSelect(idx)}
                      className={`h-2 rounded-full transition-all ${idx === currentIndex ? "w-6 bg-amber-400" : "w-2 bg-white/40 hover:bg-white/70"
                        }`}
                      title={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={onNext}
                  className="grid h-8 w-8 place-items-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 transition-all"
                  aria-label="Next Hero Slide"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <button
                type="button"
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
  const brandList = BRANDS.filter((b) => b.key !== "fck");

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
          {brandList.map((b, k) => {
            return (
              <Reveal key={b.key} delay={k * 80} variant="up" className="h-full">
                <article className="lift group relative flex h-full flex-col overflow-hidden rounded-3xl border border-maroon-900/15 bg-white p-6 shadow-sm">
                  <div
                    className={`absolute inset-x-0 top-0 h-2 bg-gradient-to-r ${b.accentGradient}`}
                    aria-hidden
                  />

                  <div className="flex items-center justify-between">
                    <div className="grid h-16 w-16 flex-shrink-0 place-items-center overflow-hidden rounded-2xl border border-maroon-900/15 bg-white p-2.5 shadow-md transition-transform group-hover:scale-105">
                      <img
                        src={b.logo}
                        alt={`${b.name} Official Logo`}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = "none";
                        }}
                      />
                    </div>
                    <span className={`rounded-full ${b.chipBg} ${b.chipText} px-3 py-1 text-[11px] font-bold uppercase tracking-wider`}>
                      {b.priceDisplay}
                    </span>
                  </div>

                  <h3 className="mt-5 font-display text-2xl font-bold text-maroon-950">{b.name}</h3>
                  <div className="mt-1 flex min-h-[38px] items-center">
                    <p className="text-[12.5px] font-bold uppercase tracking-wider text-amber-900 leading-snug">
                      {b.tagline}
                    </p>
                  </div>

                  <div className="mt-3 flex-1">
                    <p className="text-[14.5px] leading-relaxed text-maroon-900 font-medium">{b.short}</p>
                  </div>

                  <div className="mt-auto space-y-2 rounded-2xl border border-maroon-900/10 bg-cream-50 p-3.5 text-[13px]">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-maroon-800">Area Required:</span>
                      <b className="text-maroon-950">{b.space}</b>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-maroon-800">Brand Fee:</span>
                      <b className="text-maroon-950">{b.investment.brandFee}</b>
                    </div>
                  </div>

                  <div className="pt-5">
                    <button
                      onClick={() => onOpenBrand(b)}
                      className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700 px-5 py-3 text-[14px] font-bold text-white shadow-md shadow-orange-500/20 transition hover:shadow-orange-500/40 hover:-translate-y-0.5 cursor-pointer"
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
    { name: "Masala Kulhad Chai", tag: "Signature", brandKey: "chai", image: "/images/masala-kulhad-chai.png", grad: "from-amber-500 to-rose-700" },
    { name: "Rajwadi Silver Paan", tag: "Bestseller", brandKey: "paan", image: "/images/rajwadi-silver-paan.png", grad: "from-emerald-500 to-teal-800" },
    { name: "Oreo Shake Crunchy", tag: "Customer Fav", brandKey: "shake", image: "/images/oreo-shake-crunchy.png", grad: "from-sky-500 to-indigo-700" },
    { name: "Rabri Malai Lassi", tag: "Royal", brandKey: "lassi", image: "/images/rabri-malai-lassi.png", grad: "from-yellow-400 to-orange-600" },
    { name: "Tandoori Chai", tag: "Viral", brandKey: "chai", image: "/images/tandoori-chai.png", grad: "from-orange-600 to-maroon-800" },
    { name: "Chocolate Fire Paan", tag: "Specialty", brandKey: "paan", image: "/images/chocolate-fire-paan.png", grad: "from-fuchsia-500 to-rose-800" },
    { name: "Nutty Chocolate Shake", tag: "Premium", brandKey: "shake", image: "/images/nutty-chocolate-shake.png", grad: "from-amber-600 to-orange-800" },
    { name: "Dry Fruit Royal Lassi", tag: "Traditional", brandKey: "lassi", image: "/images/dry-fruit-royal-lassi.png", grad: "from-yellow-500 to-amber-700" },
  ];

  return (
    <section id="showcase" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-12 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-maroon-900/15 bg-white/80 px-4 py-1.5 text-[11.5px] font-extrabold uppercase tracking-[0.16em] text-maroon-950">
              <Coffee size={13} /> Menu Highlights
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-maroon-950 sm:text-5xl">
              Crowd-favourites crafted <span className="text-gradient-warm">for repeat business</span>.
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mx-auto mt-3 max-w-2xl text-[16.5px] font-medium leading-relaxed text-maroon-950">
              Standardized recipes and high margins. Click on any item or brand to explore the full itemized menu inside the Brand Deck.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {showcaseItems.map((it, k) => {
            const brandObj = BRANDS.find((b) => b.key === it.brandKey) || BRANDS[0];
            return (
              <Reveal key={it.name} delay={k * 60} className="h-full">
                <article
                  onClick={() => onOpenBrand(brandObj)}
                  className="lift group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-maroon-900/15 bg-white p-4 shadow-2xs transition hover:border-orange-500/40"
                >
                  <div className={`relative aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-br ${it.grad}`}>
                    <img
                      src={it.image}
                      alt={it.name}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    <div className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-0.5 text-[10.5px] font-extrabold uppercase tracking-wider text-maroon-950 shadow-xs backdrop-blur-md">
                      {it.tag}
                    </div>
                  </div>
                  <div className="mt-4 flex flex-1 items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display text-[16.5px] font-bold leading-tight text-maroon-950">{it.name}</h3>
                      <p className="mt-1 text-[12px] font-bold uppercase tracking-wider text-amber-900">
                        {brandObj.name}
                      </p>
                    </div>
                    <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-maroon-900/10 text-maroon-950 transition group-hover:bg-amber-500 group-hover:text-white">
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
    <section className="relative overflow-hidden bg-[#FAEBD6] py-20 sm:py-28 text-maroon-950">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-40 bg-grain" />
      <div className="pointer-events-none absolute -top-24 left-1/4 -z-10 h-96 w-96 rounded-full bg-amber-500/20 blur-3xl animate-blob" />
      <div className="pointer-events-none absolute -bottom-32 right-1/4 -z-10 h-96 w-96 rounded-full bg-rose-500/15 blur-3xl animate-blob" style={{ animationDelay: "4s" }} />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-14 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-maroon-900/15 bg-white/80 px-4.5 py-2 text-[12px] font-extrabold uppercase tracking-[0.16em] text-maroon-950 shadow-sm backdrop-blur">
              <Sparkles size={14} className="text-orange-700" /> Built for Indian Entrepreneurs
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-maroon-950 sm:text-5xl lg:text-6xl">
              A partnership built for <span className="text-gradient-warm">long-term profits</span>
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mx-auto mt-4 max-w-2xl text-[17px] font-semibold leading-relaxed text-maroon-900">
              Low fixed costs, central raw material support, automated standard operating procedures, and 350+ operating outlets ensuring immediate brand recognition.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b, k) => {
            const Icon = b.icon;
            return (
              <Reveal key={b.title} delay={k * 80}>
                <div className="group h-full rounded-3xl border border-maroon-900/15 bg-white p-6.5 shadow-md backdrop-blur-md transition-all duration-300 hover:border-orange-500/40 hover:shadow-xl hover:-translate-y-1">
                  <div className="grid h-13 w-13 place-items-center rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700 text-white shadow-lg shadow-orange-500/20 transition-transform group-hover:rotate-6 group-hover:scale-110">
                    <Icon size={24} strokeWidth={2.2} />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-bold text-maroon-950 tracking-wide">{b.title}</h3>
                  <p className="mt-2.5 text-[15px] font-semibold leading-relaxed text-maroon-900">{b.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Stats strip */}
        <Reveal delay={200}>
          <div className="mt-14 grid grid-cols-2 gap-4 rounded-3xl border border-maroon-900/15 bg-white p-7 shadow-lg backdrop-blur-md sm:gap-6 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-4xl font-extrabold text-gradient-warm sm:text-5xl">{s.value}</div>
                <div className="mt-1.5 text-[12.5px] font-extrabold uppercase tracking-wider text-maroon-900">
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
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-maroon-900/15 bg-white/90 px-4.5 py-2 text-[13.5px] font-bold text-maroon-950 shadow-sm"
                >
                  <MapPin size={14} className="text-orange-700" /> {c}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}



/* ---------- STAFF TRAINING & SUPPORT ---------- */
function StaffTraining({ onOpenDetails }: { onOpenDetails: () => void }) {
  return (
    <section id="training" className="relative overflow-hidden bg-gradient-to-b from-cream-50 via-amber-50/50 to-cream-50 py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-30 bg-grain" />
      <div className="pointer-events-none absolute top-1/3 right-10 -z-10 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-14 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-900/20 bg-emerald-500/10 px-4.5 py-2 text-[12px] font-extrabold uppercase tracking-[0.16em] text-emerald-800 shadow-2xs backdrop-blur">
              <Award size={14} className="text-emerald-600" /> Complete Operational Backing
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-maroon-950 sm:text-5xl lg:text-6xl">
              Staff Training &amp; <span className="text-gradient-warm">Support</span>
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mx-auto mt-4 max-w-2xl text-[17px] font-semibold leading-relaxed text-maroon-900 sm:text-[18px]">
              Food Training Support (Pan India)
            </p>
          </Reveal>
        </div>

        {/* Dynamic Feature Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* 1. Food Type / Category */}
          <Reveal delay={100}>
            <div className="group flex h-full flex-col justify-between rounded-3xl border border-maroon-900/15 bg-white p-7 shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-500/40 hover:shadow-2xl">
              <div>
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/20">
                    <Coffee size={22} strokeWidth={2.5} />
                  </div>
                  <h3 className="font-display text-xl font-bold tracking-wide text-maroon-950">
                    Food Type / Category
                  </h3>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {["ONLY VEG & INDIAN", "FAST FOOD", "MOCKTAILS"].map((cat) => (
                    <span
                      key={cat}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-amber-900/15 bg-amber-50/80 px-3.5 py-2 text-[13px] font-extrabold text-maroon-950 shadow-2xs"
                    >
                      <Check size={14} className="text-emerald-600" strokeWidth={3} />
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-6 border-t border-maroon-900/10 pt-4">
                <button
                  type="button"
                  onClick={onOpenDetails}
                  className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700 px-5 py-3 text-[14px] font-bold text-white shadow-md shadow-orange-500/20 transition hover:shadow-orange-500/40 hover:-translate-y-0.5 cursor-pointer"
                >
                  <Eye size={16} /> View Details
                </button>
              </div>
            </div>
          </Reveal>

          {/* 2. Time Period */}
          <Reveal delay={180}>
            <div className="group flex h-full flex-col justify-between rounded-3xl border border-maroon-900/15 bg-white p-7 shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-500/40 hover:shadow-2xl">
              <div>
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-orange-500 to-rose-600 text-white shadow-md shadow-orange-500/20">
                    <TrendingUp size={22} strokeWidth={2.5} />
                  </div>
                  <h3 className="font-display text-xl font-bold tracking-wide text-maroon-950">
                    Time Period
                  </h3>
                </div>
                <div className="mt-6">
                  <div className="font-display text-2xl font-black text-maroon-950 sm:text-3xl">
                    6 Months Hotel Visit
                  </div>
                  <p className="mt-2.5 text-[14.5px] font-semibold leading-relaxed text-maroon-900">
                    On-site master chef &amp; trainer assigned to train your local team.
                  </p>
                </div>
              </div>
              <div className="mt-6 border-t border-maroon-900/10 pt-4">
                <button
                  type="button"
                  onClick={onOpenDetails}
                  className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700 px-5 py-3 text-[14px] font-bold text-white shadow-md shadow-orange-500/20 transition hover:shadow-orange-500/40 hover:-translate-y-0.5 cursor-pointer"
                >
                  <Eye size={16} /> View Details
                </button>
              </div>
            </div>
          </Reveal>

          {/* 3. Initial Costing */}
          <Reveal delay={260}>
            <div className="group flex h-full flex-col justify-between rounded-3xl border border-maroon-900/15 bg-gradient-to-br from-white via-cream-50 to-amber-50/70 p-7 shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-500/40 hover:shadow-2xl">
              <div>
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/20">
                    <Crown size={22} strokeWidth={2.5} />
                  </div>
                  <h3 className="font-display text-xl font-bold tracking-wide text-maroon-950">
                    Initial Costing
                  </h3>
                </div>
                <div className="mt-6">
                  <div className="font-display text-2xl font-black text-gradient-warm sm:text-3xl">
                    1.5 Lakh Training Charge
                  </div>
                  <ul className="mt-4 space-y-2 text-[13.5px] font-bold text-maroon-950">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-amber-600 flex-shrink-0" />
                      + Travel Expenses of Trainer
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-amber-600 flex-shrink-0" />
                      + Stay &amp; Food for Trainer
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 border-t border-maroon-900/10 pt-4">
                <button
                  type="button"
                  onClick={onOpenDetails}
                  className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700 px-5 py-3 text-[14px] font-bold text-white shadow-md shadow-orange-500/20 transition hover:shadow-orange-500/40 hover:-translate-y-0.5 cursor-pointer"
                >
                  <Eye size={16} /> View Details
                </button>
              </div>
            </div>
          </Reveal>
        </div>
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
function PricingCard({ plan: p }: { plan: (typeof PLANS)[number] }) {
  const [active, setActive] = useState(false);

  const handleMouseEnter = () => setActive(true);
  const handleMouseLeave = () => setActive(false);
  const handleClick = () => setActive((prev) => !prev);

  const isActive = active;

  return (
    <div
      role="button"
      tabIndex={0}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      className={`relative flex h-full flex-col overflow-hidden rounded-3xl p-8 backdrop-blur transition-all duration-500 ease-out cursor-pointer select-none ${isActive
          ? "-translate-y-2.5 shadow-[0_35px_75px_-15px_rgba(217,115,20,0.45)]"
          : ""
        } ${p.highlighted
          ? `border-2 shadow-[0_20px_50px_-15px_rgba(217,115,20,0.3)] ${isActive
            ? "border-amber-400 bg-gradient-to-br from-[#1D0609] via-[#2F0A0E] to-[#170406]"
            : "border-amber-500 bg-gradient-to-b from-white via-cream-50 to-amber-50/80"
          }`
          : `border ${isActive
            ? "border-amber-400 bg-gradient-to-br from-[#1D0609] via-[#2F0A0E] to-[#170406]"
            : "border-maroon-900/15 bg-white shadow-sm"
          }`
        }`}
    >
      {/* Ribbon */}
      {p.ribbon && (
        <div
          className={`absolute right-6 top-6 rounded-full px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider shadow-md transition-all duration-500 ${isActive
              ? "scale-110 bg-gradient-to-br from-amber-400 to-amber-500 text-maroon-950"
              : "bg-gradient-to-br from-amber-500 to-orange-600 text-white"
            }`}
        >
          {p.ribbon}
        </div>
      )}

      {/* Name */}
      <h3
        className={`font-display text-2xl font-extrabold transition-colors duration-500 sm:text-3xl ${isActive ? "text-amber-300" : "text-maroon-950"
          }`}
      >
        {p.name}
      </h3>

      {/* Tagline */}
      <p
        className={`mt-1.5 text-[14px] font-semibold transition-colors duration-500 ${isActive ? "text-amber-100/90" : "text-maroon-800"
          }`}
      >
        {p.tagline}
      </p>

      {/* Price */}
      <div className="mt-6 flex items-baseline gap-2">
        <span
          className={`font-display text-4xl font-black transition-colors duration-500 sm:text-5xl ${isActive ? "text-white" : "text-maroon-950"
            }`}
        >
          {p.price}
        </span>
      </div>
      <p
        className={`mt-1 text-[12.5px] font-extrabold uppercase tracking-wider transition-colors duration-500 ${isActive ? "text-amber-400" : "text-amber-900"
          }`}
      >
        {p.priceNote}
      </p>

      {/* Features */}
      <ul className="mt-6 flex-1 space-y-3.5">
        {p.features.map((f) => (
          <li
            key={f}
            className={`flex items-start gap-3 text-[14.5px] font-semibold transition-colors duration-500 ${isActive ? "text-amber-50" : "text-maroon-950"
              }`}
          >
            <span
              className={`mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center rounded-full transition-all duration-500 ${p.highlighted
                  ? isActive
                    ? "scale-110 bg-amber-400 text-maroon-950"
                    : "bg-gradient-to-br from-amber-500 to-orange-600 text-white"
                  : isActive
                    ? "scale-110 bg-amber-400 text-maroon-950"
                    : "bg-maroon-900/10 text-maroon-950"
                }`}
            >
              <Check size={12} strokeWidth={3} />
            </span>
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href="#lead"
        onClick={(e) => e.stopPropagation()}
        className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[14.5px] font-extrabold transition-all duration-500 shadow-md ${p.highlighted
            ? isActive
              ? "scale-[1.02] bg-gradient-to-br from-amber-400 to-orange-500 text-maroon-950 shadow-amber-500/40"
              : "bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700 text-white shadow-xl shadow-orange-500/30"
            : isActive
              ? "scale-[1.02] border-transparent bg-gradient-to-br from-amber-400 to-orange-500 text-maroon-950 shadow-lg shadow-amber-500/30"
              : "border border-maroon-900/20 bg-white text-maroon-950"
          }`}
      >
        {p.cta}
        <ArrowRight size={15} />
      </a>
    </div>
  );
}

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
              <PricingCard plan={p} />
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
                  className={`overflow-hidden rounded-2xl border transition-all duration-500 ${isOpen ? "border-orange-500/40 bg-white shadow-lg shadow-orange-500/10" : "border-maroon-900/15 bg-white/90 backdrop-blur"
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
                      className={`grid h-8 w-8 flex-shrink-0 place-items-center rounded-full transition-all duration-300 ${isOpen ? "rotate-180 bg-gradient-to-br from-amber-500 to-orange-600 text-white" : "bg-maroon-900/10 text-maroon-950"
                        }`}
                    >
                      {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-500 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
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
    setSaveError("");

    if (form.name.trim().length < 2) {
      setSaveError("Please enter a valid full name (letters only).");
      return;
    }

    const cleanPhone = form.phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      setSaveError("Please enter a valid 10-digit mobile number (e.g. 9876543210).");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      setSaveError("Please enter a valid email address (e.g. rahul@example.com).");
      return;
    }

    if (form.city.trim().length < 2) {
      setSaveError("Please enter a valid target city/location.");
      return;
    }

    setSaving(true);

    try {
      await saveLead({
        ...form,
        name: form.name.trim(),
        phone: cleanPhone,
        email: form.email.trim(),
        city: form.city.trim(),
      });
      setSubmitted(true);

      setForm({
        name: "",
        phone: "",
        email: "",
        city: "",
        brand: BRANDS[0].name,
        budget: "₹3 Lakhs",
      });
    } catch (err: any) {
      console.error("Lead submission error:", err);
      setSaveError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section id="lead" className="relative overflow-hidden bg-[#FAEBD6] py-20 sm:py-28 text-maroon-950">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-40 bg-grain" />
      <div className="pointer-events-none absolute -left-32 top-20 -z-10 h-96 w-96 rounded-full bg-amber-500/20 blur-3xl animate-blob" />
      <div className="pointer-events-none absolute -right-24 bottom-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-rose-500/15 blur-3xl animate-blob" style={{ animationDelay: "4s" }} />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-16">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-maroon-900/15 bg-white/80 px-4.5 py-2 text-[12px] font-extrabold uppercase tracking-[0.16em] text-maroon-950 shadow-sm backdrop-blur">
              <Sparkles size={14} className="text-orange-700" /> Start Your Franchise Journey
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-maroon-950 sm:text-5xl lg:text-6xl">
              Build your outlet with <span className="text-gradient-warm">Family Cafe King</span>
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-5 max-w-lg text-[17px] font-semibold leading-relaxed text-maroon-900">
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
                <li key={t} className="flex items-start gap-3.5 text-[15.5px] font-bold text-maroon-950">
                  <span className="mt-0.5 grid h-6 w-6 flex-shrink-0 place-items-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md">
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
                className="inline-flex items-center gap-2 rounded-full border border-maroon-900/20 bg-white/80 px-5 py-3 text-[14px] font-extrabold text-maroon-950 shadow-sm backdrop-blur transition hover:bg-white"
              >
                <Phone size={15} className="text-orange-700" /> {CONTACT_PHONE}
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-2 rounded-full border border-maroon-900/20 bg-white/80 px-5 py-3 text-[14px] font-extrabold text-maroon-950 shadow-sm backdrop-blur transition hover:bg-white"
              >
                <Mail size={15} className="text-orange-700" /> {CONTACT_EMAIL}
              </a>
            </div>
          </Reveal>
        </div>

        {/* Form Box */}
        <Reveal variant="scale" delay={200}>
          <div className="relative rounded-[30px] bg-gradient-to-br from-amber-400 via-orange-500 to-rose-600 p-[2.5px] shadow-none">
            <div className="rounded-[27.5px] bg-[#FAEBD6] p-6 sm:p-9 text-slate-950">
              {submitted ? (
                <div className="grid place-items-center py-12 text-center">
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-green-700 text-white shadow-lg">
                    <Check size={30} strokeWidth={3} />
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-extrabold text-maroon-950">
                    Enquiry Received!
                  </h3>
                  <p className="mt-2 max-w-sm text-[15.5px] font-semibold text-slate-800">
                    Thank you! Your enquiry has been received.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
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
                        onChange={(v) => setForm({ ...form, name: v.replace(/[^a-zA-Z\s]/g, "") })}
                        placeholder="e.g. Rohan Sharma"
                        required
                      />
                      <Field
                        label="Phone Number (10 Digits)"
                        type="tel"
                        maxLength={10}
                        value={form.phone}
                        onChange={(v) => setForm({ ...form, phone: v.replace(/\D/g, "").slice(0, 10) })}
                        placeholder="e.g. 9876543210"
                        required
                      />
                    </div>
                    <Field
                      label="Email Address"
                      type="email"
                      value={form.email}
                      onChange={(v) => setForm({ ...form, email: v.trim() })}
                      placeholder="your.email@gmail.com"
                      required
                    />
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field
                        label="Target City"
                        value={form.city}
                        onChange={(v) => setForm({ ...form, city: v.replace(/[^a-zA-Z\s,-]/g, "") })}
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
                      {saving ? "Submitting..." : "Submit"}
                      <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </button>
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
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  maxLength?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-extrabold uppercase tracking-wider text-slate-900">
        {label} {required && <span className="text-rose-600">*</span>}
      </span>
      <input
        type={type}
        required={required}
        maxLength={maxLength}
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
            <a href="#top" className="flex items-center gap-3.5 group">
              <span className="relative grid h-14 w-14 flex-shrink-0 place-items-center overflow-hidden rounded-2xl border border-amber-400/30 bg-white p-1.5 shadow-xl shadow-orange-500/15 transition-transform group-hover:scale-105">
                <img
                  src={
                    BRANDS.find((b) => b.key === "fck")?.logo ||
                    "https://customer-assets-m6fa6gv7.emergentagent.net/job_5c36eac6-4afa-404a-9f8a-3a2a73a148f4/artifacts/t8gmidb5_FCK%20LOGO.png"
                  }
                  alt="Family Cafe King Logo"
                  className="h-full w-full object-contain rounded-xl"
                />
              </span>
              <div className="leading-tight">
                <div className="font-display text-lg font-bold text-white">Family Cafe King</div>
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
      aria-label="Chat on WhatsApp"
      className="hidden sm:grid fixed bottom-6 right-6 z-40 h-12 w-12 place-items-center rounded-full bg-emerald-600 text-white shadow-xl shadow-emerald-600/40 transition-all duration-300 hover:bg-emerald-500 hover:scale-110"
      title="Chat on WhatsApp"
    >
      <WhatsApp size={22} />
      {/* Online Status Dot Indicator */}
      <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-80" />
        <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-emerald-900 bg-emerald-400" />
      </span>
    </a>
  );
}

/* ---------- MAIN APP ---------- */
export default function App() {
  const [selectedBrand, setSelectedBrand] = useState<BrandData | null>(null);
  const [trainingModalOpen, setTrainingModalOpen] = useState(false);
  const [leadBrand, setLeadBrand] = useState<string | undefined>(undefined);
  const [legalType, setLegalType] = useState<"privacy" | "terms" | null>(null);
  const [cityBookingState, setCityBookingState] = useState<{
    isOpen: boolean;
    city?: string;
    brand?: string;
  }>({ isOpen: false });

  const checkPortalRoute = () => {
    const h = window.location.hash.toLowerCase();
    return h.startsWith("#admin") || h.startsWith("#login") || h.startsWith("#franchise-login") || h.startsWith("#portal");
  };

  const [isAdminRoute, setIsAdminRoute] = useState(checkPortalRoute);

  useEffect(() => {
    trackVisitor();
  }, []);

  useEffect(() => {
    const onHashChange = () => setIsAdminRoute(checkPortalRoute());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const handleOpenBrand = (brand: BrandData) => {
    setSelectedBrand(brand);
  };

  const handleOpenCityBooking = (city?: string, brand?: string) => {
    setCityBookingState({ isOpen: true, city, brand });
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
        <UpcomingLaunches onOpenCityBooking={handleOpenCityBooking} />
        <Brands onOpenBrand={handleOpenBrand} />
        <Features />
        <Showcase onOpenBrand={handleOpenBrand} />
        <Benefits />
        <StaffTraining onOpenDetails={() => setTrainingModalOpen(true)} />
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

      {/* Staff Training Details Deck Modal */}
      <StaffTrainingModal
        isOpen={trainingModalOpen}
        onClose={() => setTrainingModalOpen(false)}
      />

      {/* Privacy Policy & Terms Modal */}
      <LegalModal
        type={legalType}
        onClose={() => setLegalType(null)}
      />

      {/* City Territory Booking Popup Modal */}
      <CityBookingModal
        isOpen={cityBookingState.isOpen}
        initialCity={cityBookingState.city}
        initialBrand={cityBookingState.brand}
        onClose={() => setCityBookingState({ isOpen: false })}
      />

      {/* Persistent WhatsApp Chat CTA */}
      <WhatsAppChatButton />

      {/* GDPR / Privacy Cookie Consent Banner */}
      <CookieBanner onOpenPrivacy={() => setLegalType("privacy")} />
    </div>
  );
}