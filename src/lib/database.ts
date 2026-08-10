import {
  apiAdminLogin,
  apiCreateLaunch,
  apiCreateLead,
  apiCreateSlide,
  apiDeleteLaunch,
  apiDeleteLead,
  apiDeleteSlide,
  apiGetLaunches,
  apiGetLeads,
  apiGetSlides,
  apiUpdateLaunch,
  apiUpdateLead,
  apiUpdateSlide,
  checkBackendHealth,
  type MernLaunch,
  type MernLead,
  type MernSlide,
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
      return { record: normalizeLead(created), storage: "mern" };
    }
  } catch (err) {
    console.warn("MERN Lead Save failed, using local storage fallback", err);
  }

  // Fallback to local storage
  const record: LeadRecord = {
    ...input,
    id: makeId("lead"),
    created_at: new Date().toISOString(),
    status: "New",
    notes: "",
    source_page,
  };
  const leads = readJson<LeadRecord[]>(LEADS_KEY, []);
  const next = [record, ...leads.map(normalizeLead)];
  writeJson(LEADS_KEY, next);
  return { record, storage: "local" };
}

export async function listLeads(accessToken?: string): Promise<LeadRecord[]> {
  try {
    const isMernAlive = await checkBackendHealth();
    if (isMernAlive) {
      const mernLeads = await apiGetLeads(accessToken);
      return mernLeads.map(normalizeLead);
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
  return leads[index];
}

export async function deleteLead(id: string, accessToken?: string): Promise<void> {
  try {
    const isMernAlive = await checkBackendHealth();
    if (isMernAlive) {
      await apiDeleteLead(id, accessToken);
      return;
    }
  } catch (err) {
    console.warn("MERN Delete Lead failed, deleting from local storage", err);
  }

  writeJson(
    LEADS_KEY,
    readJson<LeadRecord[]>(LEADS_KEY, []).map(normalizeLead).filter((lead) => lead.id !== id)
  );
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
      if (mernSlides && mernSlides.length > 0) {
        return mernSlides.map(normalizeSlide).sort((a, b) => a.order - b.order);
      }
    }
  } catch (err) {
    console.warn("MERN List Slides failed, fallback to local defaults", err);
  }

  const saved = readJson<SlideRecord[] | null>(SLIDES_KEY, null);
  const rows = (saved && saved.length >= 5 ? saved : DEFAULT_SLIDES).map(normalizeSlide);
  return rows.sort((a, b) => a.order - b.order);
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
      const { token, admin } = await apiAdminLogin(email, password);
      return { accessToken: token, email: admin.email };
    }
  } catch (err) {
    console.warn("MERN Admin login error, checking fallback admin passcode", err);
    if (err instanceof Error && !err.message.includes("Failed to fetch")) {
      throw err;
    }
  }

  // Fallback local authentication - accept primary passcode, legacy passcode, or env override
  const validPasscodes = ["Shivam@1234", "admin123", import.meta.env.VITE_ADMIN_PASSCODE].filter(Boolean);
  if (!validPasscodes.includes(password)) {
    throw new Error("Invalid admin credentials");
  }
  return { accessToken: "local-demo-token", email: email || "shivamsri.srivastava2@gmail.com" };
}

export function leadsToCsv(leads: LeadRecord[]): string {
  const escape = (value: string) => `"${(value || "").replace(/"/g, '""')}"`;
  const rows = [
    ["Date", "Name", "Phone", "Email", "City", "Brand", "Budget", "Status", "Notes"],
    ...leads.map((lead) => [
      new Date(lead.created_at).toLocaleString(),
      lead.name,
      lead.phone,
      lead.email,
      lead.city,
      lead.brand,
      lead.budget,
      lead.status,
      lead.notes,
    ]),
  ];
  return rows.map((row) => row.map(escape).join(",")).join("\n");
}
