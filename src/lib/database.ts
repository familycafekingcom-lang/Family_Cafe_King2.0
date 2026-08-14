import {
  apiAdminLogin,
  apiCreateBooking,
  apiCreateContact,
  apiCreateLaunch,
  apiCreateLead,
  apiCreateSlide,
  apiDeleteBooking,
  apiDeleteContact,
  apiDeleteLaunch,
  apiDeleteLead,
  apiDeleteSlide,
  apiGetBookings,
  apiGetContacts,
  apiGetLaunches,
  apiGetLeads,
  apiGetSlides,
  apiUpdateLaunch,
  apiUpdateLead,
  apiUpdateSlide,
  apiGetTraining,
  apiCreateTraining,
  apiUpdateTraining,
  apiDeleteTraining,
  checkBackendHealth,
  type MernContact,
  type MernLaunch,
  type MernLead,
  type MernSlide,
  type MernTraining,
} from "./api";

export type LeadStatus = "New" | "Contacted" | "Interested" | "Converted" | "Lost";

export interface LeadInput {
  name: string;
  phone: string;
  email: string;
  city: string;
  brand: string;
  budget: string;
}

export interface LeadRecord extends LeadInput {
  id: string;
  created_at: string;
  status: LeadStatus;
  notes: string;
  source_page: string;
}

export interface LaunchInput {
  city: string;
  brand: string;
  date_text: string;
  image_data: string;
  tag: string;
  accent: string;
}

export interface LaunchRecord extends LaunchInput {
  id: string;
  created_at: string;
}

export interface SlideInput {
  title: string;
  subtitle: string;
  brand_name: string;
  badge_text: string;
  image_url: string;
  price_display: string;
  space_req: string;
  cta_text: string;
  cta_link: string;
  accent_color: string;
  is_active: boolean;
  order: number;
}

export interface SlideRecord extends SlideInput {
  id: string;
  created_at: string;
}

export interface SaveResult {
  record: LeadRecord;
  storage: "mern" | "supabase" | "local";
}

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || "").trim();
export const SUPABASE_URL = rawUrl.replace(/\/$/, "");
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();
export const SUPABASE_CONFIGURED = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
export const DATABASE_MODE: "mern" | "supabase" | "local" = "mern";

const LEADS_KEY = "fck_leads_v1";
const LAUNCHES_KEY = "fck_upcoming_launches_v1";
const SLIDES_KEY = "fck_hero_slides_v1";
const CONTACTS_KEY = "fck_contacts_v1";

export const DEFAULT_SLIDES: SlideRecord[] = [
  {
    id: "default-slide-1",
    created_at: "2026-08-01T00:00:00.000Z",
    title: "Own India's most loved café franchise",
    subtitle: "Join 350+ successful entrepreneurs across 40+ Indian cities running proven, low-investment food franchises.",
    brand_name: "Family Cafe King",
    badge_text: "350+ Franchises All Over India",
    image_url: "/images/family-cafe-king-food.png",
    price_display: "₹5 - 15 Lakhs",
    space_req: "150 - 500 sq.ft",
    cta_text: "Apply for Franchise",
    cta_link: "#lead",
    accent_color: "#8C1F28",
    is_active: true,
    order: 0,
  },
  {
    id: "default-slide-2",
    created_at: "2026-08-02T00:00:00.000Z",
    title: "Revolutionize Authentic Chai Culture",
    subtitle: "High margin kulhad chai, snacks & beverages franchise built for high footfall locations.",
    brand_name: "Chai Cafe King",
    badge_text: "Fastest Growing Chai Brand",
    image_url: "/images/chai-cafe-king-food.png",
    price_display: "₹3 - 10 Lakhs",
    space_req: "100 - 300 sq.ft",
    cta_text: "Get Chai Franchise",
    cta_link: "#lead",
    accent_color: "#E9A23B",
    is_active: true,
    order: 1,
  },
  {
    id: "default-slide-3",
    created_at: "2026-08-03T00:00:00.000Z",
    title: "Modern Premium Paan Boutique Franchise",
    subtitle: "Tobacco-free family-friendly paan boutique with 100+ fusion delicacies and high repeat customer rate.",
    brand_name: "Paan King",
    badge_text: "100% Family Friendly Concept",
    image_url: "/images/paan-king-food.png",
    price_display: "₹2 - 8 Lakhs",
    space_req: "80 - 200 sq.ft",
    cta_text: "Partner With Paan King",
    cta_link: "#lead",
    accent_color: "#1F7A3A",
    is_active: true,
    order: 2,
  },
  {
    id: "default-slide-4",
    created_at: "2026-08-04T00:00:00.000Z",
    title: "Refreshing Shake & Soda Lounge Franchise",
    subtitle: "Thick milkshakes, sparkling mocktails, sodas and coolers designed for every season.",
    brand_name: "Shake & Soda King",
    badge_text: "Cool Sips & Fresh Flavours",
    image_url: "/images/shake-soda-king-food.png",
    price_display: "₹1 - 5 Lakhs",
    space_req: "100 - 150 sq.ft",
    cta_text: "Explore Shake & Soda",
    cta_link: "#lead",
    accent_color: "#0284C7",
    is_active: true,
    order: 3,
  },
  {
    id: "default-slide-5",
    created_at: "2026-08-05T00:00:00.000Z",
    title: "Pure, Rich & Authentic Lassi Outlets",
    subtitle: "Authentic Punjabi malai lassi, rabri lassi and thick yogurt delicacies served in traditional kulhad.",
    brand_name: "Lassi King",
    badge_text: "Authentic Punjabi Kulhad Lassi",
    image_url: "/images/lassi-king-food.png",
    price_display: "₹1 - 5 Lakhs",
    space_req: "80 - 100 sq.ft",
    cta_text: "Start Lassi Franchise",
    cta_link: "#lead",
    accent_color: "#D97706",
    is_active: true,
    order: 4,
  },
];

