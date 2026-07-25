import {
  apiAdminLogin,
  apiCreateLaunch,
  apiCreateLead,
  apiDeleteLaunch,
  apiDeleteLead,
  apiGetLaunches,
  apiGetLeads,
  apiUpdateLead,
  checkBackendHealth,
  type MernLaunch,
  type MernLead,
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
      return normalizeLaunch(created);
    }
  } catch (err) {
    console.warn("MERN Create Launch failed, saving to local storage", err);
  }

  const record = normalizeLaunch({ ...input, id: makeId("launch"), created_at: new Date().toISOString() });
  const launches = readJson<LaunchRecord[] | null>(LAUNCHES_KEY, null) || DEFAULT_UPCOMING;
  writeJson(LAUNCHES_KEY, [...launches.map(normalizeLaunch), record]);
  return record;
}

export async function deleteLaunch(id: string, accessToken?: string): Promise<void> {
  try {
    const isMernAlive = await checkBackendHealth();
    if (isMernAlive) {
      await apiDeleteLaunch(id, accessToken);
      return;
    }
  } catch (err) {
    console.warn("MERN Delete Launch failed, removing from local storage", err);
  }

  const current = readJson<LaunchRecord[] | null>(LAUNCHES_KEY, null) || DEFAULT_UPCOMING;
  writeJson(LAUNCHES_KEY, current.filter((launch) => launch.id !== id));
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
    // If backend returned explicit error message, rethrow
    if (err instanceof Error && !err.message.includes("Failed to fetch")) {
      throw err;
    }
  }

  // Fallback local authentication
  const expected = import.meta.env.VITE_ADMIN_PASSCODE || "admin123";
  if (password !== expected) throw new Error("Invalid admin credentials");
  return { accessToken: "local-demo-token", email: email || "Local Admin" };
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
