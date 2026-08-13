import { useEffect } from "react";
import {
  X,
  MessageCircle,
  Phone,
  Check,
  Sparkles,
  Award,
  Coffee,
  TrendingUp,
  Crown,
  Calendar,
  DollarSign,
  UtensilsCrossed,
  ShieldCheck,
} from "lucide-react";
import { CONTACT_PHONE, waLink } from "../data";

interface StaffTrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StaffTrainingModal({ isOpen, onClose }: StaffTrainingModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow || "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-amber-400/30 bg-cream-50 text-maroon-900 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="relative flex items-center justify-between border-b border-maroon-900/10 bg-gradient-to-r from-maroon-900 via-maroon-800 to-maroon-900 px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/40">
              <Award size={18} />
            </span>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-200/90">
                Operational Support Program
              </span>
              <h3 className="font-display text-lg font-bold leading-none text-white">
                Staff Training &amp; Operational Backing
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close training modal"
            className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 hover:scale-105 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
          {/* Header Banner */}
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="grid h-24 w-24 flex-shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700 text-white shadow-lg shadow-orange-500/25 p-3">
              <Award size={44} strokeWidth={2} />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 border border-emerald-900/20 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">
                Pan-India On-Site Support
              </div>
              <h2 className="mt-2 font-display text-2xl font-bold text-maroon-950 sm:text-3xl">
                Staff Training &amp; Operational Support
              </h2>
              <p className="text-[14.5px] font-bold text-amber-900 mt-1">
                Food Training Support (Pan India) — Complete Master Recipe &amp; SOP Handholding
              </p>
              <p className="mt-2 text-[14.5px] leading-relaxed text-maroon-900/85 font-medium">
                We assign a dedicated senior master chef and kitchen operational trainer to visit your hotel / outlet site for 6 full months. Your entire local kitchen staff is trained in exact recipe standardisation, inventory controls, and food preparation SOPs.
              </p>
            </div>
          </div>

          {/* Investment & Program Summary Bar */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-100/80 to-orange-100/60 p-4 text-center shadow-sm">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-maroon-900/80">
                Initial Training Charge
              </span>
              <div className="mt-1 font-display text-2xl font-black text-maroon-950 sm:text-3xl">
                ₹1.5 Lakh
              </div>
              <span className="text-[11.5px] font-semibold text-rose-800">
                + Trainer Expenses (Travel, Stay &amp; Food)
              </span>
            </div>

            <div className="rounded-2xl border border-maroon-900/10 bg-white p-4 text-center">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-maroon-900/70">
                Program Duration
              </span>
              <div className="mt-1 font-display text-xl font-bold text-maroon-950 sm:text-2xl">
                6 Months
              </div>
              <span className="text-[11.5px] text-maroon-700/80 font-semibold">Continuous Hotel Visit Support</span>
            </div>

            <div className="rounded-2xl border border-maroon-900/10 bg-white p-4 text-center">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-maroon-900/70">
                Covered Menu Scope
              </span>
              <div className="mt-1 font-display text-xl font-bold text-maroon-950 sm:text-2xl">
                3 Major Categories
              </div>
              <span className="text-[11.5px] text-maroon-700/80 font-semibold">Veg, Fast Food &amp; Mocktails</span>
            </div>
          </div>

          {/* Key Program Pillars */}
          <div>
            <div className="mb-4">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-orange-700">
                Program Coverage &amp; Deliverables
              </span>
              <h4 className="font-display text-xl font-bold text-maroon-950">
                Comprehensive On-Site Operational Training
              </h4>
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div className="relative flex items-start gap-3.5 rounded-2xl border border-maroon-900/10 bg-white p-4">
                <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl bg-amber-500/20 text-amber-700 font-bold text-sm">
                  01
                </span>
                <div>
                  <h5 className="font-display text-[15px] font-bold text-maroon-950">
                    Food Type / Category Coverage
                  </h5>
                  <p className="mt-1 text-[13px] leading-relaxed text-maroon-900/80 font-medium">
                    Covers <b>Only Veg &amp; Indian dishes</b>, <b>Fast Food</b> (Burgers, Sandwiches, Fries, Pizzas), and <b>Mocktails &amp; Beverages</b>.
                  </p>
                </div>
              </div>

              <div className="relative flex items-start gap-3.5 rounded-2xl border border-maroon-900/10 bg-white p-4">
                <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl bg-orange-500/20 text-orange-700 font-bold text-sm">
                  02
                </span>
                <div>
                  <h5 className="font-display text-[15px] font-bold text-maroon-950">
                    6 Months Hotel Visit Handholding
                  </h5>
                  <p className="mt-1 text-[13px] leading-relaxed text-maroon-900/80 font-medium">
                    Trainer works directly inside your kitchen to train local cooks, establish kitchen workflow, and ensure exact taste consistency.
                  </p>
                </div>
              </div>

              <div className="relative flex items-start gap-3.5 rounded-2xl border border-maroon-900/10 bg-white p-4">
                <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl bg-emerald-500/20 text-emerald-700 font-bold text-sm">
                  03
                </span>
                <div>
                  <h5 className="font-display text-[15px] font-bold text-maroon-950">
                    Standard Operating Procedures (SOPs)
                  </h5>
                  <p className="mt-1 text-[13px] leading-relaxed text-maroon-900/80 font-medium">
                    Master recipe proportion cards, prep timers, portion controls, and hygiene protocols supplied to eliminate food wastage.
                  </p>
                </div>
              </div>

              <div className="relative flex items-start gap-3.5 rounded-2xl border border-maroon-900/10 bg-white p-4">
                <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl bg-rose-500/20 text-rose-700 font-bold text-sm">
                  04
                </span>
                <div>
                  <h5 className="font-display text-[15px] font-bold text-maroon-950">
                    Complete Costing &amp; Expense Breakdown
                  </h5>
                  <p className="mt-1 text-[13px] leading-relaxed text-maroon-900/80 font-medium">
                    ₹1.5 Lakh fixed training fee + actual travel expenses of trainer + on-site food &amp; lodging provided by franchisee.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-maroon-900/10 bg-cream-100/70 px-6 py-4 sm:flex-row">
          <div className="text-center sm:text-left">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-maroon-800">
              Ready to Book Staff Training?
            </span>
            <p className="text-[13.5px] font-bold text-maroon-950">
              Connect directly with our Pan-India Operational Desk
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href={waLink("Staff Training & Support Inquiry")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-600 px-4 py-2.5 text-[13px] font-bold text-white shadow-md transition hover:bg-emerald-500 cursor-pointer"
            >
              <MessageCircle size={15} /> WhatsApp Support
            </a>
            <a
              href="#lead"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700 px-5 py-2.5 text-[13px] font-extrabold text-white shadow-md shadow-orange-500/30 transition hover:brightness-110 cursor-pointer"
            >
              Book Program Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