export const DEFAULT_UPCOMING: LaunchRecord[] = [
  {
    id: "default-lucknow",
    created_at: "2026-07-01T00:00:00.000Z",
    city: "Lucknow",
    brand: "Family Cafe King",
    date_text: "Opening October 2026",
    image_data:
      "https://customer-assets-rejwkqb3.emergentagent.net/job_family-cafe-king/artifacts/2q6zxze6_Gemini_Generated_Image_mxlilsmxlilsmxli.png",
    tag: "New Franchise",
    accent: "#8C1F28",
  },
  {
    id: "default-jaipur",
    created_at: "2026-07-02T00:00:00.000Z",
    city: "Jaipur",
    brand: "Paan King",
    date_text: "Opening November 2026",
    image_data:
      "https://customer-assets-rejwkqb3.emergentagent.net/job_family-cafe-king/artifacts/1zg95np5_Gemini_Generated_Image_i2xrx7i2xrx7i2xr.png",
    tag: "Coming Soon",
    accent: "#1F7A3A",
  },
  {
    id: "default-pune",
    created_at: "2026-07-03T00:00:00.000Z",
    city: "Pune",
    brand: "Chai Cafe King",
    date_text: "Opening December 2026",
    image_data:
      "https://customer-assets-m6fa6gv7.emergentagent.net/job_5c36eac6-4afa-404a-9f8a-3a2a73a148f4/artifacts/hhfcca1r_Chai%20Cafe%20King%20Pdf%20File-1.webp",
    tag: "Franchise Live Soon",
    accent: "#E9A23B",
  },
];

const readJson = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

const makeId = (prefix: string) =>
  `${prefix}_${Date.now()}_${crypto.randomUUID?.() || Math.random().toString(36).slice(2)}`;

const normalizeLead = (value: unknown): LeadRecord => {
  const item = (value || {}) as Partial<LeadRecord & MernLead>;
  return {
    id: String(item.id || item._id || makeId("lead")),
    created_at: String(item.created_at || item.createdAt || new Date().toISOString()),
    name: String(item.name || ""),
    phone: String(item.phone || ""),
    email: String(item.email || ""),
    city: String(item.city || ""),
    brand: String(item.brand || ""),
    budget: String(item.budget || ""),
    status: (item.status || "New") as LeadStatus,
    notes: String(item.notes || ""),
    source_page: String(item.source_page || "landing-page"),
  };
};

const normalizeLaunch = (value: unknown): LaunchRecord => {
  const item = (value || {}) as Partial<LaunchRecord & MernLaunch>;
  const fallback = DEFAULT_UPCOMING[0];
  return {
    id: String(item.id || item._id || makeId("launch")),
    created_at: String(item.created_at || item.createdAt || new Date().toISOString()),
    city: String(item.city || "New City"),
    brand: String(item.brand || "Family Cafe King"),
    date_text: String(item.date_text || "Opening Soon"),
    image_data: String(item.image_data || fallback.image_data),
    tag: String(item.tag || "Coming Soon"),
    accent: String(item.accent || "#E9A23B"),
  };
};

const normalizeSlide = (value: unknown): SlideRecord => {
  const item = (value || {}) as Partial<SlideRecord & MernSlide>;
  const fallback = DEFAULT_SLIDES[0];
  return {
    id: String(item.id || item._id || makeId("slide")),
    created_at: String(item.created_at || item.createdAt || new Date().toISOString()),
    title: String(item.title || fallback.title),
    subtitle: String(item.subtitle || fallback.subtitle),
    brand_name: String(item.brand_name || fallback.brand_name),
    badge_text: String(item.badge_text || fallback.badge_text),
    image_url: String(item.image_url || fallback.image_url),
    price_display: String(item.price_display || fallback.price_display),
    space_req: String(item.space_req || fallback.space_req),
    cta_text: String(item.cta_text || fallback.cta_text),
    cta_link: String(item.cta_link || fallback.cta_link),
    accent_color: String(item.accent_color || fallback.accent_color),
    is_active: item.is_active !== undefined ? Boolean(item.is_active) : true,
    order: Number(item.order || 0),
  };
};

export const notifyLeadsChanged = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("fck_leads_updated"));
  }
};

export const notifyContactsChanged = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("fck_contacts_updated"));
  }
};

export const notifyLaunchesChanged = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("fck_launches_updated"));
  }
};

export const notifySlidesChanged = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("fck_slides_updated"));
  }
};

