import { useEffect, useState, type FormEvent } from "react";
import {
  X,
  MessageCircle,
  Award,
  CheckCircle2,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { waLink } from "../data";
import { saveTraining } from "../lib/database";

interface StaffTrainingModalProps {
  isOpen: boolean;
  initialScrollToForm?: boolean;
  onClose: () => void;
}

export function StaffTrainingModal({ isOpen, initialScrollToForm = false, onClose }: StaffTrainingModalProps) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    startDate: "Immediate",
    notes: "",
  });

  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    if (initialScrollToForm) {
      setTimeout(() => {
        const el = document.getElementById("staff-training-form");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }
  }, [isOpen, initialScrollToForm]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaveError("");

    if (form.name.trim().length < 2) {
      setSaveError("Please enter a valid full name.");
      return;
    }
    const cleanPhone = form.phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      setSaveError("Please enter a valid 10-digit mobile number.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      setSaveError("Please enter a valid email address.");
      return;
    }
    if (form.city.trim().length < 2) {
      setSaveError("Please enter a valid city / outlet location.");
      return;
    }

    setSaving(true);

    try {
      await saveTraining({
        name: form.name.trim(),
        phone: cleanPhone,
        email: form.email.trim(),
        city: form.city.trim(),
        startDate: form.startDate || "Immediate",
        notes: form.notes || "6-Month On-site Kitchen Handholding Requested",
        brand: "Staff Training & Support",
        budget: "₹1.5 Lakh (+ Trainer Expenses)",
        status: "New",
      });

      setSubmitted(true);
    } catch (err: any) {
      setSaveError(err?.message || "Failed to submit training booking. Please try again.");
    } finally {
      setSaving(false);
    }
  };
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

          {/* Training Menu Section (What we train about) */}
          <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-rose-500/5 p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-orange-700">
                  Master Training Curriculum
                </span>
                <h4 className="font-display text-xl font-bold text-maroon-950">
                  Menu: What We Train About
                </h4>
              </div>
              <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-1 text-xs font-bold text-amber-900">
                6 Categories
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {/* Paneer Items */}
              <div className="rounded-xl border border-maroon-900/10 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                  <h5 className="font-display text-sm font-bold text-maroon-950 uppercase tracking-wide">
                    Paneer Items
                  </h5>
                </div>
                <ul className="space-y-1 text-[13px] font-medium text-maroon-900/85">
                  <li className="flex items-center gap-1.5"><span className="text-amber-600 font-bold">1.</span> Kadhai Paneer</li>
                  <li className="flex items-center gap-1.5"><span className="text-amber-600 font-bold">2.</span> Shahi Paneer</li>
                  <li className="flex items-center gap-1.5"><span className="text-amber-600 font-bold">3.</span> Mattar Paneer</li>
                  <li className="flex items-center gap-1.5"><span className="text-amber-600 font-bold">4.</span> Palak Paneer</li>
                  <li className="flex items-center gap-1.5"><span className="text-amber-600 font-bold">5.</span> Masala Paneer</li>
                  <li className="flex items-center gap-1.5"><span className="text-amber-600 font-bold">6.</span> Paneer Do-Pyaaza</li>
                </ul>
              </div>

              {/* Mushroom Items */}
              <div className="rounded-xl border border-maroon-900/10 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                  <h5 className="font-display text-sm font-bold text-maroon-950 uppercase tracking-wide">
                    Mushroom Items
                  </h5>
                </div>
                <ul className="space-y-1 text-[13px] font-medium text-maroon-900/85">
                  <li className="flex items-center gap-1.5"><span className="text-orange-600 font-bold">1.</span> Mushroom Gravy</li>
                  <li className="flex items-center gap-1.5"><span className="text-orange-600 font-bold">2.</span> Masala Mushroom</li>
                  <li className="flex items-center gap-1.5"><span className="text-orange-600 font-bold">3.</span> Kadhai Mushroom</li>
                  <li className="flex items-center gap-1.5"><span className="text-orange-600 font-bold">4.</span> Shahi Mushroom</li>
                </ul>
              </div>

              {/* Dal Items */}
              <div className="rounded-xl border border-maroon-900/10 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                  <h5 className="font-display text-sm font-bold text-maroon-950 uppercase tracking-wide">
                    Dal Items
                  </h5>
                </div>
                <ul className="space-y-1 text-[13px] font-medium text-maroon-900/85">
                  <li className="flex items-center gap-1.5"><span className="text-yellow-600 font-bold">1.</span> Dal Tadka</li>
                  <li className="flex items-center gap-1.5"><span className="text-yellow-600 font-bold">2.</span> Dal Fry</li>
                  <li className="flex items-center gap-1.5"><span className="text-yellow-600 font-bold">3.</span> Dal Makhani</li>
                </ul>
              </div>

              {/* Complementary */}
              <div className="rounded-xl border border-maroon-900/10 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  <h5 className="font-display text-sm font-bold text-maroon-950 uppercase tracking-wide">
                    Complementary
                  </h5>
                </div>
                <ul className="space-y-1 text-[13px] font-medium text-maroon-900/85">
                  <li className="flex items-center gap-1.5"><span className="text-emerald-600 font-bold">1.</span> Chana Masala</li>
                  <li className="flex items-center gap-1.5"><span className="text-emerald-600 font-bold">2.</span> Mix-Veg</li>
                  <li className="flex items-center gap-1.5"><span className="text-emerald-600 font-bold">3.</span> Rajma</li>
                  <li className="flex items-center gap-1.5"><span className="text-emerald-600 font-bold">4.</span> Sev Bhaji</li>
                </ul>
              </div>

              {/* Rice Items */}
              <div className="rounded-xl border border-maroon-900/10 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-2 w-2 rounded-full bg-teal-500"></span>
                  <h5 className="font-display text-sm font-bold text-maroon-950 uppercase tracking-wide">
                    Rice Items
                  </h5>
                </div>
                <ul className="space-y-1 text-[13px] font-medium text-maroon-900/85">
                  <li className="flex items-center gap-1.5"><span className="text-teal-600 font-bold">1.</span> Steam Rice</li>
                  <li className="flex items-center gap-1.5"><span className="text-teal-600 font-bold">2.</span> Jeera Rice</li>
                  <li className="flex items-center gap-1.5"><span className="text-teal-600 font-bold">3.</span> Onion Rice</li>
                  <li className="flex items-center gap-1.5"><span className="text-teal-600 font-bold">4.</span> Pulao</li>
                </ul>
              </div>

              {/* Roti / Breads & Thali */}
              <div className="rounded-xl border border-maroon-900/10 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                  <h5 className="font-display text-sm font-bold text-maroon-950 uppercase tracking-wide">
                    Roti / Breads &amp; Thali
                  </h5>
                </div>
                <ul className="space-y-1 text-[13px] font-medium text-maroon-900/85">
                  <li className="flex items-center gap-1.5"><span className="text-rose-600 font-bold">•</span> Tawa Roti &amp; Lachha Paratha</li>
                  <li className="flex items-center gap-1.5"><span className="text-rose-600 font-bold">•</span> Aalu, Paneer &amp; Pyaaz Paratha</li>
                  <li className="flex items-center gap-1.5"><span className="text-rose-600 font-bold">•</span> Regular Thali</li>
                  <li className="flex items-center gap-1.5"><span className="text-rose-600 font-bold">•</span> Special Thali</li>
                  <li className="flex items-center gap-1.5"><span className="text-rose-600 font-bold">•</span> Maharaja Thali</li>
                </ul>
              </div>
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

          {/* Staff Training Direct Booking Form */}
          <div id="staff-training-form" className="rounded-3xl border-2 border-amber-400/50 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-rose-500/10 p-6 sm:p-8 shadow-lg">
            <div className="mb-6 flex items-center gap-3.5 border-b border-maroon-900/10 pb-4">
              <span className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700 text-white shadow-md">
                <CheckCircle2 size={24} />
              </span>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-700">
                  Instant Operational Reservation
                </span>
                <h4 className="font-display text-2xl font-black text-maroon-950">
                  Book Staff Training &amp; Support Program
                </h4>
              </div>
            </div>

            {submitted ? (
              <div className="grid place-items-center py-8 text-center">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-green-700 text-white shadow-lg">
                  <CheckCircle2 size={32} strokeWidth={3} />
                </div>
                <h3 className="mt-5 font-display text-2xl font-extrabold text-maroon-950">
                  Staff Training Program Reserved!
                </h3>
                <p className="mt-2 max-w-md text-[15px] font-semibold text-maroon-900 leading-relaxed">
                  Thank you! Your Staff Training &amp; Operational Support booking request has been stored in our system. Our Pan-India training head will contact you within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setSaveError("");
                  }}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-maroon-950 px-6 py-3 text-[14px] font-bold text-white hover:bg-maroon-900 shadow-md transition cursor-pointer"
                >
                  Submit another training booking
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {saveError && (
                  <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-bold text-rose-800">
                    {saveError}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-extrabold uppercase tracking-wider text-maroon-950">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value.replace(/[^a-zA-Z\s]/g, "") })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full rounded-xl border border-maroon-900/20 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-extrabold uppercase tracking-wider text-maroon-950">
                      Phone Number * (10 Digits)
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                      placeholder="e.g. 9876543210"
                      className="w-full rounded-xl border border-maroon-900/20 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-extrabold uppercase tracking-wider text-maroon-950">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value.trim() })}
                      placeholder="rahul@example.com"
                      className="w-full rounded-xl border border-maroon-900/20 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-extrabold uppercase tracking-wider text-maroon-950">
                      City / Outlet Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value.replace(/[^a-zA-Z\s,-]/g, "") })}
                      placeholder="e.g. Varanasi / Lucknow"
                      className="w-full rounded-xl border border-maroon-900/20 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-extrabold uppercase tracking-wider text-maroon-950">
                      Target Training Start Timeline
                    </label>
                    <select
                      value={form.startDate}
                      onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                      className="w-full rounded-xl border border-maroon-900/20 bg-white px-4 py-2.5 text-sm font-bold text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    >
                      <option value="Immediate">Immediate (Within 7 Days)</option>
                      <option value="1 Week">1 Week</option>
                      <option value="2 Weeks">2 Weeks</option>
                      <option value="3 Weeks">3 Weeks</option>
                      <option value="15 Days">15 Days</option>
                      <option value="1 Month">1 Month</option>
                      <option value="2 Months">2 Months</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-extrabold uppercase tracking-wider text-maroon-950">
                      Additional Requirements / Notes
                    </label>
                    <input
                      type="text"
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      placeholder="e.g. Number of kitchen staff, outlet size"
                      className="w-full rounded-xl border border-maroon-900/20 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-600 to-rose-700 px-6 py-4 text-base font-extrabold text-white shadow-lg shadow-orange-500/30 transition hover:brightness-110 disabled:opacity-50 cursor-pointer"
                  >
                    {saving ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> Saving Booking...
                      </>
                    ) : (
                      <>
                        Confirm Staff Training Booking <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
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
            <button
              onClick={() => {
                const el = document.getElementById("staff-training-form");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700 px-5 py-2.5 text-[13px] font-extrabold text-white shadow-md shadow-orange-500/30 transition hover:brightness-110 cursor-pointer"
            >
              Book Program Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
