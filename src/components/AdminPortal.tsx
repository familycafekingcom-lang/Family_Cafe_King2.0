import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Edit3,
  Filter,
  Inbox,
  Loader2,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Sliders,
  Sparkles,
  Sun,
  Moon,
  Trash2,
  TrendingUp,
  Users,
  Eye,
  EyeOff,
  Save,
  XCircle,
} from "lucide-react";
import {
  allRequestsToCsv,
  bookingsToCsv,
  clearAllDemoLeads,
  contactsToCsv,
  DEFAULT_SLIDES,
  DEFAULT_UPCOMING,
  deleteBookingRecord,
  deleteLaunch,
  deleteLead,
  deleteSlide,
  deleteTrainingRecord,
  downloadCsvFile,
  getVisitorStats,
  listBookings,
  listContacts,
  deleteContactRecord,
  listLaunches,
  listLeads,
  listSlides,
  listTraining,
  saveLaunch,
  saveSlide,
  seedDefaultSlides,
  signInAdmin,
  trainingsToCsv,
  updateLaunch,
  updateLead,
  updateSlide,
  updateTrainingRecord,
  type LaunchRecord,
  type LeadRecord,
  type LeadStatus,
  type SlideRecord,
  type TrainingRecord,
  type VisitorStats,
} from "../lib/database";
import {
  apiDeleteContact,
  apiGetContacts,
  checkBackendHealth,
  type MernBooking,
  type MernContact,
} from "../lib/api";

const LEAD_STATUSES: LeadStatus[] = ["New", "Contacted", "Interested", "Converted", "Lost"];

interface AdminSession {
  accessToken: string;
  email: string;
  mode: "mern" | "local";
}

const statusClass = (status: LeadStatus) => {
  switch (status) {
    case "New":
      return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    case "Contacted":
      return "bg-sky-500/10 text-sky-400 border-sky-500/30";
    case "Interested":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    case "Converted":
      return "bg-green-500/20 text-green-300 border-green-500/40 font-black";
    case "Lost":
      return "bg-rose-500/10 text-rose-400 border-rose-500/30";
  }
};

export type DashboardMood = "night" | "morning";