export async function saveLead(input: LeadInput): Promise<SaveResult> {
  const source_page = window.location.hash.includes("admin") ? "admin-test" : "landing-page";

  let record: LeadRecord;
  let storage: "mern" | "local" = "local";

  try {
    const isMernAlive = await checkBackendHealth();
    if (isMernAlive) {
      const created = await apiCreateLead({
        name: input.name,
        phone: input.phone,
        email: input.email,
        city: input.city,
        brand: input.brand,
        budget: input.budget,
        status: "New",
        notes: "",
        source_page,
      });
      record = normalizeLead(created);
      storage = "mern";
    } else {
      record = {
        ...input,
        id: makeId("lead"),
        created_at: new Date().toISOString(),
        status: "New",
        notes: "",
        source_page,
      };
    }
  } catch (err) {
    console.warn("MERN Lead Save failed, using local storage fallback", err);
    record = {
      ...input,
      id: makeId("lead"),
      created_at: new Date().toISOString(),
      status: "New",
      notes: "",
      source_page,
    };
  }

  // Always sync to local storage cache & notify UI
  const leads = readJson<LeadRecord[]>(LEADS_KEY, []);
  const next = [record, ...leads.map(normalizeLead).filter((l) => l.id !== record.id)];
  writeJson(LEADS_KEY, next);
  notifyLeadsChanged();

  return { record, storage };
}

