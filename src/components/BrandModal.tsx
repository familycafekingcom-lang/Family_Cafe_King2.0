import { useEffect } from "react";
import {
  X,
  MessageCircle,
  Phone,
  MapPin,
  Ruler,
  Check,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import type { BrandData } from "../data";
import {
  CONTACT_PHONE,
  waLink,
  FRANCHISEE_RESPONSIBILITIES,
} from "../data";

interface BrandModalProps {
  brand: BrandData | null;
  onClose: () => void;
  onSelectLead?: (brandName: string) => void;
}

export function BrandModal({ brand, onClose, onSelectLead }: BrandModalProps) {
  // Always call hooks at top level unconditionally
  useEffect(() => {
    if (!brand) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    // Save previous overflow style and disable background scrolling
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow || "";
    };
  }, [brand, onClose]);

  if (!brand) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="brand-modal-title"
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-amber-400/30 bg-cream-50 text-maroon-900 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="relative flex items-center justify-between border-b border-maroon-900/10 bg-gradient-to-r from-maroon-900 via-maroon-800 to-maroon-900 px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/40">
              <Sparkles size={18} />
            </span>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-200/90">
                Franchise Deck
              </span>
              <h3 id="brand-modal-title" className="font-display text-lg font-bold leading-none text-white">
                {brand.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close brand details modal"
            className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 hover:scale-105"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
          {/* Brand Intro Block */}
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="grid h-24 w-24 flex-shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-rose-500/10 p-3 border border-maroon-900/15 shadow-md">
              <img
                src={brand.logo}
                alt={`${brand.name} Official Logo`}
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-maroon-900/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-maroon-900">
                {brand.tag}
              </div>
              <h2 className="mt-2 font-display text-2xl font-bold text-maroon-900 sm:text-3xl">
                {brand.name}
              </h2>
              <p className="text-[14px] font-medium text-amber-800 italic">"{brand.tagline}"</p>
              <p className="mt-2 text-[14.5px] leading-relaxed text-maroon-900/85">
                {brand.long}
              </p>
            </div>
          </div>

          {/* Investment Band */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-100/80 to-orange-100/60 p-4 text-center shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-maroon-900/80">
                Franchise Investment
              </span>
              <div className="mt-1 font-display text-2xl font-bold text-maroon-900 sm:text-3xl">
                {brand.investment.total}
              </div>
              <span className="text-[11.5px] font-semibold text-rose-800">
                {brand.investment.gstNote}
              </span>
            </div>

            <div className="rounded-2xl border border-maroon-900/10 bg-white p-4 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-maroon-900/70">
                Starter Kit Includes
              </span>
              <div className="mt-1 font-display text-xl font-bold text-maroon-900 sm:text-2xl">
                {brand.investment.starterKit}
              </div>
              <span className="text-[11px] text-maroon-700/80">Full raw material & kit</span>
            </div>

            <div className="rounded-2xl border border-maroon-900/10 bg-white p-4 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-maroon-900/70">
                One-Time Brand Fee
              </span>
              <div className="mt-1 font-display text-xl font-bold text-maroon-900 sm:text-2xl">
                {brand.investment.brandFee}
              </div>
              <span className="text-[11px] text-maroon-700/80">Franchise license fee</span>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-3 rounded-2xl border border-maroon-900/10 bg-white/90 p-4 text-center sm:grid-cols-4">
            {brand.stats.map((st) => (
              <div key={st.label}>
                <div className="font-display text-xl font-bold text-maroon-900">{st.value}</div>
                <div className="text-[11px] font-medium uppercase tracking-wider text-maroon-800/80">
                  {st.label}
                </div>
              </div>
            ))}
          </div>

          {/* Starter Kit Cards */}
          <div>
            <div className="mb-4">
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-orange-700">
                Starter Kit Breakdown
              </span>
              <h4 className="font-display text-xl font-bold text-maroon-900">
                Everything You Need to Launch Your Business
              </h4>
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              {brand.starterKit.map((item, idx) => (
                <div
                  key={item.title}
                  className="relative flex items-start gap-3.5 rounded-2xl border border-maroon-900/10 bg-white p-4"
                >
                  <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-[12px] font-bold text-white shadow-sm">
                    0{idx + 1}
                  </span>
                  <div>
                    <h5 className="font-display text-[15px] font-bold text-maroon-900">
                      {item.title}
                    </h5>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-maroon-900/80">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Menu Sections (No Prices, clean chips) */}
          <div className="rounded-3xl border border-maroon-900/10 bg-white p-6">
            <div className="mb-4">
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-orange-700">
                Complete Menu
              </span>
              <h4 className="font-display text-xl font-bold text-maroon-900">
                {brand.menuHeader}
              </h4>
            </div>

            <div className="space-y-4">
              {brand.menu.map((sec) => (
                <div key={sec.section}>
                  <h5 className="text-[13px] font-bold uppercase tracking-wider text-amber-900/90 mb-2">
                    {sec.section}
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {sec.items.map((it) => (
                      <span
                        key={it}
                        className="rounded-full border border-maroon-900/15 bg-cream-50 px-3.5 py-1.5 text-[13px] font-semibold text-maroon-900 shadow-2xs"
                      >
                        {it}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ideal Partner Requirements */}
          <div className="rounded-3xl border border-maroon-900/10 bg-gradient-to-br from-cream-100/80 to-cream-50 p-6 space-y-4">
            <h4 className="font-display text-lg font-bold text-maroon-900">
              Ideal Partner Requirements
            </h4>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-2xl border border-maroon-900/10 bg-white p-3.5">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/15 text-amber-800">
                  <Ruler size={18} />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase text-maroon-700/80">Space Needed</div>
                  <div className="font-display text-[15px] font-bold text-maroon-900">
                    {brand.space}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-maroon-900/10 bg-white p-3.5">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/15 text-emerald-800">
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase text-maroon-700/80">Ideal Location</div>
                  <div className="font-display text-[15px] font-bold text-maroon-900">
                    {brand.location}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3">
              <h5 className="text-[13px] font-bold uppercase tracking-wider text-maroon-900">
                Franchisee Responsibilities
              </h5>
              <ul className="mt-2 space-y-1.5">
                {FRANCHISEE_RESPONSIBILITIES.map((r, k) => (
                  <li key={k} className="flex items-start gap-2 text-[13.5px] text-maroon-900/85">
                    <span className="mt-1 grid h-4 w-4 flex-shrink-0 place-items-center rounded-full bg-emerald-600 text-white">
                      <Check size={10} strokeWidth={3} />
                    </span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Sticky Footer CTAs */}
        <div className="flex flex-col gap-2 border-t border-maroon-900/10 bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <a
              href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 rounded-full border border-maroon-900/20 bg-cream-50 px-4 py-2.5 text-[13px] font-bold text-maroon-900 hover:bg-cream-100"
            >
              <Phone size={14} /> {CONTACT_PHONE}
            </a>
            <a
              href={waLink(brand.name)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 text-[13px] font-bold text-white shadow hover:bg-emerald-700"
            >
              <MessageCircle size={14} /> WhatsApp Franchise
            </a>
          </div>

          <button
            onClick={() => {
              onClose();
              if (onSelectLead) onSelectLead(brand.name);
            }}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700 px-6 py-2.5 text-[13.5px] font-bold text-white shadow-lg hover:shadow-orange-500/40"
          >
            Apply for {brand.name} <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
