import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Crown,
  Download,
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
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  DEFAULT_UPCOMING,
  deleteLaunch,
  deleteLead,
  leadsToCsv,
  listLaunches,
  listLeads,
  saveLaunch,
  signInAdmin,
  updateLead,
  type LaunchRecord,
  type LeadRecord,
  type LeadStatus,
} from "../lib/database";
import {
  apiDeleteBooking,
  apiDeleteContact,
  apiGetBookings,
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

export function AdminPortal() {
  const [session, setSession] = useState<AdminSession | null>(() => {
    const raw = window.sessionStorage.getItem("fck_admin_session");
    try {
      return raw ? (JSON.parse(raw) as AdminSession) : null;
    } catch {
      return null;
    }
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<"overview" | "leads" | "launches" | "bookings" | "contacts">("overview");
  const [isMernOnline, setIsMernOnline] = useState<boolean | null>(null);

  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [launches, setLaunches] = useState<LaunchRecord[]>([]);
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

  const checkHealth = useCallback(async () => {
    const healthy = await checkBackendHealth();
    setIsMernOnline(healthy);
  }, []);

  const loadData = useCallback(async () => {
    if (!session) return;
    setDataLoading(true);
    setDataError("");
    try {
      await checkHealth();
      const [leadRows, launchRows] = await Promise.all([
        listLeads(session.accessToken),
        listLaunches(session.accessToken),
      ]);
      setLeads(leadRows);
      setLaunches(launchRows);

      try {
        const [bookingRows, contactRows] = await Promise.all([
          apiGetBookings(session.accessToken),
          apiGetContacts(session.accessToken),
        ]);
        setBookings(bookingRows);
        setContacts(contactRows);
      } catch {
        // Non-fatal if bookings/contacts endpoints are empty
      }
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

  const stats = useMemo(
    () => ({
      total: leads.length,
      new: leads.filter((lead) => lead.status === "New").length,
      contacted: leads.filter((lead) => lead.status === "Contacted").length,
      interested: leads.filter((lead) => lead.status === "Interested").length,
      converted: leads.filter((lead) => lead.status === "Converted").length,
      lost: leads.filter((lead) => lead.status === "Lost").length,
      launchesCount: launches.length,
      bookingsCount: bookings.length,
      contactsCount: contacts.length,
    }),
    [leads, launches, bookings, contacts]
  );

  const fillDefaultCredentials = () => {
    setEmail("shivamsri.srivastava2@gmail.com");
    setPassword("Shivam@1234");
  };

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
      await apiDeleteBooking(id, session.accessToken);
      setBookings((current) => current.filter((b) => (b._id || b.id) !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not delete booking");
    }
  };

  const removeContact = async (id: string) => {
    if (!session || !window.confirm("Delete this contact inquiry?")) return;
    try {
      await apiDeleteContact(id, session.accessToken);
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

  const removeLaunch = async (id: string) => {
    if (!session || !window.confirm("Delete this upcoming launch card?")) return;
    await deleteLaunch(id, session.accessToken);
    setLaunches((current) => current.filter((launch) => launch.id !== id));
  };

  const downloadCsv = () => {
    const blob = new Blob([leadsToCsv(filteredLeads)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `family-cafe-king-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!session) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#0d0708] px-4 py-12 text-slate-100 font-sans selection:bg-amber-500 selection:text-black">
        <div className="w-full max-w-md rounded-3xl border border-amber-500/20 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-2xl">
          <a href="#top" className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 hover:text-amber-300">
            <ArrowLeft size={14} /> Return to customer site
          </a>

          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-600 to-rose-700 text-white shadow-lg shadow-amber-900/40">
              <ShieldCheck size={28} />
            </span>
            <div>
              <h1 className="font-display text-2xl font-black tracking-tight text-white">Admin Portal</h1>
              <p className="text-xs font-medium text-slate-400">
                Family Cafe King Management
              </p>
            </div>
          </div>

          {/* Connection status indicator */}
          <div className="mt-6 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-xs font-semibold">
            <span className="text-slate-400">Backend Server</span>
            <span className="inline-flex items-center gap-2 font-bold">
              <span className={`h-2.5 w-2.5 rounded-full ${isMernOnline ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
              {isMernOnline ? "MERN Express (Active)" : "Local Offline Mode"}
            </span>
          </div>

          <form onSubmit={login} className="mt-6 space-y-4">
            <AdminField
              label="Admin Email"
              value={email}
              onChange={setEmail}
              type="email"
              required
              placeholder="admin@familycafeking.com"
            />
            <AdminField
              label="Admin Password"
              value={password}
              onChange={setPassword}
              type="password"
              required
              placeholder="••••••••"
            />

            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={fillDefaultCredentials}
                className="text-amber-400 hover:underline font-bold"
              >
                Auto-fill default admin
              </button>
            </div>

            {authError && (
              <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-300">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 px-5 py-4 font-black tracking-wide text-white shadow-xl shadow-amber-900/20 hover:brightness-110 disabled:opacity-70 transition-all"
            >
              {authLoading && <Loader2 size={18} className="animate-spin" />}
              Sign In to Admin Dashboard
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0708] text-slate-100 font-sans selection:bg-amber-500 selection:text-black">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3.5">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-600 to-rose-700 text-white shadow-md">
              <Crown size={22} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-xl font-black text-white sm:text-2xl">
                  Family Cafe King
                </h1>
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
                  Admin CRM
                </span>
              </div>
              <p className="text-xs font-bold text-slate-400">
                {isMernOnline ? "🟢 Connected to MongoDB Backend" : "🟡 Local Fallback Mode"} · {session.email}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href="#top"
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800"
            >
              Live Site
            </a>
            <button
              onClick={() => void loadData()}
              className="inline-flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-400 hover:bg-amber-500/20"
            >
              <RefreshCw size={14} className={dataLoading ? "animate-spin" : ""} /> Refresh
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600/20 border border-rose-500/40 px-4 py-2 text-xs font-bold text-rose-300 hover:bg-rose-600/30"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mx-auto max-w-7xl px-6">
          <nav className="flex gap-2 overflow-x-auto border-t border-slate-800/60 py-2.5">
            {[
              { id: "overview", label: "Overview", icon: <TrendingUp size={15} /> },
              { id: "leads", label: `Franchise Leads (${stats.total})`, icon: <Users size={15} /> },
              { id: "launches", label: `Upcoming Launches (${stats.launchesCount})`, icon: <MapPin size={15} /> },
              { id: "bookings", label: `Bookings (${stats.bookingsCount})`, icon: <Calendar size={15} /> },
              { id: "contacts", label: `Inquiries (${stats.contactsCount})`, icon: <Inbox size={15} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
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
              <AdminStat icon={<Users size={22} />} label="Total Franchise Leads" value={stats.total} badge="Lifetime" />
              <AdminStat icon={<Sparkles size={22} />} label="New Inquiries" value={stats.new} badge="Action Required" highlight />
              <AdminStat icon={<CheckCircle2 size={22} />} label="Converted Franchisees" value={stats.converted} badge="Success" />
              <AdminStat icon={<MapPin size={22} />} label="Upcoming City Launches" value={stats.launchesCount} badge="Active" />
            </div>

            {/* Pipeline Status Breakdown */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl">
              <h2 className="font-display text-lg font-bold text-white mb-4">Lead Status Pipeline</h2>
              <div className="grid gap-3 sm:grid-cols-5">
                {[
                  { status: "New", count: stats.new, color: "bg-amber-500" },
                  { status: "Contacted", count: stats.contacted, color: "bg-sky-500" },
                  { status: "Interested", count: stats.interested, color: "bg-emerald-500" },
                  { status: "Converted", count: stats.converted, color: "bg-green-400" },
                  { status: "Lost", count: stats.lost, color: "bg-rose-500" },
                ].map((item) => (
                  <div key={item.status} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{item.status}</p>
                    <p className="mt-2 text-2xl font-black text-white">{item.count}</p>
                    <div className="mt-3 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
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
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-lg font-bold text-white">Recent Inquiries Stream</h3>
                  <button onClick={() => setActiveTab("leads")} className="text-xs font-bold text-amber-400 hover:underline">
                    View All Leads &rarr;
                  </button>
                </div>
                <div className="space-y-3">
                  {leads.slice(0, 5).map((lead) => (
                    <div key={lead.id} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4">
                      <div>
                        <p className="font-bold text-white">{lead.name} <span className="text-xs font-normal text-slate-400">({lead.city})</span></p>
                        <p className="text-xs font-semibold text-amber-400">{lead.brand} · {lead.budget}</p>
                      </div>
                      <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${statusClass(lead.status)}`}>
                        {lead.status}
                      </span>
                    </div>
                  ))}
                  {leads.length === 0 && <p className="text-xs text-slate-500">No leads submitted yet.</p>}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-white mb-2">Export & Utilities</h3>
                  <p className="text-xs text-slate-400 mb-6">Download lead database in standard CSV format for CRM import or email marketing.</p>
                  <button
                    onClick={downloadCsv}
                    className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3.5 text-xs font-extrabold text-white hover:bg-emerald-500 shadow-lg shadow-emerald-900/30 transition-all"
                  >
                    <Download size={16} /> Export All Leads (CSV)
                  </button>
                </div>
                <div className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-300">
                  💡 <b>Tip:</b> Leads submitted by users on the landing page are saved directly to MongoDB and trigger instant dashboard notifications.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LEADS CRM TAB */}
        {activeTab === "leads" && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-black text-white">Franchise Lead CRM</h2>
                <p className="text-xs font-medium text-slate-400">Search, filter, update status, add notes, and contact prospects.</p>
              </div>
              <button
                onClick={downloadCsv}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-emerald-500"
              >
                <Download size={14} /> Export CSV
              </button>
            </div>

            {/* Filter controls */}
            <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_220px_190px]">
              <div className="relative block">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search lead by name, phone, city, budget..."
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950 py-3 pl-10 pr-4 text-xs font-bold text-white outline-none focus:border-amber-500"
                />
              </div>
              <select
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
                className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs font-bold text-white outline-none focus:border-amber-500"
              >
                {brandOptions.map((b) => <option key={b}>{b}</option>)}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs font-bold text-white outline-none focus:border-amber-500"
              >
                {["All statuses", ...LEAD_STATUSES].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            {/* Leads Cards */}
            <div className="mt-6 space-y-4">
              {filteredLeads.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950 px-5 py-12 text-center">
                  <Filter size={28} className="mx-auto text-slate-500 mb-2" />
                  <p className="text-sm font-bold text-slate-400">No matching leads found.</p>
                </div>
              )}

              {filteredLeads.map((lead) => (
                <article key={lead.id} className="rounded-3xl border border-slate-800/80 bg-slate-950 p-5 hover:border-slate-700 transition-all">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-display text-lg font-bold text-white">{lead.name}</h3>
                        <span className={`rounded-full border px-3 py-0.5 text-[11px] font-extrabold ${statusClass(lead.status)}`}>
                          {lead.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs font-bold text-amber-400">
                        {lead.brand} · Budget: {lead.budget}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                        <MapPin size={13} className="text-orange-500" /> {lead.city} · <Clock size={13} /> {new Date(lead.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={`tel:${lead.phone.replace(/\s/g, "")}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 border border-slate-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-700"
                      >
                        <Phone size={13} /> Call
                      </a>
                      <a
                        href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600/20 border border-emerald-500/30 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-600/30"
                      >
                        <MessageCircle size={13} /> WhatsApp
                      </a>
                      <button
                        onClick={() => void removeLead(lead.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600/20 border border-rose-500/30 px-3 py-1.5 text-xs font-bold text-rose-300 hover:bg-rose-600/30"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>

                  {/* Details Grid & Status/Notes Controls */}
                  <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_240px]">
                    <div className="grid gap-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-300 sm:grid-cols-2">
                      <p><b>Phone:</b> {lead.phone}</p>
                      <p><b>Email:</b> {lead.email || "N/A"}</p>
                      <p><b>Budget:</b> {lead.budget}</p>
                      <p><b>Source:</b> {lead.source_page || "Landing Page"}</p>
                    </div>
                    <div className="space-y-2">
                      <select
                        value={lead.status}
                        onChange={(e) => void saveLeadField(lead.id, { status: e.target.value as LeadStatus })}
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-bold text-white outline-none focus:border-amber-500"
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
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* UPCOMING LAUNCHES TAB */}
        {activeTab === "launches" && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-black text-white">Upcoming Franchise Launch Manager</h2>
                <p className="text-xs font-medium text-slate-400">Add or manage city launch cards rendered live on the website.</p>
              </div>
            </div>

            {/* Add Launch Form */}
            <form onSubmit={addLaunch} className="mt-6 grid gap-3 lg:grid-cols-[140px_1fr_160px_1fr_140px_80px_auto]">
              <AdminMiniInput placeholder="City Name" value={launchForm.city} onChange={(val) => setLaunchForm((f) => ({ ...f, city: val }))} required />
              <select
                value={launchForm.brand}
                onChange={(e) => setLaunchForm((f) => ({ ...f, brand: e.target.value }))}
                className="rounded-2xl border border-slate-800 bg-slate-950 px-3 py-3 text-xs font-bold text-white outline-none focus:border-amber-500"
              >
                {["Family Cafe King", "Chai Cafe King", "Paan King", "Shake & Soda King", "Lassi King", "Multi-Brand Flagship"].map((b) => <option key={b}>{b}</option>)}
              </select>
              <AdminMiniInput placeholder="Opening Nov 2026" value={launchForm.date_text} onChange={(val) => setLaunchForm((f) => ({ ...f, date_text: val }))} required />
              <AdminMiniInput placeholder="Image URL" value={launchForm.image_data} onChange={(val) => setLaunchForm((f) => ({ ...f, image_data: val }))} required />
              <AdminMiniInput placeholder="Tag Badge" value={launchForm.tag} onChange={(val) => setLaunchForm((f) => ({ ...f, tag: val }))} required />
              <input
                type="color"
                value={launchForm.accent}
                onChange={(e) => setLaunchForm((f) => ({ ...f, accent: e.target.value }))}
                className="h-[44px] w-full rounded-2xl border border-slate-800 bg-slate-950 p-1 cursor-pointer"
                title="Accent color"
              />
              <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-500 px-5 py-3 text-xs font-extrabold text-black hover:bg-amber-400">
                <Plus size={15} /> Add
              </button>
            </form>

            {/* Cards Grid */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {launches.map((launch) => (
                <article key={launch.id} className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950">
                  <img src={launch.image_data} alt={launch.city} className="h-44 w-full object-cover" />
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="inline-block rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-400 border border-amber-500/30">
                          {launch.tag}
                        </span>
                        <h3 className="font-display text-lg font-extrabold text-white mt-1">{launch.brand}</h3>
                        <p className="text-xs font-bold text-slate-300">{launch.city} · {launch.date_text}</p>
                      </div>
                      <button
                        onClick={() => void removeLaunch(launch.id)}
                        className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-2 text-rose-400 hover:bg-rose-500/20"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* BOOKINGS TAB */}
        {activeTab === "bookings" && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl">
            <h2 className="font-display text-xl font-black text-white">Customer Table / Event Bookings</h2>
            <p className="text-xs font-medium text-slate-400 mb-6">Reservations and cafe table bookings received from customers.</p>

            <div className="space-y-3">
              {bookings.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950 px-5 py-12 text-center">
                  <Calendar size={28} className="mx-auto text-slate-500 mb-2" />
                  <p className="text-sm font-bold text-slate-400">No customer bookings submitted yet.</p>
                </div>
              )}

              {bookings.map((b) => (
                <div key={b._id || b.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <div>
                    <h3 className="font-bold text-white">{b.name} <span className="text-xs text-amber-400">({b.phone})</span></h3>
                    <p className="text-xs text-slate-400">
                      Date: {b.date || "N/A"} · Time: {b.time || "N/A"} · Guests: {b.guests || 2} · Brand: {b.brand || "Family Cafe King"}
                    </p>
                    {b.notes && <p className="mt-1 text-xs italic text-slate-400">"{b.notes}"</p>}
                  </div>
                  <button
                    onClick={() => void removeBooking((b._id || b.id)!)}
                    className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-300 hover:bg-rose-500/20"
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
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl">
            <h2 className="font-display text-xl font-black text-white">Direct Contact Inquiries</h2>
            <p className="text-xs font-medium text-slate-400 mb-6">Messages submitted through the contact form on customer site.</p>

            <div className="space-y-3">
              {contacts.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950 px-5 py-12 text-center">
                  <Mail size={28} className="mx-auto text-slate-500 mb-2" />
                  <p className="text-sm font-bold text-slate-400">No contact messages received yet.</p>
                </div>
              )}

              {contacts.map((c) => (
                <div key={c._id || c.id} className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <div>
                    <h3 className="font-bold text-white">{c.name} <span className="text-xs text-amber-400">({c.phone} · {c.email || "No Email"})</span></h3>
                    {c.subject && <p className="text-xs font-semibold text-slate-300 mt-1">Subject: {c.subject}</p>}
                    <p className="mt-2 text-xs text-slate-300 bg-slate-900 p-3 rounded-xl border border-slate-800">"{c.message}"</p>
                  </div>
                  <button
                    onClick={() => void removeContact((c._id || c.id)!)}
                    className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-300 hover:bg-rose-500/20"
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
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  badge?: string;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-3xl border p-5 backdrop-blur-xl transition-all ${
      highlight ? "border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950" : "border-slate-800 bg-slate-900/60"
    }`}>
      <div className="flex items-center justify-between">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-black font-bold">
          {icon}
        </span>
        {badge && (
          <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-slate-400">
            {badge}
          </span>
        )}
      </div>
      <p className="mt-4 font-display text-3xl font-black text-white">{value}</p>
      <p className="text-xs font-bold text-slate-400 mt-1">{label}</p>
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
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs font-bold text-white outline-none focus:border-amber-500"
      />
    </label>
  );
}

function AdminMiniInput({
  value,
  onChange,
  placeholder,
  required,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-3 py-3 text-xs font-bold text-white outline-none focus:border-amber-500"
    />
  );
}