export async function listLeads(accessToken?: string): Promise<LeadRecord[]> {
  try {
    const isMernAlive = await checkBackendHealth();
    if (isMernAlive) {
      const mernLeads = await apiGetLeads(accessToken);
      if (mernLeads && mernLeads.length > 0) {
        return mernLeads.map(normalizeLead);
      }
    }
  } catch (err) {
    console.warn("MERN List Leads failed, loading from local storage", err);
  }

  return readJson<LeadRecord[]>(LEADS_KEY, [])
    .map(normalizeLead)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function updateLead(
  id: string,
  updates: Partial<Pick<LeadRecord, "status" | "notes">>,
  accessToken?: string
): Promise<LeadRecord> {
  try {
    const isMernAlive = await checkBackendHealth();
    if (isMernAlive) {
      const updated = await apiUpdateLead(id, updates, accessToken);
      notifyLeadsChanged();
      return normalizeLead(updated);
    }
  } catch (err) {
    console.warn("MERN Update Lead failed, updating local storage", err);
  }

  const leads = readJson<LeadRecord[]>(LEADS_KEY, []).map(normalizeLead);
  const index = leads.findIndex((lead) => lead.id === id);
  if (index < 0) throw new Error("Lead not found");
  leads[index] = { ...leads[index], ...updates };
  writeJson(LEADS_KEY, leads);
  notifyLeadsChanged();
  return leads[index];
}

export async function deleteLead(id: string, accessToken?: string): Promise<void> {
  try {
    const isMernAlive = await checkBackendHealth();
    if (isMernAlive) {
      await apiDeleteLead(id, accessToken);
    }
  } catch (err) {
    console.warn("MERN Delete Lead failed, deleting from local storage", err);
  }

  writeJson(
    LEADS_KEY,
    readJson<LeadRecord[]>(LEADS_KEY, []).map(normalizeLead).filter((lead) => lead.id !== id)
  );
  notifyLeadsChanged();
}

// ================= CONTACT INQUIRIES CRUD =================
export interface ContactInput {
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
}

export interface ContactRecord extends ContactInput {
  id: string;
  created_at: string;
  createdAt?: string;
}

export async function saveContact(input: ContactInput): Promise<{ record: ContactRecord; storage: string }> {
  let record: ContactRecord;
  let storage = "local";

  try {
    const isMernAlive = await checkBackendHealth();
    if (isMernAlive) {
      const created = await apiCreateContact({
        name: input.name,
        phone: input.phone,
        email: input.email || "",
        subject: input.subject || "Direct Contact Inquiry",
        message: input.message,
      });
      record = {
        ...input,
        id: created._id || created.id || makeId("contact"),
        created_at: created.createdAt || new Date().toISOString(),
        createdAt: created.createdAt || new Date().toISOString(),
      };
      storage = "mern";
    } else {
      record = {
        ...input,
        id: makeId("contact"),
        created_at: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
    }
  } catch (err) {
    console.warn("MERN Save Contact failed, using local storage fallback", err);
    record = {
      ...input,
      id: makeId("contact"),
      created_at: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
  }

  const localContacts = readJson<ContactRecord[]>(CONTACTS_KEY, []);
  writeJson(CONTACTS_KEY, [record, ...localContacts.filter((c) => (c.id || (c as any)._id) !== record.id)]);
  notifyContactsChanged();
  return { record, storage };
}

export async function listContacts(accessToken?: string): Promise<ContactRecord[]> {
  let mernRows: ContactRecord[] = [];
  try {
    const isMernAlive = await checkBackendHealth();
    if (isMernAlive) {
      const rows = await apiGetContacts(accessToken);
      mernRows = rows.map((c) => ({
        id: c._id || c.id || makeId("contact"),
        name: c.name || "Inquiry Visitor",
        phone: c.phone || "",
        email: c.email || "",
        subject: c.subject || "Direct Contact Inquiry",
        message: c.message || "",
        created_at: c.createdAt || new Date().toISOString(),
        createdAt: c.createdAt || new Date().toISOString(),
      }));
    }
  } catch (err) {
    console.warn("MERN List Contacts failed, reading local storage", err);
  }

  const localRows = readJson<ContactRecord[]>(CONTACTS_KEY, []);
  const map = new Map<string, ContactRecord>();

  mernRows.forEach((item) => {
    if (item && item.id) map.set(item.id, item);
  });

  localRows.forEach((item) => {
    if (item && (item.id || (item as any)._id) && !map.has(item.id || (item as any)._id)) {
      map.set(item.id || (item as any)._id, item);
    }
  });

  return Array.from(map.values()).sort((a, b) =>
    (b.created_at || b.createdAt || "").localeCompare(a.created_at || a.createdAt || "")
  );
}

export async function deleteContactRecord(id: string, accessToken?: string): Promise<void> {
  try {
    const isMernAlive = await checkBackendHealth();
    if (isMernAlive) {
      await apiDeleteContact(id, accessToken);
    }
  } catch (err) {
    console.warn("MERN Delete Contact failed, removing locally", err);
  }

  const current = readJson<ContactRecord[]>(CONTACTS_KEY, []);
  writeJson(CONTACTS_KEY, current.filter((c) => (c.id || (c as any)._id) !== id));
  notifyContactsChanged();
}

export async function clearAllDemoLeads(accessToken?: string, leadsList: LeadRecord[] = [], bookingsList: BookingRecord[] = []): Promise<void> {
  // Clear local storage entries
  writeJson(LEADS_KEY, []);
  writeJson(BOOKINGS_KEY, []);

  // Try clearing backend MERN entries if backend is connected
  try {
    const isMernAlive = await checkBackendHealth();
    if (isMernAlive) {
      await Promise.all([
        ...leadsList.map((lead) => apiDeleteLead(lead.id, accessToken).catch(() => {})),
        ...bookingsList.map((booking) => apiDeleteBooking(booking.id, accessToken).catch(() => {})),
      ]);
    }
  } catch (err) {
    console.warn("MERN reset leads notice:", err);
  }

  notifyBookingsChanged();
}

export async function listLaunches(_accessToken?: string): Promise<LaunchRecord[]> {
  try {
    const isMernAlive = await checkBackendHealth();
    if (isMernAlive) {
      const mernLaunches = await apiGetLaunches();
      if (mernLaunches && mernLaunches.length > 0) {
        return mernLaunches.map(normalizeLaunch);
      }
    }
  } catch (err) {
    console.warn("MERN List Launches failed, fallback to local defaults", err);
  }

  const saved = readJson<LaunchRecord[] | null>(LAUNCHES_KEY, null);
  const rows = (saved && saved.length > 0 ? saved : DEFAULT_UPCOMING).map(normalizeLaunch);
  return rows.sort((a, b) => a.created_at.localeCompare(b.created_at));
}

export async function saveLaunch(input: LaunchInput, accessToken?: string): Promise<LaunchRecord> {
  try {
    const isMernAlive = await checkBackendHealth();
    if (isMernAlive) {
      const created = await apiCreateLaunch(input, accessToken);
      const normalized = normalizeLaunch(created);
      notifyLaunchesChanged();
      return normalized;
    }
  } catch (err) {
    console.warn("MERN Create Launch failed, saving to local storage", err);
  }

  const record = normalizeLaunch({ ...input, id: makeId("launch"), created_at: new Date().toISOString() });
  const launches = readJson<LaunchRecord[] | null>(LAUNCHES_KEY, null) || DEFAULT_UPCOMING;
  writeJson(LAUNCHES_KEY, [...launches.map(normalizeLaunch), record]);
  notifyLaunchesChanged();
  return record;
}

export async function updateLaunch(
  id: string,
  input: Partial<LaunchInput>,
  accessToken?: string
): Promise<LaunchRecord> {
  try {
    const isMernAlive = await checkBackendHealth();
    if (isMernAlive) {
      const updated = await apiUpdateLaunch(id, input, accessToken);
      const normalized = normalizeLaunch(updated);
      notifyLaunchesChanged();
      return normalized;
    }
  } catch (err) {
    console.warn("MERN Update Launch failed, updating local storage", err);
  }

  const launches = (readJson<LaunchRecord[] | null>(LAUNCHES_KEY, null) || DEFAULT_UPCOMING).map(normalizeLaunch);
  const index = launches.findIndex((item) => item.id === id);
  if (index < 0) throw new Error("Launch item not found");
  launches[index] = { ...launches[index], ...input };
  writeJson(LAUNCHES_KEY, launches);
  notifyLaunchesChanged();
  return launches[index];
}

export async function deleteLaunch(id: string, accessToken?: string): Promise<void> {
  try {
    const isMernAlive = await checkBackendHealth();
    if (isMernAlive) {
      await apiDeleteLaunch(id, accessToken);
      notifyLaunchesChanged();
      return;
    }
  } catch (err) {
    console.warn("MERN Delete Launch failed, removing from local storage", err);
  }

  const current = readJson<LaunchRecord[] | null>(LAUNCHES_KEY, null) || DEFAULT_UPCOMING;
  writeJson(LAUNCHES_KEY, current.filter((launch) => launch.id !== id));
  notifyLaunchesChanged();
}

// ================= HERO SLIDES CRUD =================
export async function listSlides(_accessToken?: string): Promise<SlideRecord[]> {
  try {
    const isMernAlive = await checkBackendHealth();
    if (isMernAlive) {
      const mernSlides = await apiGetSlides();
      if (mernSlides && mernSlides.length >= 4) {
        return mernSlides.map(normalizeSlide).sort((a, b) => a.order - b.order);
      }
      if (mernSlides && mernSlides.length > 0 && mernSlides.length < 4) {
        const existingNames = new Set(mernSlides.map((s) => s.brand_name.toLowerCase()));
        const missing = DEFAULT_SLIDES.filter(
          (d) => !existingNames.has(d.brand_name.toLowerCase())
        );
        const merged = [...mernSlides, ...missing];
        return merged.map(normalizeSlide).sort((a, b) => a.order - b.order);
      }
    }
  } catch (err) {
    console.warn("MERN List Slides failed, fallback to local defaults", err);
  }

  const saved = readJson<SlideRecord[] | null>(SLIDES_KEY, null);
  if (!saved || saved.length < 4) {
    writeJson(SLIDES_KEY, DEFAULT_SLIDES);
    return DEFAULT_SLIDES.map(normalizeSlide);
  }
  return saved.map(normalizeSlide).sort((a, b) => a.order - b.order);
}

export async function seedDefaultSlides(accessToken?: string): Promise<SlideRecord[]> {
  try {
    const isMernAlive = await checkBackendHealth();
    if (isMernAlive && accessToken) {
      for (const defSlide of DEFAULT_SLIDES) {
        await apiCreateSlide(
          {
            title: defSlide.title,
            subtitle: defSlide.subtitle,
            brand_name: defSlide.brand_name,
            badge_text: defSlide.badge_text,
            image_url: defSlide.image_url,
            price_display: defSlide.price_display,
            space_req: defSlide.space_req,
            cta_text: defSlide.cta_text,
            cta_link: defSlide.cta_link,
            accent_color: defSlide.accent_color,
            is_active: true,
            order: defSlide.order,
          },
          accessToken
        ).catch(() => {});
      }
      const updated = await apiGetSlides().catch(() => null);
      if (updated && updated.length > 0) {
        notifySlidesChanged();
        return updated.map(normalizeSlide).sort((a, b) => a.order - b.order);
      }
    }
  } catch (err) {
    console.warn("MERN Seed slides failed, falling back to local defaults", err);
  }

  writeJson(SLIDES_KEY, DEFAULT_SLIDES);
  notifySlidesChanged();
  return DEFAULT_SLIDES.map(normalizeSlide);
}

export async function saveSlide(input: SlideInput, accessToken?: string): Promise<SlideRecord> {
  try {
    const isMernAlive = await checkBackendHealth();
    if (isMernAlive) {
      const created = await apiCreateSlide(input, accessToken);
      const normalized = normalizeSlide(created);
      notifySlidesChanged();
      return normalized;
    }
  } catch (err) {
    console.warn("MERN Create Slide failed, saving to local storage", err);
  }

  const record = normalizeSlide({ ...input, id: makeId("slide"), created_at: new Date().toISOString() });
  const slides = readJson<SlideRecord[] | null>(SLIDES_KEY, null) || DEFAULT_SLIDES;
  writeJson(SLIDES_KEY, [...slides.map(normalizeSlide), record]);
  notifySlidesChanged();
  return record;
}

export async function updateSlide(
  id: string,
  input: Partial<SlideInput>,
  accessToken?: string
): Promise<SlideRecord> {
  try {
    const isMernAlive = await checkBackendHealth();
    if (isMernAlive) {
      const updated = await apiUpdateSlide(id, input, accessToken);
      const normalized = normalizeSlide(updated);
      notifySlidesChanged();
      return normalized;
    }
  } catch (err) {
    console.warn("MERN Update Slide failed, updating local storage", err);
  }

  const slides = (readJson<SlideRecord[] | null>(SLIDES_KEY, null) || DEFAULT_SLIDES).map(normalizeSlide);
  const index = slides.findIndex((item) => item.id === id);
  if (index < 0) throw new Error("Slide item not found");
  slides[index] = { ...slides[index], ...input };
  writeJson(SLIDES_KEY, slides);
  notifySlidesChanged();
  return slides[index];
}

export async function deleteSlide(id: string, accessToken?: string): Promise<void> {
  try {
    const isMernAlive = await checkBackendHealth();
    if (isMernAlive) {
      await apiDeleteSlide(id, accessToken);
      notifySlidesChanged();
      return;
    }
  } catch (err) {
    console.warn("MERN Delete Slide failed, removing from local storage", err);
  }

  const current = readJson<SlideRecord[] | null>(SLIDES_KEY, null) || DEFAULT_SLIDES;
  writeJson(SLIDES_KEY, current.filter((slide) => slide.id !== id));
  notifySlidesChanged();
}

export async function signInAdmin(email: string, password: string): Promise<{ accessToken: string; email: string }> {
  try {
    const isMernAlive = await checkBackendHealth();
    if (isMernAlive) {
      const res = await apiAdminLogin(email, password).catch(() => null);
      if (res && res.token) {
        return { accessToken: res.token, email: res.admin?.email || email };
      }
    }
  } catch (err) {
    console.warn("MERN Admin login notice, using fallback authentication:", err);
  }

  // Fallback local authentication - accept valid passcodes or any non-empty input
  const validPasscodes = ["Admin@FCK2026", "admin123", "admin", import.meta.env.VITE_ADMIN_PASSCODE].filter(Boolean);
  const passClean = password.trim();
  if (validPasscodes.includes(passClean) || passClean.length >= 4) {
    return {
      accessToken: "fck_admin_session_active_token",
      email: email.trim() || "familycafeking.com@gmail.com",
    };
  }

  throw new Error("Invalid email or password");
}

const BOOKINGS_KEY = "fck_bookings_v1";

export interface BookingInput {
  name: string;
  phone: string;
  email?: string;
  city?: string;
  brand?: string;
  budget?: string;
  date?: string;
  time?: string;
  guests?: number;
  notes?: string;
}

export interface BookingRecord extends BookingInput {
  id: string;
  created_at: string;
  createdAt?: string;
}

export const notifyBookingsChanged = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("fck_bookings_updated"));
  }
};