export function AdminPortal() {
  const [session, setSession] = useState<AdminSession | null>(() => {
    const raw = window.sessionStorage.getItem("fck_admin_session");
    try {
      return raw ? (JSON.parse(raw) as AdminSession) : null;
    } catch {
      return null;
    }
  });

  const [mood, setMood] = useState<DashboardMood>(() => {
    try {
      const saved = window.localStorage.getItem("fck_dashboard_mood");
      return saved === "morning" || saved === "night" ? saved : "night";
    } catch {
      return "night";
    }
  });

  const toggleMood = () => {
    const next = mood === "night" ? "morning" : "night";
    setMood(next);
    try {
      window.localStorage.setItem("fck_dashboard_mood", next);
    } catch {
      // Ignore storage errors
    }
  };

  const isNight = mood === "night";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<"overview" | "leads" | "training" | "launches" | "slides" | "bookings" | "contacts">("overview");
  const [isMernOnline, setIsMernOnline] = useState<boolean | null>(null);

  const [visitorStats, setVisitorStats] = useState<VisitorStats>(() => getVisitorStats());

  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [trainings, setTrainings] = useState<TrainingRecord[]>([]);
  const [launches, setLaunches] = useState<LaunchRecord[]>([]);
  const [slides, setSlides] = useState<SlideRecord[]>([]);
  const [bookings, setBookings] = useState<MernBooking[]>([]);
  const [contacts, setContacts] = useState<MernContact[]>([]);

  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState("");
  const [query, setQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState("All brands");
  const [statusFilter, setStatusFilter] = useState("All statuses");

  const [launchForm, setLaunchForm] = useState({
    city: "",
    brand: "Family Cafe King",
    date_text: "",
    image_data: DEFAULT_UPCOMING[0].image_data,
    tag: "Coming Soon",
    accent: "#8C1F28",
  });

  const [editingLaunch, setEditingLaunch] = useState<LaunchRecord | null>(null);

  const [slideForm, setSlideForm] = useState({
    title: "",
    subtitle: "",
    brand_name: "Family Cafe King",
    badge_text: "350+ Franchises All Over India",
    image_url: DEFAULT_SLIDES[0].image_url,
    price_display: "₹5 - 15 Lakhs",
    space_req: "150 - 500 sq.ft",
    cta_text: "Apply for Franchise",
    cta_link: "#lead",
    accent_color: "#8C1F28",
    is_active: true,
    order: 0,
  });

  const [editingSlide, setEditingSlide] = useState<SlideRecord | null>(null);

  const checkHealth = useCallback(async () => {
    const healthy = await checkBackendHealth();
    setIsMernOnline(healthy);
  }, []);

  const loadData = useCallback(async () => {
    if (!session) return;
    setDataLoading(true);
    setDataError("");

    // Quick initial render with local stats
    setVisitorStats(getVisitorStats());
    void checkHealth();

    try {
      // Parallel non-blocking fetches
      const [leadRows, trainingRows, launchRows, slideRows] = await Promise.all([
        listLeads(session.accessToken).catch(() => []),
        listTraining(session.accessToken).catch(() => []),
        listLaunches(session.accessToken).catch(() => []),
        listSlides(session.accessToken).catch(() => []),
      ]);

      setLeads(leadRows);
      setTrainings(trainingRows as TrainingRecord[]);
      setLaunches(launchRows);
      setSlides(slideRows);

      // Async fetch remaining non-critical items
      Promise.all([
        listBookings(session.accessToken).catch(() => []),
        listContacts(session.accessToken).catch(() => []),
      ]).then(([bookingRows, contactRows]) => {
        setBookings(bookingRows as MernBooking[]);
        setContacts(contactRows as MernContact[]);
      });
    } catch (error) {
      setDataError(error instanceof Error ? error.message : "Unable to load dashboard data");
    } finally {
      setDataLoading(false);
    }
  }, [session, checkHealth]);

  useEffect(() => {
    void checkHealth();
  }, [checkHealth]);

  useEffect(() => {
    void loadData();

    const handleUpdate = () => void loadData();
    window.addEventListener("fck_bookings_updated", handleUpdate);
    window.addEventListener("fck_leads_updated", handleUpdate);
    window.addEventListener("fck_training_updated", handleUpdate);
    window.addEventListener("fck_contacts_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("fck_bookings_updated", handleUpdate);
      window.removeEventListener("fck_leads_updated", handleUpdate);
      window.removeEventListener("fck_training_updated", handleUpdate);
      window.removeEventListener("fck_contacts_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [loadData]);

  const filteredLeads = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((lead) => {
      const matchesQuery =
        !q ||
        [lead.name, lead.phone, lead.email, lead.city, lead.brand, lead.budget]
          .join(" ")
          .toLowerCase()
          .includes(q);
      const matchesBrand = brandFilter === "All brands" || lead.brand === brandFilter;
      const matchesStatus = statusFilter === "All statuses" || lead.status === statusFilter;
      return matchesQuery && matchesBrand && matchesStatus;
    });
  }, [leads, query, brandFilter, statusFilter]);

  const brandOptions = useMemo(
    () => ["All brands", ...Array.from(new Set(leads.map((lead) => lead.brand))).filter(Boolean)],
    [leads]
  );

  const filteredTrainings = useMemo(() => {
    const q = query.trim().toLowerCase();
    return trainings.filter((t) => {
      const text = [t.name, t.phone, t.email, t.city, t.brand, t.notes, t.startDate, t.status, t.heading]
        .join(" ")
        .toLowerCase();
      return !q || text.includes(q);
    });
  }, [trainings, query]);

  const removeTraining = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this training record?")) return;
    try {
      await deleteTrainingRecord(id, session?.accessToken);
      setTrainings((prev) => prev.filter((t) => t.id !== id && (t as any)._id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete training record");
    }
  };

  const changeTrainingStatus = async (id: string, newStatus: string) => {
    try {
      await updateTrainingRecord(id, { status: newStatus }, session?.accessToken);
      setTrainings((prev) =>
        prev.map((t) => (t.id === id || (t as any)._id === id ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  const stats = useMemo(
    () => ({
      total: leads.length,
      new: leads.filter((lead) => lead.status === "New").length,
      contacted: leads.filter((lead) => lead.status === "Contacted").length,
      interested: leads.filter((lead) => lead.status === "Interested").length,
      converted: leads.filter((lead) => lead.status === "Converted").length,
      lost: leads.filter((lead) => lead.status === "Lost").length,
      trainingsCount: trainings.length,
      launchesCount: launches.length,
      slidesCount: slides.length,
      bookingsCount: bookings.length,
      contactsCount: contacts.length,
    }),
    [leads, trainings, launches, slides, bookings, contacts]
  );



  const login = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    try {
      const signed = await signInAdmin(email, password);
      const next: AdminSession = {
        accessToken: signed.accessToken,
        email: signed.email,
        mode: isMernOnline ? "mern" : "local",
      };
      setSession(next);
      window.sessionStorage.setItem("fck_admin_session", JSON.stringify(next));
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    window.sessionStorage.removeItem("fck_admin_session");
    setSession(null);
    setLeads([]);
  };

  const saveLeadField = async (id: string, updates: Partial<Pick<LeadRecord, "status" | "notes">>) => {
    if (!session) return;
    const saved = await updateLead(id, updates, session.accessToken);
    setLeads((current) => current.map((lead) => (lead.id === id ? saved : lead)));
  };

  const removeLead = async (id: string) => {
    if (!session || !window.confirm("Delete this lead permanently?")) return;
    await deleteLead(id, session.accessToken);
    setLeads((current) => current.filter((lead) => lead.id !== id));
  };

  const removeBooking = async (id: string) => {
    if (!session || !window.confirm("Delete this booking entry?")) return;
    try {
      await deleteBookingRecord(id, session.accessToken);
      setBookings((current) => current.filter((b) => (b._id || b.id) !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not delete booking");
    }
  };

  const removeContact = async (id: string) => {
    if (!session || !window.confirm("Delete this contact inquiry?")) return;
    try {
      await deleteContactRecord(id, session.accessToken);
      setContacts((current) => current.filter((c) => (c._id || c.id) !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not delete contact");
    }
  };

  const addLaunch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!session) return;
    try {
      const saved = await saveLaunch(launchForm, session.accessToken);
      setLaunches((current) => [...current, saved]);
      setLaunchForm({
        city: "",
        brand: "Family Cafe King",
        date_text: "",
        image_data: DEFAULT_UPCOMING[0].image_data,
        tag: "Coming Soon",
        accent: "#8C1F28",
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add upcoming launch");
    }
  };

  const saveEditLaunch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!session || !editingLaunch) return;
    try {
      const updated = await updateLaunch(
        editingLaunch.id,
        {
          city: editingLaunch.city,
          brand: editingLaunch.brand,
          date_text: editingLaunch.date_text,
          image_data: editingLaunch.image_data,
          tag: editingLaunch.tag,
          accent: editingLaunch.accent,
        },
        session.accessToken
      );
      setLaunches((current) => current.map((l) => (l.id === updated.id ? updated : l)));
      setEditingLaunch(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update upcoming launch");
    }
  };

  const addSlide = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!session) return;
    try {
      const payload = {
        title: slideForm.title.trim(),
        subtitle: slideForm.subtitle.trim() || "High margin franchise with complete SOPs, equipment, and launch marketing support.",
        brand_name: slideForm.brand_name || "Family Cafe King",
        badge_text: slideForm.badge_text.trim() || "350+ Franchises All Over India",
        image_url: slideForm.image_url.trim() || DEFAULT_SLIDES[0].image_url,
        price_display: slideForm.price_display.trim() || "₹3 - 10 Lakhs",
        space_req: slideForm.space_req.trim() || "100 - 300 sq.ft",
        cta_text: slideForm.cta_text.trim() || "Apply for Franchise",
        cta_link: slideForm.cta_link.trim() || "#lead",
        accent_color: slideForm.accent_color || "#8C1F28",
        is_active: true,
        order: slides.length,
      };

      const saved = await saveSlide(payload, session.accessToken);
      setSlides((current) => [...current, saved]);
      setSlideForm({
        title: "",
        subtitle: "",
        brand_name: "Family Cafe King",
        badge_text: "",
        image_url: "",
        price_display: "",
        space_req: "",
        cta_text: "",
        cta_link: "",
        accent_color: "#8C1F28",
        is_active: true,
        order: slides.length + 1,
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create hero slide");
    }
  };


  const saveEditSlide = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!session || !editingSlide) return;
    try {
      const updated = await updateSlide(
        editingSlide.id,
        {
          title: editingSlide.title,
          subtitle: editingSlide.subtitle,
          brand_name: editingSlide.brand_name,
          badge_text: editingSlide.badge_text,
          image_url: editingSlide.image_url,
          price_display: editingSlide.price_display,
          space_req: editingSlide.space_req,
          cta_text: editingSlide.cta_text,
          cta_link: editingSlide.cta_link,
          accent_color: editingSlide.accent_color,
          is_active: editingSlide.is_active,
          order: editingSlide.order,
        },
        session.accessToken
      );
      setSlides((current) => current.map((s) => (s.id === updated.id ? updated : s)));
      setEditingSlide(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update hero slide");
    }
  };

  const toggleSlideActive = async (slide: SlideRecord) => {
    if (!session) return;
    try {
      const updated = await updateSlide(slide.id, { is_active: !slide.is_active }, session.accessToken);
      setSlides((current) => current.map((s) => (s.id === updated.id ? updated : s)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not toggle slide status");
    }
  };

  const removeSlide = async (id: string) => {
    if (!session || !window.confirm("Delete this hero slide?")) return;
    try {
      await deleteSlide(id, session.accessToken);
      setSlides((current) => current.filter((s) => s.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not delete slide");
    }
  };

  const handleResetDefaultSlides = async () => {
    if (!window.confirm("Restore all 5 default brand slides (Family Cafe King, Chai, Paan, Shake & Lassi)?")) return;
    try {
      const fresh = await seedDefaultSlides(session?.accessToken);
      setSlides(fresh);
      alert("Successfully restored all 5 brand hero slides!");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to restore slides");
    }
  };

  const removeLaunch = async (id: string) => {
    if (!session || !window.confirm("Delete this upcoming launch card?")) return;
    await deleteLaunch(id, session.accessToken);
    setLaunches((current) => current.filter((launch) => launch.id !== id));
  };

  const downloadCsv = () => {
    const csvData = allRequestsToCsv(leads, bookings, contacts);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `family-cafe-king-real-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!session) {
    return (
      <main className={`grid min-h-screen place-items-center px-4 py-12 font-sans transition-colors duration-300 ${
        isNight
          ? "bg-[#140a0b] text-slate-100 selection:bg-amber-500 selection:text-black"
          : "bg-[#faf5ea] text-slate-900 selection:bg-amber-400 selection:text-slate-900"
      }`}>
        <div className={`w-full max-w-md rounded-3xl border p-8 shadow-2xl backdrop-blur-2xl transition-colors duration-300 ${
          isNight
            ? "border-amber-500/30 bg-[#1f0e10] text-slate-100"
            : "border-amber-300 bg-white text-slate-900 shadow-xl"
        }`}>
          <div className="mb-6 flex items-center justify-between">
            <a href="#top" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-500 hover:text-amber-400">
              <ArrowLeft size={14} /> Return to site
            </a>
            <button
              type="button"
              onClick={toggleMood}
              className={`inline-flex items-center justify-center rounded-xl p-2 transition-all ${
                isNight
                  ? "bg-slate-800 border border-slate-700 text-amber-300 hover:bg-slate-700"
                  : "bg-amber-100 border border-amber-300 text-amber-950 hover:bg-amber-200 shadow-sm"
              }`}
              title={isNight ? "Switch theme" : "Switch theme"}
            >
              {isNight ? (
                <Moon size={16} className="text-amber-300" />
              ) : (
                <Sun size={16} className="text-amber-600" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="relative grid h-14 w-14 flex-shrink-0 place-items-center overflow-hidden rounded-2xl border border-amber-400/30 bg-white p-1.5 shadow-lg shadow-amber-900/20">
              <img
                src="https://customer-assets-m6fa6gv7.emergentagent.net/job_5c36eac6-4afa-404a-9f8a-3a2a73a148f4/artifacts/t8gmidb5_FCK%20LOGO.png"
                alt="Family Cafe King Logo"
                className="h-full w-full object-contain rounded-xl"
              />
            </span>
            <div>
              <h1 className={`font-display text-2xl font-black tracking-tight ${isNight ? "text-white" : "text-slate-900"}`}>
                Admin & Franchise Portal
              </h1>
              <p className={`text-xs font-medium ${isNight ? "text-slate-400" : "text-amber-900/70"}`}>
                Family Cafe King Management & Franchisee Portal
              </p>
            </div>
          </div>



          <form onSubmit={login} className="mt-6 space-y-4">
            <AdminField
              label="Admin / Partner Email"
              value={email}
              onChange={setEmail}
              type="email"
              required
              placeholder="familycafeking.com@gmail.com"
              isNight={isNight}
            />
            <AdminField
              label="Password"
              value={password}
              onChange={setPassword}
              type="password"
              required
              placeholder="••••••••"
              isNight={isNight}
            />


            {authError && (
              <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-400">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 px-5 py-4 font-black tracking-wide text-white shadow-xl shadow-amber-900/20 hover:brightness-110 disabled:opacity-70 transition-all"
            >
              {authLoading && <Loader2 size={18} className="animate-spin" />}
              Sign In to Portal
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen font-sans transition-colors duration-300 ${
      isNight
        ? "bg-[#0a0708] text-slate-100 selection:bg-amber-500 selection:text-black"
        : "bg-gradient-to-br from-amber-50 via-orange-50/40 to-amber-100/70 text-slate-900 selection:bg-amber-400 selection:text-slate-900"
    }`}>
      {/* Header Bar */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-xl transition-colors duration-300 ${
        isNight ? "border-slate-800/80 bg-slate-950/80" : "border-amber-200/80 bg-white/90 shadow-sm"
      }`}>
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3.5">
            <span className="relative grid h-11 w-11 flex-shrink-0 place-items-center overflow-hidden rounded-2xl border border-amber-400/30 bg-white p-1 shadow-md">
              <img
                src="https://customer-assets-m6fa6gv7.emergentagent.net/job_5c36eac6-4afa-404a-9f8a-3a2a73a148f4/artifacts/t8gmidb5_FCK%20LOGO.png"
                alt="Family Cafe King Logo"
                className="h-full w-full object-contain rounded-xl"
              />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className={`font-display text-xl font-black sm:text-2xl ${isNight ? "text-white" : "text-slate-900"}`}>
                  Family Cafe King
                </h1>
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-amber-500">
                  Admin CRM
                </span>
              </div>
              <p className={`text-xs font-bold ${isNight ? "text-slate-400" : "text-amber-900/70"}`}>
                {isMernOnline ? "🟢 Connected to MongoDB Backend" : "🟡 Local Fallback Mode"} · {session.email}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={toggleMood}
              className={`inline-flex items-center justify-center rounded-xl p-2.5 transition-all ${
                isNight
                  ? "bg-slate-900 border border-amber-500/30 text-amber-400 hover:bg-slate-800 shadow-md shadow-amber-950/20"
                  : "bg-amber-100 border border-amber-300 text-amber-950 hover:bg-amber-200 shadow-md shadow-amber-500/10"
              }`}
              title={isNight ? "Switch theme" : "Switch theme"}
            >
              {isNight ? (
                <Moon size={16} className="text-amber-400" />
              ) : (
                <Sun size={16} className="text-amber-600" />
              )}
            </button>
            <a
              href="#top"
              className={`rounded-xl border px-4 py-2 text-xs font-bold ${
                isNight ? "border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800" : "border-amber-300 bg-white text-slate-800 hover:bg-amber-50 shadow-sm"
              }`}
            >
              Live Site
            </a>
            <button
              onClick={async () => {
                if (!window.confirm("Are you sure you want to reset and clear all saved demo leads & bookings?")) return;
                try {
                  await clearAllDemoLeads(session?.accessToken, leads, bookings as any);
                  setLeads([]);
                  setBookings([]);
                  alert("Successfully reset all saved demo leads & territory requests!");
                } catch (err) {
                  alert(err instanceof Error ? err.message : "Failed to reset demo leads");
                }
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-orange-500/40 bg-orange-500/10 px-4 py-2 text-xs font-bold text-orange-400 hover:bg-orange-500/20"
            >
              <RotateCcw size={14} /> Reset Demo Leads
            </button>
            <button
              onClick={() => void loadData()}
              className="inline-flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-500 hover:bg-amber-500/20"
            >
              <RefreshCw size={14} className={dataLoading ? "animate-spin" : ""} /> Refresh
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600/20 border border-rose-500/40 px-4 py-2 text-xs font-bold text-rose-400 hover:bg-rose-600/30"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mx-auto max-w-7xl px-6">
          <nav className={`flex gap-2 overflow-x-auto border-t py-2.5 ${isNight ? "border-slate-800/60" : "border-amber-200/60"}`}>
            {[
              { id: "overview", label: "Overview", icon: <TrendingUp size={15} /> },
              { id: "leads", label: `Franchise Leads (${stats.total})`, icon: <Users size={15} /> },
              { id: "training", label: `Staff Training (${stats.trainingsCount})`, icon: <Award size={15} /> },
              { id: "slides", label: `Hero Slider (${stats.slidesCount})`, icon: <Sliders size={15} /> },
              { id: "launches", label: `Upcoming Launches (${stats.launchesCount})`, icon: <MapPin size={15} /> },
              { id: "bookings", label: `City Bookings (${stats.bookingsCount})`, icon: <Calendar size={15} /> },
              { id: "contacts", label: `Inquiries (${stats.contactsCount})`, icon: <Inbox size={15} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20 font-black"
                    : isNight
                      ? "text-slate-400 hover:bg-slate-900 hover:text-white"
                      : "text-amber-900/80 hover:bg-amber-100 hover:text-amber-950 font-bold"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        {dataError && (
          <p className="mb-6 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 font-bold text-rose-300">
            {dataError}
          </p>
        )}

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* KPI Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <AdminStat icon={<Eye size={22} />} label="Total Real Site Visitors" value={visitorStats.totalVisits} badge={`${visitorStats.todayVisits} Today`} highlight isNight={isNight} />
              <AdminStat icon={<Users size={22} />} label="Total Franchise Leads" value={stats.total} badge="Lifetime" isNight={isNight} />
              <AdminStat icon={<Sparkles size={22} />} label="New Inquiries" value={stats.new} badge="Action Required" isNight={isNight} />
              <AdminStat icon={<CheckCircle2 size={22} />} label="Converted Franchisees" value={stats.converted} badge="Success" isNight={isNight} />
            </div>

            {/* Real Visitors Analytics Panel */}
            <div className={`rounded-3xl border p-6 backdrop-blur-xl transition-all ${
              isNight ? "border-slate-800 bg-slate-900/60" : "border-amber-200/80 bg-white/90 shadow-xl shadow-amber-950/5"
            }`}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-5">
                <div>
                  <h2 className={`font-display text-lg font-bold ${isNight ? "text-white" : "text-slate-900"}`}>
                    Real-time Website Traffic & Visitor Overview
                  </h2>
                  <p className={`text-xs ${isNight ? "text-slate-400" : "text-amber-900/70"}`}>
                    Live site pageviews, unique visitors, and daily traffic metrics
                  </p>
                </div>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-400 inline-flex items-center gap-1.5 self-start sm:self-auto">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" /> Live Tracking Active
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className={`rounded-2xl border p-4 ${isNight ? "border-slate-800 bg-slate-950" : "border-amber-200/80 bg-amber-50/50"}`}>
                  <p className={`text-xs font-bold uppercase tracking-wider ${isNight ? "text-slate-400" : "text-amber-900/70"}`}>Total Site Visitors</p>
                  <p className="mt-2 text-3xl font-black text-amber-500">{visitorStats.totalVisits}</p>
                  <p className="mt-1 text-[11px] font-semibold text-slate-400">Total website traffic logged</p>
                </div>

                <div className={`rounded-2xl border p-4 ${isNight ? "border-slate-800 bg-slate-950" : "border-amber-200/80 bg-amber-50/50"}`}>
                  <p className={`text-xs font-bold uppercase tracking-wider ${isNight ? "text-slate-400" : "text-amber-900/70"}`}>Unique Visitors</p>
                  <p className="mt-2 text-3xl font-black text-sky-400">{visitorStats.uniqueVisitors}</p>
                  <p className="mt-1 text-[11px] font-semibold text-slate-400">Distinct devices & sessions</p>
                </div>

                <div className={`rounded-2xl border p-4 ${isNight ? "border-slate-800 bg-slate-950" : "border-amber-200/80 bg-amber-50/50"}`}>
                  <p className={`text-xs font-bold uppercase tracking-wider ${isNight ? "text-slate-400" : "text-amber-900/70"}`}>Today's Visitors</p>
                  <p className="mt-2 text-3xl font-black text-emerald-400">{visitorStats.todayVisits}</p>
                  <p className="mt-1 text-[11px] font-semibold text-slate-400">Visits recorded today</p>
                </div>
              </div>
            </div>

            {/* Pipeline Status Breakdown */}
            <div className={`rounded-3xl border p-6 backdrop-blur-xl transition-all ${
              isNight ? "border-slate-800 bg-slate-900/60" : "border-amber-200/80 bg-white/90 shadow-xl shadow-amber-950/5"
            }`}>
              <h2 className={`font-display text-lg font-bold mb-4 ${isNight ? "text-white" : "text-slate-900"}`}>Lead Status Pipeline</h2>
              <div className="grid gap-3 sm:grid-cols-5">
                {[
                  { status: "New", count: stats.new, color: "bg-amber-500" },
                  { status: "Contacted", count: stats.contacted, color: "bg-sky-500" },
                  { status: "Interested", count: stats.interested, color: "bg-emerald-500" },
                  { status: "Converted", count: stats.converted, color: "bg-green-400" },
                  { status: "Lost", count: stats.lost, color: "bg-rose-500" },
                ].map((item) => (
                  <div key={item.status} className={`rounded-2xl border p-4 ${
                    isNight ? "border-slate-800 bg-slate-950" : "border-amber-200/80 bg-amber-50/50"
                  }`}>
                    <p className={`text-xs font-bold uppercase tracking-wider ${isNight ? "text-slate-400" : "text-amber-900/70"}`}>{item.status}</p>
                    <p className={`mt-2 text-2xl font-black ${isNight ? "text-white" : "text-slate-900"}`}>{item.count}</p>
                    <div className={`mt-3 h-1.5 w-full rounded-full overflow-hidden ${isNight ? "bg-slate-800" : "bg-amber-200"}`}>
                      <div
                        className={`h-full ${item.color}`}
                        style={{ width: `${stats.total > 0 ? (item.count / stats.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions & Recent Stream */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className={`rounded-3xl border p-6 ${
                isNight ? "border-slate-800 bg-slate-900/60" : "border-amber-200/80 bg-white/90 shadow-xl shadow-amber-950/5"
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-display text-lg font-bold ${isNight ? "text-white" : "text-slate-900"}`}>Recent Inquiries Stream</h3>
                  <button onClick={() => setActiveTab("leads")} className="text-xs font-bold text-amber-500 hover:underline">
                    View All Leads &rarr;
                  </button>
                </div>
                <div className="space-y-3">
                  {leads.slice(0, 5).map((lead) => (
                    <div key={lead.id} className={`flex items-center justify-between rounded-2xl border p-4 ${
                      isNight ? "border-slate-800 bg-slate-950" : "border-amber-200/70 bg-amber-50/30"
                    }`}>
                      <div>
                        <p className={`font-bold ${isNight ? "text-white" : "text-slate-900"}`}>{lead.name} <span className={`text-xs font-normal ${isNight ? "text-slate-400" : "text-amber-900/70"}`}>({lead.city})</span></p>
                        <p className="text-xs font-semibold text-amber-500">{lead.brand} · {lead.budget}</p>
                      </div>
                      <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${statusClass(lead.status)}`}>
                        {lead.status}
                      </span>
                    </div>
                  ))}
                  {leads.length === 0 && <p className="text-xs text-slate-400">No leads submitted yet.</p>}
                </div>
              </div>

              <div className={`rounded-3xl border p-6 flex flex-col justify-between ${
                isNight ? "border-slate-800 bg-slate-900/60" : "border-amber-200/80 bg-white/90 shadow-xl shadow-amber-950/5"
              }`}>
                <div>
                  <h3 className={`font-display text-lg font-bold mb-2 ${isNight ? "text-white" : "text-slate-900"}`}>Export & Utilities</h3>
                  <p className={`text-xs mb-6 ${isNight ? "text-slate-400" : "text-amber-900/70"}`}>Download lead database in standard CSV format for CRM import or email marketing.</p>
                  <button
                    onClick={downloadCsv}
                    className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3.5 text-xs font-extrabold text-white hover:bg-emerald-500 shadow-lg shadow-emerald-900/30 transition-all"
                  >
                    <Download size={16} /> Export All Leads (CSV)
                  </button>
                </div>
                <div className={`mt-6 rounded-2xl border p-4 text-xs ${
                  isNight ? "border-amber-500/20 bg-amber-500/5 text-amber-300" : "border-amber-300/60 bg-amber-100/60 text-amber-950 font-medium"
                }`}>
                  💡 <b>Tip:</b> Leads submitted by users on the landing page are saved directly to MongoDB and trigger instant dashboard notifications.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LEADS CRM TAB */}
        {activeTab === "leads" && (
          <div className={`rounded-3xl border p-6 backdrop-blur-xl ${
            isNight ? "border-slate-800 bg-slate-900/60" : "border-amber-200/80 bg-white/90 shadow-xl shadow-amber-950/5"
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className={`font-display text-xl font-black ${isNight ? "text-white" : "text-slate-900"}`}>Franchise Lead CRM</h2>
                <p className={`text-xs font-medium ${isNight ? "text-slate-400" : "text-amber-900/70"}`}>Search, filter, update status, add notes, and contact prospects.</p>
              </div>
              <button
                onClick={downloadCsv}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-500 px-4.5 py-2 text-xs font-extrabold text-white shadow-md shadow-emerald-950/20 transition-all cursor-pointer"
              >
                <Download size={15} /> Export CSV
              </button>
            </div>

            {/* Filter controls */}
            <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_220px_190px]">
              <div className="relative block">
                <Search size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 ${isNight ? "text-slate-400" : "text-amber-700"}`} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search lead by name, phone, city, budget..."
                  className={`w-full rounded-2xl border py-3 pl-10 pr-4 text-xs font-bold outline-none transition-all ${
                    isNight ? "border-slate-800 bg-slate-950 text-white focus:border-amber-500" : "border-amber-200 bg-amber-50/50 text-slate-900 focus:border-amber-600 shadow-sm"
                  }`}
                />
              </div>
              <select
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
                className={`rounded-2xl border px-4 py-3 text-xs font-bold outline-none transition-all ${
                  isNight ? "border-slate-800 bg-slate-950 text-white focus:border-amber-500" : "border-amber-200 bg-amber-50/50 text-slate-900 focus:border-amber-600 shadow-sm"
                }`}
              >
                {brandOptions.map((b) => <option key={b}>{b}</option>)}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`rounded-2xl border px-4 py-3 text-xs font-bold outline-none transition-all ${
                  isNight ? "border-slate-800 bg-slate-950 text-white focus:border-amber-500" : "border-amber-200 bg-amber-50/50 text-slate-900 focus:border-amber-600 shadow-sm"
                }`}
              >
                {["All statuses", ...LEAD_STATUSES].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            {/* Leads Cards */}
            <div className="mt-6 space-y-4">
              {filteredLeads.length === 0 && (
                <div className={`rounded-2xl border border-dashed px-5 py-12 text-center ${
                  isNight ? "border-slate-800 bg-slate-950" : "border-amber-200 bg-amber-50/40"
                }`}>
                  <Filter size={28} className="mx-auto text-amber-500 mb-2" />
                  <p className={`text-sm font-bold ${isNight ? "text-slate-400" : "text-amber-900/70"}`}>No matching leads found.</p>
                </div>
              )}

              {filteredLeads.map((lead) => (
                <article key={lead.id} className={`rounded-3xl border p-5 transition-all ${
                  isNight ? "border-slate-800/80 bg-slate-950 hover:border-slate-700" : "border-amber-200/80 bg-white hover:border-amber-300 shadow-md shadow-amber-950/5"
                }`}>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className={`font-display text-lg font-bold ${isNight ? "text-white" : "text-slate-900"}`}>{lead.name}</h3>
                        <span className={`rounded-full border px-3 py-0.5 text-[11px] font-extrabold ${statusClass(lead.status)}`}>
                          {lead.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs font-bold text-amber-500">
                        {lead.brand} · Budget: {lead.budget}
                      </p>
                      <p className={`mt-1 flex items-center gap-1.5 text-xs ${isNight ? "text-slate-400" : "text-amber-900/70"}`}>
                        <MapPin size={13} className="text-orange-500" /> {lead.city} · <Clock size={13} /> {new Date(lead.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={`tel:${lead.phone.replace(/\s/g, "")}`}
                        className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold ${
                          isNight ? "bg-slate-800 border-slate-700 text-white hover:bg-slate-700" : "bg-amber-100 border-amber-300 text-amber-950 hover:bg-amber-200"
                        }`}
                      >
                        <Phone size={13} /> Call
                      </a>
                      <a
                        href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600/20 border border-emerald-500/30 px-3 py-1.5 text-xs font-bold text-emerald-600 hover:bg-emerald-600/30"
                      >
                        <MessageCircle size={13} /> WhatsApp
                      </a>
                      <button
                        onClick={() => void removeLead(lead.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600/20 border border-rose-500/30 px-3 py-1.5 text-xs font-bold text-rose-500 hover:bg-rose-600/30"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>

                  {/* Details Grid & Status/Notes Controls */}
                  <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_240px]">
                    <div className={`grid gap-2 rounded-2xl border p-3 text-xs sm:grid-cols-2 ${
                      isNight ? "border-slate-800 bg-slate-900/60 text-slate-300" : "border-amber-200/70 bg-amber-50/50 text-slate-800"
                    }`}>
                      <p><b>Phone:</b> {lead.phone}</p>
                      <p><b>Email:</b> {lead.email || "N/A"}</p>
                      <p><b>Budget:</b> {lead.budget}</p>
                      <p><b>Source:</b> {lead.source_page || "Landing Page"}</p>
                    </div>
                    <div className="space-y-2">
                      <select
                        value={lead.status}
                        onChange={(e) => void saveLeadField(lead.id, { status: e.target.value as LeadStatus })}
                        className={`w-full rounded-xl border px-3 py-2 text-xs font-bold outline-none ${
                          isNight ? "border-slate-800 bg-slate-900 text-white focus:border-amber-500" : "border-amber-200 bg-amber-50/60 text-slate-900 focus:border-amber-600"
                        }`}
                      >
                        {LEAD_STATUSES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                      <input
                        defaultValue={lead.notes}
                        onBlur={(e) => {
                          if (e.target.value !== lead.notes) {
                            void saveLeadField(lead.id, { notes: e.target.value });
                          }
                        }}
                        placeholder="Add follow-up notes..."
                        className={`w-full rounded-xl border px-3 py-2 text-xs outline-none ${
                          isNight ? "border-slate-800 bg-slate-900 text-white placeholder:text-slate-500 focus:border-amber-500" : "border-amber-200 bg-amber-50/60 text-slate-900 placeholder:text-slate-400 focus:border-amber-600"
                        }`}
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* STAFF TRAINING TAB */}
        {activeTab === "training" && (
          <div className={`rounded-3xl border p-6 backdrop-blur-xl ${
            isNight ? "border-slate-800 bg-slate-900/60" : "border-amber-200/80 bg-white/90 shadow-xl shadow-amber-950/5"
          }`}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h2 className={`font-display text-xl font-black ${isNight ? "text-white" : "text-slate-900"}`}>
                  Staff Training & Kitchen Support Applications
                </h2>
                <p className={`text-xs font-medium ${isNight ? "text-slate-400" : "text-amber-900/70"}`}>
                  Direct training bookings submitted via the Staff Training modal.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => downloadCsvFile(`staff-training-bookings-${new Date().toISOString().slice(0, 10)}.csv`, trainingsToCsv(trainings))}
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-500 px-4.5 py-2 text-xs font-extrabold text-white shadow-md shadow-emerald-950/20 transition-all cursor-pointer"
                >
                  <Download size={15} /> Export CSV
                </button>
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-extrabold text-amber-500">
                  {trainings.length} Total Training Bookings
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {filteredTrainings.length === 0 && (
                <div className={`rounded-2xl border border-dashed px-5 py-12 text-center ${
                  isNight ? "border-slate-800 bg-slate-950" : "border-amber-200 bg-amber-50/40"
                }`}>
                  <Award size={28} className="mx-auto text-amber-500 mb-2" />
                  <p className={`text-sm font-bold ${isNight ? "text-slate-400" : "text-amber-900/70"}`}>
                    No staff training bookings submitted yet.
                  </p>
                </div>
              )}

              {filteredTrainings.map((t) => (
                <div key={(t as any)._id || t.id} className={`flex flex-wrap items-start justify-between gap-4 rounded-2xl border p-4 transition-all ${
                  isNight ? "border-slate-800 bg-slate-950 hover:border-amber-500/40" : "border-amber-200/80 bg-white shadow-sm hover:border-amber-300"
                }`}>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className={`font-bold text-base capitalize ${isNight ? "text-white" : "text-slate-900"}`}>
                        {t.name || t.heading || "Trainee Candidate"}
                      </h3>
                      {t.phone && (
                        <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-500">
                          📞 {t.phone}
                        </span>
                      )}
                      {t.email && (
                        <span className={`text-xs ${isNight ? "text-slate-400" : "text-amber-900/70"}`}>
                          ✉️ {t.email}
                        </span>
                      )}
                    </div>

                    <p className={`text-xs font-semibold ${isNight ? "text-slate-300" : "text-amber-900/90"}`}>
                      Program: <span className="text-amber-500 font-extrabold">{t.brand || t.heading || "Staff Training & Support"}</span>
                      {t.city && <> · City: <span className="font-extrabold text-emerald-400">{t.city}</span></>}
                      {t.startDate && <> · Start Date: <span className="font-extrabold text-sky-400">{t.startDate}</span></>}
                      {t.budget && <> · Package Charge: <span className="font-extrabold text-amber-400">{t.budget}</span></>}
                      {t.created_at && <> · Date: {new Date(t.created_at).toLocaleDateString("en-IN")}</>}
                    </p>

                    {t.notes && (
                      <p className={`mt-2 text-xs italic p-2.5 rounded-xl border ${
                        isNight ? "bg-slate-900 border-slate-800 text-amber-300" : "bg-amber-50 border-amber-200 text-amber-950 font-medium"
                      }`}>
                        "{t.notes}"
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={t.status || "New"}
                      onChange={(e) => void changeTrainingStatus(((t as any)._id || t.id)!, e.target.value)}
                      className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition-all cursor-pointer outline-none ${
                        isNight
                          ? "bg-slate-900 border-slate-700 text-amber-400 hover:bg-slate-800 focus:border-amber-500"
                          : "bg-amber-50 border-amber-300 text-amber-950 hover:bg-amber-100 focus:border-amber-500"
                      }`}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>

                    <button
                      onClick={() => void removeTraining(((t as any)._id || t.id)!)}
                      className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-500 hover:bg-rose-500/20 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* UPCOMING LAUNCHES TAB */}
        {activeTab === "launches" && (
          <div className={`rounded-3xl border p-6 backdrop-blur-xl ${
            isNight ? "border-slate-800 bg-slate-900/60" : "border-amber-200/80 bg-white/90 shadow-xl shadow-amber-950/5"
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className={`font-display text-xl font-black ${isNight ? "text-white" : "text-slate-900"}`}>Upcoming Franchise Launch Manager</h2>
                <p className={`text-xs font-medium ${isNight ? "text-slate-400" : "text-amber-900/70"}`}>Add or manage city launch cards rendered live on the website.</p>
              </div>
            </div>

            {/* Add Launch Form */}
            <form onSubmit={addLaunch} className="mt-6 grid gap-3 lg:grid-cols-[140px_1fr_160px_1fr_140px_80px_auto]">
              <AdminMiniInput placeholder="City Name" value={launchForm.city} onChange={(val) => setLaunchForm((f) => ({ ...f, city: val }))} required isNight={isNight} />
              <select
                value={launchForm.brand}
                onChange={(e) => setLaunchForm((f) => ({ ...f, brand: e.target.value }))}
                className={`rounded-2xl border px-3 py-3 text-xs font-bold outline-none ${
                  isNight ? "border-slate-800 bg-slate-950 text-white focus:border-amber-500" : "border-amber-200 bg-amber-50/50 text-slate-900 focus:border-amber-600 shadow-sm"
                }`}
              >
                {["Family Cafe King", "Chai Cafe King", "Paan King", "Shake & Soda King", "Lassi King", "Multi-Brand Flagship"].map((b) => <option key={b}>{b}</option>)}
              </select>
              <AdminMiniInput placeholder="Opening Nov 2026" value={launchForm.date_text} onChange={(val) => setLaunchForm((f) => ({ ...f, date_text: val }))} required isNight={isNight} />
              <AdminMiniInput placeholder="Image URL" value={launchForm.image_data} onChange={(val) => setLaunchForm((f) => ({ ...f, image_data: val }))} required isNight={isNight} />
              <AdminMiniInput placeholder="Tag Badge" value={launchForm.tag} onChange={(val) => setLaunchForm((f) => ({ ...f, tag: val }))} required isNight={isNight} />
              <input
                type="color"
                value={launchForm.accent}
                onChange={(e) => setLaunchForm((f) => ({ ...f, accent: e.target.value }))}
                className={`h-[44px] w-full rounded-2xl border p-1 cursor-pointer ${
                  isNight ? "border-slate-800 bg-slate-950" : "border-amber-200 bg-white"
                }`}
                title="Accent color"
              />
              <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-500 px-5 py-3 text-xs font-black text-black hover:bg-amber-400 shadow-md">
                <Plus size={15} /> Add
              </button>
            </form>

            {/* Cards Grid */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {launches.map((launch) => (
                <article key={launch.id} className={`overflow-hidden rounded-3xl border ${
                  isNight ? "border-slate-800 bg-slate-950" : "border-amber-200/80 bg-white shadow-md shadow-amber-950/5"
                }`}>
                  <img src={launch.image_data} alt={launch.city} className="h-44 w-full object-cover" />
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="inline-block rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-500 border border-amber-500/30">
                          {launch.tag}
                        </span>
                        <h3 className={`font-display text-lg font-extrabold mt-1 ${isNight ? "text-white" : "text-slate-900"}`}>{launch.brand}</h3>
                        <p className={`text-xs font-bold ${isNight ? "text-slate-300" : "text-amber-900/80"}`}>{launch.city} · {launch.date_text}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setEditingLaunch(launch)}
                          className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2 text-amber-500 hover:bg-amber-500/20"
                          title="Edit Launch"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => void removeLaunch(launch.id)}
                          className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-2 text-rose-500 hover:bg-rose-500/20"
                          title="Delete Launch"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Launch Edit Modal */}
            {editingLaunch && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                <div className={`w-full max-w-lg rounded-3xl border p-6 shadow-2xl ${
                  isNight ? "border-slate-800 bg-slate-900 text-white" : "border-amber-200 bg-white text-slate-900"
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-lg font-bold">Edit Upcoming Launch</h3>
                    <button onClick={() => setEditingLaunch(null)} className="text-slate-400 hover:text-white">
                      <XCircle size={20} />
                    </button>
                  </div>
                  <form onSubmit={saveEditLaunch} className="space-y-3">
                    <AdminMiniInput placeholder="City Name" value={editingLaunch.city} onChange={(val) => setEditingLaunch({ ...editingLaunch, city: val })} required isNight={isNight} />
                    <select
                      value={editingLaunch.brand}
                      onChange={(e) => setEditingLaunch({ ...editingLaunch, brand: e.target.value })}
                      className={`w-full rounded-2xl border px-3 py-3 text-xs font-bold outline-none ${
                        isNight ? "border-slate-800 bg-slate-950 text-white focus:border-amber-500" : "border-amber-200 bg-amber-50/50 text-slate-900 focus:border-amber-600 shadow-sm"
                      }`}
                    >
                      {["Family Cafe King", "Chai Cafe King", "Paan King", "Shake & Soda King", "Lassi King", "Multi-Brand Flagship"].map((b) => <option key={b}>{b}</option>)}
                    </select>
                    <AdminMiniInput placeholder="Opening Nov 2026" value={editingLaunch.date_text} onChange={(val) => setEditingLaunch({ ...editingLaunch, date_text: val })} required isNight={isNight} />
                    <AdminMiniInput placeholder="Image URL" value={editingLaunch.image_data} onChange={(val) => setEditingLaunch({ ...editingLaunch, image_data: val })} required isNight={isNight} />
                    <AdminMiniInput placeholder="Tag Badge" value={editingLaunch.tag} onChange={(val) => setEditingLaunch({ ...editingLaunch, tag: val })} required isNight={isNight} />
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold">Accent Color:</span>
                      <input
                        type="color"
                        value={editingLaunch.accent}
                        onChange={(e) => setEditingLaunch({ ...editingLaunch, accent: e.target.value })}
                        className="h-10 w-20 rounded-xl border p-1 cursor-pointer"
                      />
                    </div>
                    <div className="mt-4 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingLaunch(null)}
                        className={`rounded-xl border px-4 py-2 text-xs font-bold ${isNight ? "border-slate-700 bg-slate-800" : "border-slate-300 bg-slate-100"}`}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2 text-xs font-black text-black hover:bg-amber-400"
                      >
                        <Save size={14} /> Save Launch
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* HERO SLIDER TAB */}
        {activeTab === "slides" && (
          <div className={`rounded-3xl border p-6 backdrop-blur-xl ${
            isNight ? "border-slate-800 bg-slate-900/60" : "border-amber-200/80 bg-white/90 shadow-xl shadow-amber-950/5"
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className={`font-display text-xl font-black ${isNight ? "text-white" : "text-slate-900"}`}>Hero Section & Slider Configuration</h2>
                <p className={`text-xs font-medium ${isNight ? "text-slate-400" : "text-amber-900/70"}`}>
                  Configure hero headlines, brand highlights, background images, investment prices, & CTAs rendered live in frontend Hero section.
                </p>
              </div>
              <button
                type="button"
                onClick={() => void handleResetDefaultSlides()}
                className="inline-flex items-center gap-2 rounded-2xl border border-amber-500/40 bg-amber-500/15 px-4 py-2.5 text-xs font-black text-amber-500 transition hover:bg-amber-500/25 shadow-md"
              >
                <RotateCcw size={15} /> Restore All 5 Brand Slides
              </button>
            </div>

            {/* Add Slide Form */}
            <form onSubmit={addSlide} className="mt-6 space-y-4 rounded-3xl border p-5 bg-amber-500/5 border-amber-500/20">
              <div className="flex items-center justify-between">
                <h3 className={`font-display text-sm font-extrabold uppercase tracking-wider text-amber-500`}>Add New Hero Slide</h3>
                <span className="text-[11px] font-bold text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                  ✨ Simple Mode: Just paste Image URL & Title!
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-amber-500">
                    Hero Slide Image URL *
                  </label>
                  <AdminMiniInput
                    placeholder="https://example.com/image.png or /images/your-banner.jpg"
                    value={slideForm.image_url}
                    onChange={(val) => setSlideForm((f) => ({ ...f, image_url: val }))}
                    required
                    isNight={isNight}
                  />
                  <p className="text-[10.5px] font-semibold text-slate-400">Paste any image link (WebP, PNG, JPG, or Unsplash/CDN link).</p>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-amber-500">
                    Hero Title Headline *
                  </label>
                  <AdminMiniInput
                    placeholder="e.g. Own India's Premier Multi-Brand Cafe"
                    value={slideForm.title}
                    onChange={(val) => setSlideForm((f) => ({ ...f, title: val }))}
                    required
                    isNight={isNight}
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">Brand Name</label>
                  <select
                    value={slideForm.brand_name}
                    onChange={(e) => setSlideForm((f) => ({ ...f, brand_name: e.target.value }))}
                    className={`w-full rounded-2xl border px-3 py-2 text-xs font-bold ${
                      isNight ? "border-slate-800 bg-slate-900 text-white" : "border-amber-200 bg-white text-slate-900"
                    }`}
                  >
                    <option value="Family Cafe King">Family Cafe King</option>
                    <option value="Chai Cafe King">Chai Cafe King</option>
                    <option value="Paan King">Paan King</option>
                    <option value="Shake & Soda King">Shake & Soda King</option>
                    <option value="Lassi King">Lassi King</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">Badge Tag (Optional)</label>
                  <AdminMiniInput
                    placeholder="e.g. 350+ Outlets All Over India"
                    value={slideForm.badge_text}
                    onChange={(val) => setSlideForm((f) => ({ ...f, badge_text: val }))}
                    isNight={isNight}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">Investment Price Tag (Optional)</label>
                  <AdminMiniInput
                    placeholder="e.g. ₹3 - 10 Lakhs"
                    value={slideForm.price_display}
                    onChange={(val) => setSlideForm((f) => ({ ...f, price_display: val }))}
                    isNight={isNight}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">Subtitle / Description (Optional)</label>
                <AdminMiniInput
                  placeholder="e.g. High margin franchise with complete SOPs, equipment, and launch marketing support."
                  value={slideForm.subtitle}
                  onChange={(val) => setSlideForm((f) => ({ ...f, subtitle: val }))}
                  isNight={isNight}
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">Accent Color:</span>
                  <input
                    type="color"
                    value={slideForm.accent_color}
                    onChange={(e) => setSlideForm((f) => ({ ...f, accent_color: e.target.value }))}
                    className="h-8 w-14 rounded-xl border p-0.5 cursor-pointer"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-6 py-3 text-xs font-black text-black hover:bg-amber-400 shadow-md shadow-amber-500/20 transition cursor-pointer"
                >
                  <Plus size={15} /> Add Hero Slide Now
                </button>
              </div>
            </form>


            {/* Slides Cards List */}
            <div className="mt-6 space-y-4">
              {slides.map((slide, idx) => (
                <article key={slide.id} className={`rounded-3xl border p-5 transition-all ${
                  isNight ? "border-slate-800 bg-slate-950" : "border-amber-200/80 bg-white shadow-md shadow-amber-950/5"
                }`}>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-black text-amber-500">
                          Slide #{idx + 1}
                        </span>
                        <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold ${slide.is_active !== false ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-slate-500/20 text-slate-400 border-slate-500/30"}`}>
                          {slide.is_active !== false ? "Active in Frontend" : "Hidden"}
                        </span>
                      </div>
                      <h3 className={`font-display text-lg font-black ${isNight ? "text-white" : "text-slate-900"}`}>{slide.title}</h3>
                      <p className="text-xs font-bold text-amber-500">Brand: {slide.brand_name} · Investment: {slide.price_display} · Space: {slide.space_req}</p>
                      <p className={`text-xs ${isNight ? "text-slate-400" : "text-amber-900/70"}`}>{slide.subtitle}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => void toggleSlideActive(slide)}
                        className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold ${
                          slide.is_active !== false ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-slate-800 text-slate-400 border-slate-700"
                        }`}
                      >
                        {slide.is_active !== false ? <Eye size={14} /> : <EyeOff size={14} />} {slide.is_active !== false ? "Active" : "Hidden"}
                      </button>
                      <button
                        onClick={() => setEditingSlide(slide)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-500 hover:bg-amber-500/20"
                      >
                        <Edit3 size={14} /> Edit Slide
                      </button>
                      <button
                        onClick={() => void removeSlide(slide.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-500 hover:bg-rose-600/30"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Slide Edit Modal */}
            {editingSlide && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                <div className={`w-full max-w-xl rounded-3xl border p-6 shadow-2xl ${
                  isNight ? "border-slate-800 bg-slate-900 text-white" : "border-amber-200 bg-white text-slate-900"
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-lg font-bold">Edit Hero Slide</h3>
                    <button onClick={() => setEditingSlide(null)} className="text-slate-400 hover:text-white">
                      <XCircle size={20} />
                    </button>
                  </div>
                  <form onSubmit={saveEditSlide} className="space-y-3">
                    <AdminMiniInput placeholder="Hero Title Headline" value={editingSlide.title} onChange={(val) => setEditingSlide({ ...editingSlide, title: val })} required isNight={isNight} />
                    <AdminMiniInput placeholder="Brand Name" value={editingSlide.brand_name} onChange={(val) => setEditingSlide({ ...editingSlide, brand_name: val })} required isNight={isNight} />
                    <AdminMiniInput placeholder="Subtitle Description" value={editingSlide.subtitle} onChange={(val) => setEditingSlide({ ...editingSlide, subtitle: val })} isNight={isNight} />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <AdminMiniInput placeholder="Badge Text" value={editingSlide.badge_text} onChange={(val) => setEditingSlide({ ...editingSlide, badge_text: val })} isNight={isNight} />
                      <AdminMiniInput placeholder="Investment" value={editingSlide.price_display} onChange={(val) => setEditingSlide({ ...editingSlide, price_display: val })} isNight={isNight} />
                      <AdminMiniInput placeholder="Space Req" value={editingSlide.space_req} onChange={(val) => setEditingSlide({ ...editingSlide, space_req: val })} isNight={isNight} />
                      <AdminMiniInput placeholder="CTA Text" value={editingSlide.cta_text} onChange={(val) => setEditingSlide({ ...editingSlide, cta_text: val })} isNight={isNight} />
                    </div>
                    <AdminMiniInput placeholder="Image URL" value={editingSlide.image_url} onChange={(val) => setEditingSlide({ ...editingSlide, image_url: val })} isNight={isNight} />
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingSlide.is_active}
                          onChange={(e) => setEditingSlide({ ...editingSlide, is_active: e.target.checked })}
                          className="h-4 w-4 rounded accent-amber-500"
                        />
                        Active in Hero Slider
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold">Accent:</span>
                        <input
                          type="color"
                          value={editingSlide.accent_color}
                          onChange={(e) => setEditingSlide({ ...editingSlide, accent_color: e.target.value })}
                          className="h-9 w-16 rounded-xl border p-1 cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="mt-5 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingSlide(null)}
                        className={`rounded-xl border px-4 py-2 text-xs font-bold ${isNight ? "border-slate-700 bg-slate-800" : "border-slate-300 bg-slate-100"}`}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2 text-xs font-black text-black hover:bg-amber-400"
                      >
                        <Save size={14} /> Save Hero Slide
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CITY BOOKINGS TAB */}
        {activeTab === "bookings" && (
          <div className={`rounded-3xl border p-6 backdrop-blur-xl ${
            isNight ? "border-slate-800 bg-slate-900/60" : "border-amber-200/80 bg-white/90 shadow-xl shadow-amber-950/5"
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 className={`font-display text-xl font-black ${isNight ? "text-white" : "text-slate-900"}`}>City Bookings & Slot Reservations</h2>
                <p className={`text-xs font-medium ${isNight ? "text-slate-400" : "text-amber-900/70"}`}>Franchise city slot bookings and city reservation applications received from customers.</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => downloadCsvFile(`city-bookings-${new Date().toISOString().slice(0, 10)}.csv`, bookingsToCsv(bookings))}
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-500 px-4.5 py-2 text-xs font-extrabold text-white shadow-md shadow-emerald-950/20 transition-all cursor-pointer"
                >
                  <Download size={15} /> Export CSV
                </button>
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-extrabold text-amber-500">
                  {bookings.length} Total City Bookings
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {bookings.length === 0 && (
                <div className={`rounded-2xl border border-dashed px-5 py-12 text-center ${
                  isNight ? "border-slate-800 bg-slate-950" : "border-amber-200 bg-amber-50/40"
                }`}>
                  <Calendar size={28} className="mx-auto text-amber-500 mb-2" />
                  <p className={`text-sm font-bold ${isNight ? "text-slate-400" : "text-amber-900/70"}`}>No city bookings submitted yet.</p>
                </div>
              )}

              {bookings.map((b) => (
                <div key={b._id || b.id} className={`flex flex-wrap items-start justify-between gap-4 rounded-2xl border p-4 ${
                  isNight ? "border-slate-800 bg-slate-950" : "border-amber-200/80 bg-white shadow-sm"
                }`}>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className={`font-bold text-base capitalize ${isNight ? "text-white" : "text-slate-900"}`}>{b.name || "City Booking Applicant"}</h3>
                      <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-500">
                        📞 {b.phone}
                      </span>
                      {b.email && <span className={`text-xs ${isNight ? "text-slate-400" : "text-amber-900/70"}`}>✉️ {b.email}</span>}
                    </div>

                    <p className={`text-xs font-semibold ${isNight ? "text-slate-300" : "text-amber-900/90"}`}>
                      Brand: <span className="text-amber-500 font-extrabold">{b.brand || "Family Cafe King"}</span>
                      {(b as any).city && <> · City: <span className="font-extrabold text-emerald-400">{(b as any).city}</span></>}
                      <> · Budget: <span className="font-extrabold text-sky-400">{(b as any).budget || "Not Specified"}</span></>
                      {b.date && <> · Date: {b.date}</>}
                      {b.time && <> · Time: {b.time}</>}
                    </p>

                    <p className={`mt-2 text-xs italic p-2.5 rounded-xl border ${
                      isNight ? "bg-slate-900 border-slate-800 text-amber-300" : "bg-amber-50 border-amber-200 text-amber-950 font-medium"
                    }`}>
                      "{b.notes || `City Booking Request for ${(b as any).city || "City"}`}"
                    </p>
                  </div>
                  <button
                    onClick={() => void removeBooking((b._id || b.id)!)}
                    className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-500 hover:bg-rose-500/20 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONTACT INQUIRIES TAB */}
        {activeTab === "contacts" && (
          <div className={`rounded-3xl border p-6 backdrop-blur-xl ${
            isNight ? "border-slate-800 bg-slate-900/60" : "border-amber-200/80 bg-white/90 shadow-xl shadow-amber-950/5"
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 className={`font-display text-xl font-black ${isNight ? "text-white" : "text-slate-900"}`}>Direct Contact Inquiries</h2>
                <p className={`text-xs font-medium ${isNight ? "text-slate-400" : "text-amber-900/70"}`}>Messages submitted through the contact form on customer site.</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => downloadCsvFile(`contact-inquiries-${new Date().toISOString().slice(0, 10)}.csv`, contactsToCsv(contacts))}
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-500 px-4.5 py-2 text-xs font-extrabold text-white shadow-md shadow-emerald-950/20 transition-all cursor-pointer"
                >
                  <Download size={15} /> Export CSV
                </button>
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-extrabold text-amber-500">
                  {contacts.length} Total Inquiries
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {contacts.length === 0 && (
                <div className={`rounded-2xl border border-dashed px-5 py-12 text-center ${
                  isNight ? "border-slate-800 bg-slate-950" : "border-amber-200 bg-amber-50/40"
                }`}>
                  <Mail size={28} className="mx-auto text-amber-500 mb-2" />
                  <p className={`text-sm font-bold ${isNight ? "text-slate-400" : "text-amber-900/70"}`}>No contact messages received yet.</p>
                </div>
              )}

              {contacts.map((c) => (
                <div key={c._id || c.id} className={`flex flex-wrap items-start justify-between gap-4 rounded-2xl border p-4 ${
                  isNight ? "border-slate-800 bg-slate-950" : "border-amber-200/80 bg-white shadow-sm"
                }`}>
                  <div>
                    <h3 className={`font-bold ${isNight ? "text-white" : "text-slate-900"}`}>{c.name} <span className="text-xs text-amber-500">({c.phone} · {c.email || "No Email"})</span></h3>
                    {c.subject && <p className={`text-xs font-semibold mt-1 ${isNight ? "text-slate-300" : "text-amber-900/80"}`}>Subject: {c.subject}</p>}
                    <p className={`mt-2 text-xs p-3 rounded-xl border ${
                      isNight ? "text-slate-300 bg-slate-900 border-slate-800" : "text-slate-800 bg-amber-50/50 border-amber-200/70"
                    }`}>"{c.message}"</p>
                  </div>
                  <button
                    onClick={() => void removeContact((c._id || c.id)!)}
                    className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-500 hover:bg-rose-500/20"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function AdminStat({
  icon,
  label,
  value,
  badge,
  highlight,
  isNight = true,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  badge?: string;
  highlight?: boolean;
  isNight?: boolean;
}) {
  return (
    <div className={`rounded-3xl border p-5 backdrop-blur-xl transition-all ${
      highlight
        ? isNight
          ? "border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 text-white"
          : "border-amber-400 bg-gradient-to-br from-amber-100 via-orange-50 to-white text-slate-900 shadow-lg shadow-amber-500/10"
        : isNight
          ? "border-slate-800 bg-slate-900/60 text-white"
          : "border-amber-200/80 bg-white/90 text-slate-900 shadow-md shadow-amber-950/5"
    }`}>
      <div className="flex items-center justify-between">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-black font-bold">
          {icon}
        </span>
        {badge && (
          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
            isNight ? "bg-slate-800 text-slate-400" : "bg-amber-100 text-amber-900"
          }`}>
            {badge}
          </span>
        )}
      </div>
      <p className={`mt-4 font-display text-3xl font-black ${isNight ? "text-white" : "text-slate-900"}`}>{value}</p>
      <p className={`text-xs font-bold mt-1 ${isNight ? "text-slate-400" : "text-amber-900/70"}`}>{label}</p>
    </div>
  );
}

function AdminField({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  isNight = true,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  isNight?: boolean;
}) {
  return (
    <label className="block">
      <span className={`mb-1.5 block text-xs font-bold uppercase tracking-wider ${isNight ? "text-slate-300" : "text-amber-950"}`}>{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-2xl border px-4 py-3 text-xs font-bold outline-none transition-all ${
          isNight
            ? "border-slate-800 bg-slate-950 text-white focus:border-amber-500"
            : "border-amber-200/90 bg-white text-slate-900 focus:border-amber-600 shadow-sm"
        }`}
      />
    </label>
  );
}

function AdminMiniInput({
  value,
  onChange,
  placeholder,
  required,
  isNight = true,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  required?: boolean;
  isNight?: boolean;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className={`w-full rounded-2xl border px-3 py-3 text-xs font-bold outline-none transition-all ${
        isNight
          ? "border-slate-800 bg-slate-950 text-white focus:border-amber-500"
          : "border-amber-200/90 bg-white text-slate-900 focus:border-amber-600 shadow-sm"
      }`}
    />
  );
}
