import { useEffect, useState } from "react";
import { Cookie, Check, X, ShieldCheck } from "lucide-react";

interface CookieConsentProps {
  onOpenPrivacy?: () => void;
}

export function CookieBanner({ onOpenPrivacy }: CookieConsentProps) {
  const [show, setShow] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("fck_cookie_consent_v1");
      if (!consent) {
        // Delay 1s for visual effect
        const timer = setTimeout(() => setShow(true), 1000);
        return () => clearTimeout(timer);
      }
    } catch {
      setShow(true);
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem(
        "fck_cookie_consent_v1",
        JSON.stringify({ necessary: true, analytics: true, marketing: true, date: new Date().toISOString() })
      );
    } catch {
      // Ignore storage errors
    }
    setShow(false);
  };

  const handleSavePreferences = () => {
    try {
      localStorage.setItem(
        "fck_cookie_consent_v1",
        JSON.stringify({ necessary: true, analytics, marketing, date: new Date().toISOString() })
      );
    } catch {
      // Ignore storage errors
    }
    setShow(false);
  };

  const handleDeclineOptional = () => {
    try {
      localStorage.setItem(
        "fck_cookie_consent_v1",
        JSON.stringify({ necessary: true, analytics: false, marketing: false, date: new Date().toISOString() })
      );
    } catch {
      // Ignore storage errors
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-xl animate-fadeIn">
      <div className="rounded-3xl border border-amber-900/15 bg-cream-50/98 p-5 shadow-2xl backdrop-blur-xl sm:p-6 text-maroon-950">
        <div className="flex items-start gap-3.5">
          <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700 text-white shadow-md">
            <Cookie size={20} />
          </span>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-extrabold text-maroon-950">
                We value your privacy 🍪
              </h3>
              <button
                onClick={handleDeclineOptional}
                className="text-maroon-900/60 transition hover:text-maroon-950"
                aria-label="Close cookie banner"
              >
                <X size={18} />
              </button>
            </div>
            <p className="mt-1.5 text-[13px] font-medium leading-relaxed text-maroon-900">
              We use cookies to personalize content, analyze traffic, and enhance your website experience. Learn more in our{" "}
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

            {/* Expanded Preferences */}
            {preferencesOpen && (
              <div className="mt-4 space-y-2.5 rounded-2xl border border-maroon-900/10 bg-white/80 p-3.5 text-xs font-semibold">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-maroon-950">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    <span>Essential / Necessary Cookies</span>
                  </div>
                  <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-emerald-800">
                    Always Active
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-maroon-900/10 pt-2">
                  <span>Analytics & Performance</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={analytics}
                      onChange={(e) => setAnalytics(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-maroon-900/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between border-t border-maroon-900/10 pt-2">
                  <span>Marketing & Franchise Lead Attribution</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={marketing}
                      onChange={(e) => setMarketing(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-maroon-900/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-600"></div>
                  </label>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleAcceptAll}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700 px-4 py-2.5 text-[12.5px] font-extrabold text-white shadow-md hover:brightness-110"
              >
                <Check size={14} strokeWidth={3} /> Accept All
              </button>
              {preferencesOpen ? (
                <button
                  type="button"
                  onClick={handleSavePreferences}
                  className="rounded-xl border border-maroon-900/20 bg-white px-3.5 py-2.5 text-[12.5px] font-bold text-maroon-950 hover:bg-maroon-900/10"
                >
                  Save Preferences
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setPreferencesOpen(true)}
                  className="rounded-xl border border-maroon-900/20 bg-white px-3.5 py-2.5 text-[12.5px] font-bold text-maroon-950 hover:bg-maroon-900/10"
                >
                  Customize
                </button>
              )}
              <button
                type="button"
                onClick={handleDeclineOptional}
                className="rounded-xl px-3 py-2 text-[12px] font-bold text-maroon-900/70 hover:text-maroon-950"
              >
                Necessary Only
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