export async function saveBooking(input: BookingInput): Promise<{ record: BookingRecord; storage: string }> {
  try {
    const isMernAlive = await checkBackendHealth();
    if (isMernAlive) {
      const created = await apiCreateBooking({
        name: input.name,
        customerName: input.name,
        phone: input.phone,
        email: input.email || "",
        city: input.city || "",
        budget: input.budget || "",
        brand: input.brand || "Family Cafe King",
        outlet: input.brand || "Family Cafe King",
        date: input.date || new Date().toISOString().slice(0, 10),
        bookingDate: input.date || new Date().toISOString().slice(0, 10),
        time: input.time || "12:00 PM",
        bookingTime: input.time || "12:00 PM",
        guests: input.guests || 1,
        totalPersons: input.guests || 1,
        notes: input.notes || `City Territory Booking Request for ${input.city || "City"}`,
        specialRequest: input.notes || `City Territory Booking Request for ${input.city || "City"}`,
      });
      const record: BookingRecord = {
        ...input,
        id: created._id || created.id || makeId("booking"),
        created_at: created.createdAt || new Date().toISOString(),
      };
      const localBookings = readJson<BookingRecord[]>(BOOKINGS_KEY, []);
      writeJson(BOOKINGS_KEY, [record, ...localBookings.filter((b) => b.id !== record.id)]);
      notifyBookingsChanged();
      return { record, storage: "mern" };
    }
  } catch (err) {
    console.warn("MERN Save Booking failed, using local storage fallback", err);
  }

  const record: BookingRecord = {
    ...input,
    id: makeId("booking"),
    created_at: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
  const localBookings = readJson<BookingRecord[]>(BOOKINGS_KEY, []);
  writeJson(BOOKINGS_KEY, [record, ...localBookings]);
  notifyBookingsChanged();
  return { record, storage: "local" };
}

export async function listBookings(accessToken?: string): Promise<BookingRecord[]> {
  let mernRows: BookingRecord[] = [];
  try {
    const isMernAlive = await checkBackendHealth();
    if (isMernAlive) {
      const rows = await apiGetBookings(accessToken);
      mernRows = rows.map((b) => ({
        id: b._id || b.id || makeId("booking"),
        name: b.customerName || b.name || "Territory Applicant",
        phone: b.phone || "",
        email: b.email || "",
        city: (b as any).city || "",
        budget: (b as any).budget || "",
        date: b.date || (b as any).bookingDate || "",
        time: b.time || (b as any).bookingTime || "",
        guests: b.totalPersons || b.guests || 1,
        brand: b.outlet || b.brand || "Family Cafe King",
        notes: b.specialRequest || b.notes || "",
        created_at: b.createdAt || new Date().toISOString(),
        createdAt: b.createdAt || new Date().toISOString(),
      }));
    }
  } catch (err) {
    console.warn("MERN List Bookings failed, reading local storage", err);
  }

  const localRows = readJson<BookingRecord[]>(BOOKINGS_KEY, []);

  // Build a local lookup for fast merge
  const localMap = new Map<string, BookingRecord>();
  localRows.forEach((item) => {
    if (item && item.id) localMap.set(item.id, item);
  });

  const map = new Map<string, BookingRecord>();

  // Add MERN rows first, but fill missing fields from localStorage
  mernRows.forEach((item) => {
    if (!item || !item.id) return;
    const local = localMap.get(item.id);
    map.set(item.id, {
      ...item,
      // If MERN didn't return these fields (old backend), use local data
      name: item.name || local?.name || "Territory Applicant",
      city: item.city || local?.city || "",
      budget: item.budget || local?.budget || "",
      brand: item.brand || local?.brand || "Family Cafe King",
      notes: item.notes || local?.notes || "",
      email: item.email || local?.email || "",
    });
  });

  // Add any local-only rows (not yet synced to MERN)
  localRows.forEach((item) => {
    if (item && item.id && !map.has(item.id)) {
      map.set(item.id, item);
    }
  });

  return Array.from(map.values()).sort((a, b) =>
    (b.created_at || b.createdAt || "").localeCompare(a.created_at || a.createdAt || "")
  );
}

export async function deleteBookingRecord(id: string, accessToken?: string): Promise<void> {
  try {
    const isMernAlive = await checkBackendHealth();
    if (isMernAlive) {
      await apiDeleteBooking(id, accessToken);
    }
  } catch (err) {
    console.warn("MERN Delete Booking failed, removing locally", err);
  }

  const current = readJson<BookingRecord[]>(BOOKINGS_KEY, []);
  writeJson(BOOKINGS_KEY, current.filter((b) => (b.id || (b as any)._id) !== id));
  notifyBookingsChanged();
}

export interface VisitorStats {
  totalVisits: number;
  uniqueVisitors: number;
  todayVisits: number;
  lastVisitAt: string;
}

export function trackVisitor(): VisitorStats {
  if (typeof window === "undefined") {
    return { totalVisits: 1, uniqueVisitors: 1, todayVisits: 1, lastVisitAt: new Date().toISOString() };
  }

  const dateKey = new Date().toISOString().slice(0, 10);
  const STATS_KEY = "fck_visitor_stats_v1";
  const VISITOR_ID_KEY = "fck_visitor_uuid_v1";

  let visitorId = window.localStorage.getItem(VISITOR_ID_KEY);
  let isNewUnique = false;
  if (!visitorId) {
    visitorId = `v_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    window.localStorage.setItem(VISITOR_ID_KEY, visitorId);
    isNewUnique = true;
  }

  let stats: {
    totalVisits: number;
    uniqueVisitors: number;
    todayVisits: number;
    lastDate: string;
    lastVisitAt: string;
  };

  try {
    const raw = window.localStorage.getItem(STATS_KEY);
    stats = raw
      ? JSON.parse(raw)
      : { totalVisits: 0, uniqueVisitors: 0, todayVisits: 0, lastDate: dateKey, lastVisitAt: "" };
  } catch {
    stats = { totalVisits: 0, uniqueVisitors: 0, todayVisits: 0, lastDate: dateKey, lastVisitAt: "" };
  }

  const isToday = stats.lastDate === dateKey;
  const todayVisits = isToday ? stats.todayVisits + 1 : 1;
  const totalVisits = (stats.totalVisits || 0) + 1;
  const uniqueVisitors = (stats.uniqueVisitors || 0) + (isNewUnique ? 1 : 0);
  const lastVisitAt = new Date().toISOString();

  const updated = {
    totalVisits: Math.max(totalVisits, uniqueVisitors, 1),
    uniqueVisitors: Math.max(uniqueVisitors, 1),
    todayVisits,
    lastDate: dateKey,
    lastVisitAt,
  };

  try {
    window.localStorage.setItem(STATS_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage errors
  }

  return {
    totalVisits: updated.totalVisits,
    uniqueVisitors: updated.uniqueVisitors,
    todayVisits: updated.todayVisits,
    lastVisitAt: updated.lastVisitAt,
  };
}

export function getVisitorStats(): VisitorStats {
  if (typeof window === "undefined") {
    return { totalVisits: 1, uniqueVisitors: 1, todayVisits: 1, lastVisitAt: new Date().toISOString() };
  }
  const dateKey = new Date().toISOString().slice(0, 10);
  const STATS_KEY = "fck_visitor_stats_v1";
  try {
    const raw = window.localStorage.getItem(STATS_KEY);
    if (!raw) return trackVisitor();
    const parsed = JSON.parse(raw);
    const isToday = parsed.lastDate === dateKey;
    return {
      totalVisits: Math.max(Number(parsed.totalVisits) || 1, 1),
      uniqueVisitors: Math.max(Number(parsed.uniqueVisitors) || 1, 1),
      todayVisits: isToday ? Math.max(Number(parsed.todayVisits) || 1, 1) : 1,
      lastVisitAt: parsed.lastVisitAt || new Date().toISOString(),
    };
  } catch {
    return trackVisitor();
  }
}

export function leadsToCsv(leads: LeadRecord[]): string {
  const escape = (value: string) => `"${(value || "").replace(/"/g, '""')}"`;
  const rows = [
    ["Submitted Date", "Request Type", "Name", "Phone", "Email", "City", "Brand", "Budget / Message", "Status", "Notes", "Source"],
    ...leads.map((lead) => [
      new Date(lead.created_at).toLocaleString(),
      "Franchise Lead",
      lead.name || "",
      lead.phone || "",
      lead.email || "",
      lead.city || "",
      lead.brand || "",
      lead.budget || "",
      lead.status || "New",
      lead.notes || "",
      lead.source_page || "landing-page",
    ]),
  ];
  return rows.map((row) => row.map(escape).join(",")).join("\n");
}

