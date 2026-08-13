import { useEffect, useState } from "react";
import { Cookie, Check, ShieldCheck, Smartphone, MapPin, Mail, Phone, Lock } from "lucide-react";
import { saveLead } from "../lib/database";

interface CookieConsentProps {
  onOpenPrivacy?: () => void;
}

export function CookieBanner({ onOpenPrivacy }: CookieConsentProps) {
  const [show, setShow] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");

  const [deviceInfo, setDeviceInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Detect user device and screen info
    const ua = navigator.userAgent;
    let dev = "Desktop";
    if (/android/i.test(ua)) dev = "Android Mobile";
    else if (/iphone|ipad|ipod/i.test(ua)) dev = "iOS Mobile";
    else if (/mobile/i.test(ua)) dev = "Mobile Device";
    
    setDeviceInfo(`${dev} (${window.screen.width}x${window.screen.height})`);

    try {
      const consent = localStorage.getItem("fck_cookie_consent_v1");
      if (!consent) {
        const timer = setTimeout(() => setShow(true), 800);
        return () => clearTimeout(timer);
      }
    } catch {
      setShow(true);
    }
  }, []);

  const handleConsentAction = async (consentType: "Accept All" | "Necessary Only") => {
    if (!phone.trim() || phone.trim().length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    const leadPayload = {
      name: `Cookie Visitor (${consentType})`,
      phone: phone.trim(),
      email: email.trim() || "N/A",
      city: city.trim() || "N/A",
      brand: "Family Cafe King Group",
      budget: `Consent: ${consentType} | Device: ${deviceInfo}`,
    };

    try {
      // Save lead directly to MongoDB / Dashboard
      await saveLead(leadPayload);

      // Save cookie consent record in localStorage
      localStorage.setItem(
        "fck_cookie_consent_v1",
        JSON.stringify({
          necessary: true,
          analytics: consentType === "Accept All",
          marketing: consentType === "Accept All",
          date: new Date().toISOString(),
          phone: phone.trim(),
          device: deviceInfo,
        })
      );
    } catch (err) {
      console.warn("Consent lead save fallback:", err);
    } finally {
      setSubmitting(false);
      setShow(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-2xl rounded-3xl border-2 border-amber-400/40 bg-cream-50 p-6 sm:p-8 shadow-2xl text-maroon-950 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Title */}
        <div className="flex items-center gap-3 border-b border-maroon-900/15 pb-4">
          <span className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700 text-white shadow-lg">
            <Cookie size={24} />
          </span>
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">
              <ShieldCheck size={13} /> Privacy &amp; Cookie Consent
            </span>
            <h3 className="font-display text-2xl font-black text-maroon-950 sm:text-3xl mt-0.5">
              We value your privacy 🍪
            </h3>
          </div>
        </div>

        <p className="mt-3 text-[14px] font-semibold leading-relaxed text-maroon-900">
          We use cookies to personalize content, analyze traffic, and enhance your website experience. Enter your details below to activate cookie preferences and connect with our franchise team. Learn more in our{" "}
          {onOpenPrivacy ? (
            <button
              type="button"
              onClick={onOpenPrivacy}
              className="font-bold underline text-amber-900 hover:text-orange-700 cursor-pointer"
            >
              Privacy Policy
            </button>
          ) : (
            <span className="font-bold underline text-amber-900">Privacy Policy</span>
          )}
          .
        </p>

        {/* Input Fields Form for Dashboard Store */}
        <div className="mt-5 space-y-3.5 rounded-2xl border border-maroon-900/15 bg-white/90 p-4 sm:p-5 shadow-inner">
          <div className="flex items-center justify-between text-xs font-bold text-maroon-900 uppercase tracking-wider border-b border-maroon-900/10 pb-2">
            <span>Enter Visitor Details (Stored to Admin Dashboard)</span>
            <span className="text-[11px] text-amber-900 flex items-center gap-1">
              <Lock size={12} /> Secure 256-Bit
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Phone */}
            <div>
              <label className="block text-[11.5px] font-extrabold uppercase text-maroon-950 mb-1">
                Mobile Number <span className="text-rose-600">*</span>
              </label>
              <div className="relative flex items-center">
                <Phone size={16} className="absolute left-3.5 text-orange-700" />
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-maroon-900/20 bg-cream-50/50 pl-10 pr-3.5 py-2.5 text-[14px] font-bold text-maroon-950 placeholder-maroon-900/40 outline-none focus:border-orange-600 focus:bg-white"
                />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-[11.5px] font-extrabold uppercase text-maroon-950 mb-1">
                Your City
              </label>
              <div className="relative flex items-center">
                <MapPin size={16} className="absolute left-3.5 text-orange-700" />
                <input
                  type="text"
                  placeholder="e.g. Mumbai, Lucknow"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border border-maroon-900/20 bg-cream-50/50 pl-10 pr-3.5 py-2.5 text-[14px] font-bold text-maroon-950 placeholder-maroon-900/40 outline-none focus:border-orange-600 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[11.5px] font-extrabold uppercase text-maroon-950 mb-1">
              Email Address (Optional)
            </label>
            <div className="relative flex items-center">
              <Mail size={16} className="absolute left-3.5 text-orange-700" />
              <input
                type="email"
                placeholder="yourname@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-maroon-900/20 bg-cream-50/50 pl-10 pr-3.5 py-2.5 text-[14px] font-bold text-maroon-950 placeholder-maroon-900/40 outline-none focus:border-orange-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Detected Device Tag */}
          <div className="flex items-center gap-2 pt-1 text-[11.5px] font-bold text-maroon-800/80">
            <Smartphone size={14} className="text-emerald-700" />
            <span>Detected Device: <span className="text-maroon-950 font-extrabold">{deviceInfo}</span></span>
          </div>
        </div>

        {errorMsg && (
          <p className="mt-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-bold text-rose-700">
            ⚠️ {errorMsg}
          </p>
        )}

        {/* Action Buttons: Only Accept All & Necessary Only */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleConsentAction("Necessary Only")}
            className="w-full sm:w-auto rounded-2xl border border-maroon-900/20 bg-white px-5 py-3.5 text-[13.5px] font-extrabold text-maroon-950 hover:bg-maroon-900/10 transition disabled:opacity-50 cursor-pointer"
          >
            Necessary Only
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleConsentAction("Accept All")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700 px-7 py-3.5 text-[14px] font-black text-white shadow-lg shadow-orange-500/30 hover:brightness-110 transition disabled:opacity-50 cursor-pointer"
          >
            <Check size={16} strokeWidth={3} /> Accept All &amp; Save to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
