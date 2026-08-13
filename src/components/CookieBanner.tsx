import { useEffect, useState } from "react";
import { Cookie, Check, ShieldCheck } from "lucide-react";
import { saveLead } from "../lib/database";

interface CookieConsentProps {
  onOpenPrivacy?: () => void;
}

export function CookieBanner({ onOpenPrivacy }: CookieConsentProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
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

  const detectDeviceInfo = () => {
    if (typeof window === "undefined") return "Desktop Browser";
    const ua = navigator.userAgent;
    let device = "Desktop Browser";
    if (/android/i.test(ua)) device = "Android Mobile";
    else if (/iphone|ipad|ipod/i.test(ua)) device = "iOS Mobile";
    else if (/macintosh/i.test(ua)) device = "Mac Desktop";
    else if (/windows/i.test(ua)) device = "Windows Desktop";

    return `${device} (${window.screen.width}x${window.screen.height})`;
  };

  const handleAcceptAll = async () => {
    const deviceInfo = detectDeviceInfo();
    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    try {
      localStorage.setItem(
        "fck_cookie_consent_v1",
        JSON.stringify({ necessary: true, analytics: true, marketing: true, date: new Date().toISOString() })
      );

      // Store visitor session lead telemetry into Dashboard
      await saveLead({
        name: `Cookie Visitor (${deviceInfo.split(" ")[0]})`,
        phone: "+91 99999 00000",
        email: "cookie.visitor@familycafeking.com",
        city: "Live Site Visitor",
        brand: "Family Cafe King",
        budget: `Accepted All Cookies (${deviceInfo})`,
      });
    } catch (err) {
      console.warn("Consent storage error:", err);
    }
    setShow(false);
  };

  const handleNecessaryOnly = async () => {
    const deviceInfo = detectDeviceInfo();

    try {
      localStorage.setItem(
        "fck_cookie_consent_v1",
        JSON.stringify({ necessary: true, analytics: false, marketing: false, date: new Date().toISOString() })
      );

      // Store necessary visitor session telemetry into Dashboard
      await saveLead({
        name: `Cookie Visitor (Necessary)`,
        phone: "+91 99999 00000",
        email: "necessary.visitor@familycafeking.com",
        city: "Live Site Visitor",
        brand: "Family Cafe King",
        budget: `Necessary Only (${deviceInfo})`,
      });
    } catch (err) {
      console.warn("Consent storage error:", err);
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50 mx-auto max-w-2xl animate-fadeIn sm:bottom-8">
      <div className="rounded-3xl border border-amber-900/20 bg-cream-50/98 p-6 shadow-[0_20px_60px_-15px_rgba(41,8,8,0.4)] backdrop-blur-2xl sm:p-8 text-maroon-950">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <span className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700 text-white shadow-lg shadow-orange-500/20">
            <Cookie size={24} />
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-xl sm:text-2xl font-black text-maroon-950 tracking-tight">
              We value your privacy 🍪
            </h3>
            <p className="mt-2 text-[14.5px] sm:text-[15.5px] font-semibold leading-relaxed text-maroon-900">
              We use cookies to personalize content, analyze traffic, and enhance your website experience. Learn more in our{" "}
              {onOpenPrivacy ? (
                <button
                  type="button"
                  onClick={onOpenPrivacy}
                  className="font-extrabold underline text-amber-900 hover:text-orange-700 cursor-pointer"
                >
                  Privacy Policy
                </button>
              ) : (
                <span className="font-extrabold underline text-amber-900">Privacy Policy</span>
              )}
              .
            </p>

            {/* Actions: Only Accept All + Necessary Only */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleAcceptAll}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-600 to-rose-700 px-6 py-3.5 text-[14.5px] font-black text-white shadow-lg shadow-orange-500/30 hover:brightness-110 transition-all cursor-pointer"
              >
                <Check size={16} strokeWidth={3} /> Accept All
              </button>
              <button
                type="button"
                onClick={handleNecessaryOnly}
                className="rounded-2xl border border-maroon-900/25 bg-white px-5 py-3.5 text-[14px] font-bold text-maroon-950 hover:bg-maroon-900/10 transition-all cursor-pointer"
              >
                <ShieldCheck size={16} className="inline mr-1.5 text-emerald-600" /> Necessary Only
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