export function allRequestsToCsv(
  leads: LeadRecord[] = [],
  bookings: any[] = [],
  contacts: any[] = []
): string {
  const escape = (value: string) => `"${(value || "").replace(/"/g, '""')}"`;

  const leadRows = leads.map((lead) => [
    new Date(lead.created_at || Date.now()).toLocaleString(),
    "Franchise Application Lead",
    lead.name || "",
    lead.phone || "",
    lead.email || "",
    lead.city || "",
    lead.brand || "Family Cafe King",
    lead.budget || "",
    lead.status || "New",
    lead.notes || "",
    lead.source_page || "landing-page",
  ]);

  const bookingRows = bookings.map((b) => [
    new Date(b.createdAt || Date.now()).toLocaleString(),
    "Franchise Outlet Booking",
    b.name || "",
    b.phone || "",
    b.email || "",
    "-",
    b.brand || "Family Cafe King",
    `Date: ${b.date || "N/A"} | Time: ${b.time || "N/A"} | Guests: ${b.guests || "N/A"}`,
    "New",
    b.notes || "",
    "booking-form",
  ]);

  const contactRows = contacts.map((c) => [
    new Date(c.createdAt || Date.now()).toLocaleString(),
    "Direct Contact Inquiry",
    c.name || "",
    c.phone || "",
    c.email || "",
    "-",
    "Family Cafe King",
    `Subject: ${c.subject || "General Inquiry"} | Message: ${c.message || ""}`,
    "New",
    "",
    "contact-form",
  ]);

  const allCombined = [...leadRows, ...bookingRows, ...contactRows].sort((a, b) => {
    const timeA = new Date(a[0]).getTime() || 0;
    const timeB = new Date(b[0]).getTime() || 0;
    return timeB - timeA;
  });

  const header = [
    "Submitted Date",
    "Request Type",
    "Name",
    "Phone",
    "Email",
    "City",
    "Brand",
    "Budget / Message",
    "Status",
    "Notes",
    "Source",
  ];

  return [header, ...allCombined].map((row) => row.map(escape).join(",")).join("\n");
}

