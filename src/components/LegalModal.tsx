import { useEffect } from "react";
import { X, ShieldCheck, FileText, ArrowLeft, Mail, Phone } from "lucide-react";
import { CONTACT_EMAIL, CONTACT_PHONE, LOCATION } from "../data";

interface LegalModalProps {
  type: "privacy" | "terms" | null;
  onClose: () => void;
}

export function LegalModal({ type, onClose }: LegalModalProps) {
  useEffect(() => {
    if (!type) return;

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
  }, [type, onClose]);

  if (!type) return null;

  const isPrivacy = type === "privacy";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-amber-400/40 bg-cream-50 text-slate-900 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-maroon-900/15 bg-gradient-to-r from-maroon-950 via-maroon-900 to-maroon-950 px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/40">
              {isPrivacy ? <ShieldCheck size={20} /> : <FileText size={20} />}
            </span>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-200">
                Legal Document
              </span>
              <h3 className="font-display text-xl font-bold text-white">
                {isPrivacy ? "Privacy Policy" : "Terms of Service"}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-[15px] leading-relaxed text-slate-800">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-700">Family Cafe King Legal</span>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">Last updated: July 2026</p>
          </div>

          {isPrivacy ? (
            <div className="space-y-5">
              <p>
                This Privacy Policy explains how <b>Family Cafe King</b> (“we”, “our”, or “us”) collects, uses, and protects information when you visit our website, submit a franchise enquiry, or visit any of our outlets — <b>Chai Cafe King, Paan King, Lassi King, and Shake & Soda King</b>.
              </p>

              <div className="space-y-2">
                <h4 className="font-display text-lg font-bold text-maroon-950">1. Information We Collect</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li><b>Enquiry information:</b> When you submit a franchise enquiry form, we collect your name, phone number, city, preferred brand, and any message you send.</li>
                  <li><b>Communication data:</b> Records of calls, WhatsApp messages, and emails you exchange with our franchise onboarding team.</li>
                  <li><b>Usage data:</b> Basic analytics such as pages viewed, device type, referral source, and time spent on the site.</li>
                  <li><b>Cookies:</b> Small text files used to remember your preferences and improve site performance.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-display text-lg font-bold text-maroon-950">2. How We Use Your Information</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>To respond to your franchise enquiry with brand, investment and city-specific details.</li>
                  <li>To send you follow-up communication about the franchise process and next steps.</li>
                  <li>To improve our website, brand offerings, and franchise support programs.</li>
                  <li>To comply with legal, tax, and regulatory obligations in India.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-display text-lg font-bold text-maroon-950">3. How We Share Information</h4>
                <p>We do not sell your personal information. We may share limited data with:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Trusted service providers (hosting, CRM, communication tools) who process data on our behalf under strict confidentiality obligations.</li>
                  <li>Local franchise partners in your city, only after you have expressed interest in that specific city.</li>
                  <li>Government or regulatory authorities where required by Indian law.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-display text-lg font-bold text-maroon-950">4. Data Security</h4>
                <p>We use industry-standard technical and organizational measures to protect your data. However, no online transmission or storage system is 100% secure, so we cannot guarantee absolute security.</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-display text-lg font-bold text-maroon-950">5. Your Rights</h4>
                <p>
                  You can request access, correction, or deletion of your personal information at any time by writing to us at{" "}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="font-bold text-orange-700 underline">{CONTACT_EMAIL}</a>. You may also opt out of marketing communications by replying “STOP” to any message.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-display text-lg font-bold text-maroon-950">6. Third-Party Links</h4>
                <p>Our website may link to third-party platforms such as WhatsApp, Instagram, Facebook or LinkedIn. Their privacy practices are governed by their own policies.</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-display text-lg font-bold text-maroon-950">7. Children’s Privacy</h4>
                <p>Our services are intended for users aged 18 and above. We do not knowingly collect personal information from children.</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-display text-lg font-bold text-maroon-950">8. Changes to This Policy</h4>
                <p>We may update this policy from time to time. The revised version will be posted on this page with an updated date.</p>
              </div>

              <div className="rounded-2xl border border-maroon-900/15 bg-white p-5 space-y-2">
                <h4 className="font-display text-lg font-bold text-maroon-950">9. Contact Us</h4>
                <p className="text-sm font-medium">For any privacy-related questions or data removal requests:</p>
                <ul className="text-sm font-semibold space-y-1.5">
                  <li className="flex items-center gap-2"><Mail size={14} className="text-orange-700" /> <a href={`mailto:${CONTACT_EMAIL}`} className="hover:underline">{CONTACT_EMAIL}</a></li>
                  <li className="flex items-center gap-2"><Phone size={14} className="text-orange-700" /> <a href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`} className="hover:underline">{CONTACT_PHONE}</a></li>
                  <li>Address: {LOCATION}</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <p>
                These Terms of Service (“Terms”) govern your use of the Family Cafe King website and any franchise enquiry or partnership you initiate with us for our brands — <b>Chai Cafe King, Paan King, Lassi King, and Shake & Soda King</b>.
              </p>

              <div className="space-y-2">
                <h4 className="font-display text-lg font-bold text-maroon-950">1. Acceptance of Terms</h4>
                <p>By accessing this website or submitting an enquiry, you agree to be bound by these Terms and by our Privacy Policy. If you do not agree, please discontinue use of the site.</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-display text-lg font-bold text-maroon-950">2. Use of the Website</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>You must be at least 18 years old and legally capable of entering a business contract.</li>
                  <li>You may not use the site for any unlawful, misleading, or fraudulent purpose.</li>
                  <li>You may not attempt to disrupt or reverse-engineer any part of our services or infrastructure.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-display text-lg font-bold text-maroon-950">3. Franchise Enquiries</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Information shown on this site — including franchise investment, starter kit contents, and estimated timelines — is indicative and subject to final agreement.</li>
                  <li>All investment figures are subject to a signed franchise agreement. Nothing on this website constitutes a binding legal offer.</li>
                  <li>Final approval of a franchise partnership is at the sole discretion of Family Cafe King, based on site feasibility, background checks, and mutual fit.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-display text-lg font-bold text-maroon-950">4. Intellectual Property</h4>
                <p>All trademarks, logos, brand names, recipes, packaging designs, and content on this website are the exclusive property of Family Cafe King. You may not copy, reproduce, or use them without prior written permission.</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-display text-lg font-bold text-maroon-950">5. Third-Party Services</h4>
                <p>We use third-party services such as WhatsApp, email providers, and analytics tools. Their terms apply separately when you interact with those services.</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-display text-lg font-bold text-maroon-950">6. Payments & Refunds</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Franchise fees and starter kit payments are governed by the specific franchise agreement you sign with Family Cafe King.</li>
                  <li>Refunds, if applicable, are handled strictly as per the terms of that agreement.</li>
                  <li>Official bank details for franchise payments will be shared only through authorized channels of Family Cafe King.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-display text-lg font-bold text-maroon-950">7. Limitation of Liability</h4>
                <p>To the maximum extent permitted by law, Family Cafe King shall not be liable for indirect, incidental, or consequential damages arising from your use of this site or decisions made based on website information.</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-display text-lg font-bold text-maroon-950">8. Governing Law & Jurisdiction</h4>
                <p>These Terms shall be governed by the laws of India. Any legal dispute shall be subject to the exclusive jurisdiction of the courts in Varanasi, Uttar Pradesh.</p>
              </div>

              <div className="rounded-2xl border border-maroon-900/15 bg-white p-5 space-y-2">
                <h4 className="font-display text-lg font-bold text-maroon-950">9. Official Contact Information</h4>
                <ul className="text-sm font-semibold space-y-1.5">
                  <li className="flex items-center gap-2"><Mail size={14} className="text-orange-700" /> <a href={`mailto:${CONTACT_EMAIL}`} className="hover:underline">{CONTACT_EMAIL}</a></li>
                  <li className="flex items-center gap-2"><Phone size={14} className="text-orange-700" /> <a href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`} className="hover:underline">{CONTACT_PHONE}</a></li>
                  <li>Registered Address: {LOCATION}</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-slate-100 px-4 py-2 text-xs font-bold text-slate-900 hover:bg-slate-200"
          >
            <ArrowLeft size={14} /> Close Window
          </button>
          <span className="text-xs font-bold text-maroon-950">
            © {new Date().getFullYear()} Family Cafe King Group
          </span>
        </div>
      </div>
    </div>
  );
}
