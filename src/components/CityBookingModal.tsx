import { useEffect, useState, type FormEvent } from "react";
import { X, MapPin, Sparkles, Check, Loader2, ArrowRight } from "lucide-react";
import { BRANDS } from "../data";
import { saveBooking, saveLead } from "../lib/database";

interface CityBookingModalProps {
  isOpen: boolean;
  initialCity?: string;
  initialBrand?: string;
  onClose: () => void;
}

export function CityBookingModal({ isOpen, initialCity = "", initialBrand = "", onClose }: CityBookingModalProps) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: initialCity || "",
    brand: initialBrand || BRANDS[0].name,
    budget: "₹3 - 5 Lakhs",
    notes: "",
  });

  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (initialCity) setForm((f) => ({ ...f, city: initialCity }));
    if (initialBrand) setForm((f) => ({ ...f, brand: initialBrand }));
  }, [initialCity, initialBrand]);

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaveError("");

    if (form.name.trim().length < 2) {
      setSaveError("Please enter a valid full name.");
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
      setSaveError("Please enter a valid city or location name.");
      return;
    }

    setSaving(true);

    try {
      await Promise.all([
        saveBooking({
          name: form.name.trim(),
          phone: cleanPhone,
          email: form.email.trim(),
          city: form.city.trim(),
          brand: form.brand,
          budget: form.budget,
          notes: form.notes ? `City Territory Booking for ${form.city}: ${form.notes}` : `City Territory Booking Request for ${form.city}`,
        }),
        saveLead({
          name: form.name.trim(),
          phone: cleanPhone,
          email: form.email.trim(),
          city: form.city.trim() || "City Booking",
          brand: form.brand,
          budget: form.budget,
        }),
      ]);

      setSubmitted(true);
    } catch (err: any) {
      setSaveError(err?.message || "Failed to submit city booking. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setSaveError("");
    setForm({
      name: "",
      phone: "",
      email: "",
      city: initialCity || "",
      brand: BRANDS[0].name,
      budget: "₹3 - 5 Lakhs",
      notes: "",
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-amber-400/40 bg-[#FAEBD6] text-slate-900 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-maroon-900/15 bg-gradient-to-r from-maroon-950 via-maroon-900 to-maroon-950 px-6 py-4.5 text-white">
          <div className="flex items-center gap-3">
            <span className="relative grid h-11 w-11 flex-shrink-0 place-items-center overflow-hidden rounded-2xl border border-amber-400/30 bg-white p-1 shadow-md">
              <img
                src="https://customer-assets-m6fa6gv7.emergentagent.net/job_5c36eac6-4afa-404a-9f8a-3a2a73a148f4/artifacts/t8gmidb5_FCK%20LOGO.png"
                alt="Family Cafe King Logo"
                className="h-full w-full object-contain rounded-xl"
              />
            </span>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-amber-300">
                Exclusive Territory Protection
              </span>
              <h3 className="font-display text-lg font-bold text-white sm:text-xl">
                Book Your City Franchise
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-amber-200 transition hover:bg-white/20 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 sm:p-8">
          {submitted ? (
            <div className="grid place-items-center py-8 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-green-700 text-white shadow-lg">
                <Check size={32} strokeWidth={3} />
              </div>
              <h3 className="mt-5 font-display text-2xl font-extrabold text-maroon-950">
                City Booking Reserved!
              </h3>
              <p className="mt-2 max-w-md text-[15px] font-semibold text-slate-800 leading-relaxed">
                Thank you! Territory booking request has been received.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <button
                  onClick={handleReset}
                  className="rounded-full bg-maroon-950 px-6 py-3 text-[13.5px] font-bold text-white hover:bg-maroon-900 transition"
                >
                  Book another city
                </button>
                <button
                  onClick={onClose}
                  className="rounded-full border border-maroon-950/20 bg-white px-6 py-3 text-[13.5px] font-bold text-maroon-950 hover:bg-slate-50 transition"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-[13px] font-semibold text-maroon-900 flex items-start gap-2.5">
                <Sparkles size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <span>
                  Reserve exclusive multi-brand franchise rights for <b>{form.city || "your target city"}</b>. Instant CRM logging & priority onboarding.
                </span>
              </div>

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
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                      setForm({ ...form, name: val });
                    }}
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
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setForm({ ...form, phone: val });
                    }}
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
                    City / Target Location *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={form.city}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^a-zA-Z\s,-]/g, "");
                        setForm({ ...form, city: val });
                      }}
                      placeholder="e.g. Lucknow, Varanasi, Jaipur"
                      className="w-full rounded-xl border border-maroon-900/20 bg-white pl-9 pr-4 py-2.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                    <MapPin size={16} className="absolute left-3 top-3 text-amber-700" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-extrabold uppercase tracking-wider text-maroon-950">
                    Franchise Brand
                  </label>
                  <select
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    className="w-full rounded-xl border border-maroon-900/20 bg-white px-4 py-2.5 text-sm font-bold text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  >
                    {BRANDS.map((b) => (
                      <option key={b.key} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-extrabold uppercase tracking-wider text-maroon-950">
                    Investment Budget
                  </label>
                  <select
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                    className="w-full rounded-xl border border-maroon-900/20 bg-white px-4 py-2.5 text-sm font-bold text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  >
                    <option value="₹1 - 3 Lakhs">₹1 - 3 Lakhs</option>
                    <option value="₹3 - 5 Lakhs">₹3 - 5 Lakhs</option>
                    <option value="₹5 - 10 Lakhs">₹5 - 10 Lakhs</option>
                    <option value="₹10 - 15 Lakhs+">₹10 - 15 Lakhs+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-extrabold uppercase tracking-wider text-maroon-950">
                  Additional Notes / Proposed Location (Optional)
                </label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="e.g. Have a 200 sq.ft shop in main market area..."
                  className="w-full rounded-xl border border-maroon-900/20 bg-white px-4 py-2 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-orange-500/25 transition hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Reserving City Territory...
                    </>
                  ) : (
                    <>
                      Confirm City Booking <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