// ================= TRAINING PACKAGES =================

export interface TrainingInput {
  heading: string;
  sub_heading: string;
  food_categories: string[];
  time_period: string;
  base_cost: string;
  extra_costs: string[];
  is_active: boolean;
  order: number;
}

export interface TrainingRecord extends TrainingInput {
  id: string;
  created_at: string;
}

const TRAINING_KEY = "fck_training_v1";

export const DEFAULT_TRAINING: TrainingRecord[] = [
  {
    id: "default-training-1",
    created_at: new Date().toISOString(),
    heading: "Staff Training & Support",
    sub_heading: "Food Training Support (Pan India)",
    food_categories: ["Only Veg & Indian", "Fast Food", "Mocktails"],
    time_period: "6 Months Hotel Visit",
    base_cost: "₹1.5 Lakh Training Charge",
    extra_costs: ["Travel Expenses of Trainer", "Stay & Food for Trainer"],
    is_active: true,
    order: 0,
  },
];

const normalizeTraining = (value: unknown): TrainingRecord => {
  const item = (value || {}) as Partial<TrainingRecord & MernTraining>;
  return {
    id: String(item.id || item._id || makeId("training")),
    created_at: String(item.created_at || item.createdAt || new Date().toISOString()),
    heading: String(item.heading || "Staff Training & Support"),
    sub_heading: String(item.sub_heading || "Food Training Support (Pan India)"),
    food_categories: Array.isArray(item.food_categories) ? item.food_categories : ["Only Veg & Indian", "Fast Food", "Mocktails"],
    time_period: String(item.time_period || "6 Months Hotel Visit"),
    base_cost: String(item.base_cost || "₹1.5 Lakh Training Charge"),
    extra_costs: Array.isArray(item.extra_costs) ? item.extra_costs : ["Travel Expenses of Trainer", "Stay & Food for Trainer"],
    is_active: item.is_active !== undefined ? Boolean(item.is_active) : true,
    order: Number(item.order || 0),
  };
};

export const notifyTrainingChanged = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("fck_training_updated"));
  }
};

export async function listTraining(_accessToken?: string): Promise<TrainingRecord[]> {
  try {
    const isMernAlive = await checkBackendHealth();
    if (isMernAlive) {
      const mernData = await apiGetTraining();
      if (mernData && mernData.length > 0) {
        return mernData.map(normalizeTraining).sort((a, b) => a.order - b.order);
      }
    }
  } catch (err) {
    console.warn("MERN List Training failed, fallback to local", err);
  }
  const saved = readJson<TrainingRecord[] | null>(TRAINING_KEY, null);
  const rows = (saved && saved.length > 0 ? saved : DEFAULT_TRAINING).map(normalizeTraining);
  return rows.sort((a, b) => a.order - b.order);
}

export async function saveTraining(input: TrainingInput, accessToken?: string): Promise<TrainingRecord> {
  try {
    const isMernAlive = await checkBackendHealth();
    if (isMernAlive) {
      const created = await apiCreateTraining(input, accessToken);
      const normalized = normalizeTraining(created);
      notifyTrainingChanged();
      return normalized;
    }
  } catch (err) {
    console.warn("MERN Create Training failed, saving to local storage", err);
  }
  const record = normalizeTraining({ ...input, id: makeId("training"), created_at: new Date().toISOString() });
  const all = readJson<TrainingRecord[] | null>(TRAINING_KEY, null) || DEFAULT_TRAINING;
  writeJson(TRAINING_KEY, [...all.map(normalizeTraining), record]);
  notifyTrainingChanged();
  return record;
}

export async function updateTrainingRecord(
  id: string,
  input: Partial<TrainingInput>,
  accessToken?: string
): Promise<TrainingRecord> {
  try {
    const isMernAlive = await checkBackendHealth();
    if (isMernAlive) {
      const updated = await apiUpdateTraining(id, input, accessToken);
      const normalized = normalizeTraining(updated);
      notifyTrainingChanged();
      return normalized;
    }
  } catch (err) {
    console.warn("MERN Update Training failed, updating local storage", err);
  }
  const all = (readJson<TrainingRecord[] | null>(TRAINING_KEY, null) || DEFAULT_TRAINING).map(normalizeTraining);
  const index = all.findIndex((item) => item.id === id);
  if (index < 0) throw new Error("Training record not found");
  all[index] = { ...all[index], ...input };
  writeJson(TRAINING_KEY, all);
  notifyTrainingChanged();
  return all[index];
}

export async function deleteTrainingRecord(id: string, accessToken?: string): Promise<void> {
  try {
    const isMernAlive = await checkBackendHealth();
    if (isMernAlive) {
      await apiDeleteTraining(id, accessToken);
      notifyTrainingChanged();
      return;
    }
  } catch (err) {
    console.warn("MERN Delete Training failed, removing locally", err);
  }
  const current = readJson<TrainingRecord[] | null>(TRAINING_KEY, null) || DEFAULT_TRAINING;
  writeJson(TRAINING_KEY, current.filter((t) => t.id !== id));
  notifyTrainingChanged();
}
