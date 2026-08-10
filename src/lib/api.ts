export interface MernLead {
  _id?: string;
  id?: string;
  name: string;
  phone: string;
  email?: string;
  city: string;
  brand: string;
  budget: string;
  status: "New" | "Contacted" | "Interested" | "Converted" | "Lost";
  notes?: string;
  source_page?: string;
  createdAt?: string;
  created_at?: string;
}

export interface MernBooking {
  _id?: string;
  id?: string;
  name: string;
  phone: string;
  email?: string;
  date?: string;
  time?: string;
  guests?: number;
  brand?: string;
  notes?: string;
  createdAt?: string;
}

export interface MernContact {
  _id?: string;
  id?: string;
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
  createdAt?: string;
}

export interface MernLaunch {
  _id?: string;
  id?: string;
  city: string;
  brand: string;
  date_text: string;
  image_data?: string;
  tag?: string;
  accent?: string;
  createdAt?: string;
  created_at?: string;
}

export interface MernSlide {
  _id?: string;
  id?: string;
  title: string;
  subtitle?: string;
  brand_name: string;
  badge_text?: string;
  image_url?: string;
  price_display?: string;
  space_req?: string;
  cta_text?: string;
  cta_link?: string;
  accent_color?: string;
  is_active?: boolean;
  order?: number;
  createdAt?: string;
  created_at?: string;
}

export interface AdminStats {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  interestedLeads: number;
  convertedLeads: number;
  lostLeads: number;
  totalBookings: number;
  totalContacts: number;
  totalLaunches: number;
  totalSlides?: number;
}

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

// Helper to construct request headers with token
const getHeaders = (token?: string, isJson = true): HeadersInit => {
  const headers: Record<string, string> = {};
  if (isJson) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  } else {
    const savedSession = sessionStorage.getItem("fck_admin_session");
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed?.accessToken) {
          headers["Authorization"] = `Bearer ${parsed.accessToken}`;
        }
      } catch {
        // Ignore parse error
      }
    }
  }
  return headers;
};

// Check if Express backend is running
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${API_BASE}/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    return res.ok;
  } catch {
    return false;
  }
}

// ================= ADMIN AUTH =================
export async function apiAdminLogin(email: string, pass: string) {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ email, password: pass }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to log in");
  }

  return {
    token: data.token as string,
    admin: data.admin as { id: string; name: string; email: string; role: string },
  };
}

export async function apiGetAdminDashboard(token?: string) {
  const res = await fetch(`${API_BASE}/admin/dashboard`, {
    headers: getHeaders(token),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Unable to fetch dashboard metrics");
  }
  return data as { success: boolean; stats: AdminStats; recentLeads: MernLead[] };
}

// ================= LEADS API =================
export async function apiGetLeads(token?: string): Promise<MernLead[]> {
  const res = await fetch(`${API_BASE}/leads`, {
    headers: getHeaders(token),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch leads");
  }
  return (data.data || []).map((item: MernLead) => ({
    ...item,
    id: item._id || item.id,
    created_at: item.createdAt || item.created_at || new Date().toISOString(),
  }));
}

export async function apiCreateLead(leadData: Omit<MernLead, "_id" | "id">): Promise<MernLead> {
  const res = await fetch(`${API_BASE}/leads`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(leadData),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to submit lead");
  }
  const item = data.data;
  return {
    ...item,
    id: item._id || item.id,
    created_at: item.createdAt || item.created_at || new Date().toISOString(),
  };
}

export async function apiUpdateLead(id: string, updates: Partial<MernLead>, token?: string): Promise<MernLead> {
  const res = await fetch(`${API_BASE}/leads/${id}`, {
    method: "PATCH",
    headers: getHeaders(token),
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to update lead");
  }
  const item = data.data;
  return {
    ...item,
    id: item._id || item.id,
    created_at: item.createdAt || item.created_at || new Date().toISOString(),
  };
}

export async function apiDeleteLead(id: string, token?: string): Promise<void> {
  const res = await fetch(`${API_BASE}/leads/${id}`, {
    method: "DELETE",
    headers: getHeaders(token),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to delete lead");
  }
}

// ================= LAUNCHES API =================
export async function apiGetLaunches(): Promise<MernLaunch[]> {
  const res = await fetch(`${API_BASE}/launches`, {
    headers: getHeaders(),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch launches");
  }
  return (data.data || []).map((item: MernLaunch) => ({
    ...item,
    id: item._id || item.id,
    created_at: item.createdAt || item.created_at || new Date().toISOString(),
  }));
}

export async function apiCreateLaunch(launchData: Omit<MernLaunch, "_id" | "id">, token?: string): Promise<MernLaunch> {
  const res = await fetch(`${API_BASE}/launches`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(launchData),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to create launch card");
  }
  const item = data.data;
  return {
    ...item,
    id: item._id || item.id,
    created_at: item.createdAt || item.created_at || new Date().toISOString(),
  };
}

export async function apiUpdateLaunch(id: string, updates: Partial<MernLaunch>, token?: string): Promise<MernLaunch> {
  const res = await fetch(`${API_BASE}/launches/${id}`, {
    method: "PUT",
    headers: getHeaders(token),
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to update launch card");
  }
  const item = data.data;
  return {
    ...item,
    id: item._id || item.id,
    created_at: item.createdAt || item.created_at || new Date().toISOString(),
  };
}

export async function apiDeleteLaunch(id: string, token?: string): Promise<void> {
  const res = await fetch(`${API_BASE}/launches/${id}`, {
    method: "DELETE",
    headers: getHeaders(token),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to delete launch card");
  }
}

// ================= SLIDER API =================
export async function apiGetSlides(): Promise<MernSlide[]> {
  const res = await fetch(`${API_BASE}/slides`, {
    headers: getHeaders(),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch hero slides");
  }
  return (data.data || []).map((item: MernSlide) => ({
    ...item,
    id: item._id || item.id,
    created_at: item.createdAt || item.created_at || new Date().toISOString(),
  }));
}

export async function apiCreateSlide(slideData: Omit<MernSlide, "_id" | "id">, token?: string): Promise<MernSlide> {
  const res = await fetch(`${API_BASE}/slides`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(slideData),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to create hero slide");
  }
  const item = data.data;
  return {
    ...item,
    id: item._id || item.id,
    created_at: item.createdAt || item.created_at || new Date().toISOString(),
  };
}

export async function apiUpdateSlide(id: string, updates: Partial<MernSlide>, token?: string): Promise<MernSlide> {
  const res = await fetch(`${API_BASE}/slides/${id}`, {
    method: "PUT",
    headers: getHeaders(token),
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to update hero slide");
  }
  const item = data.data;
  return {
    ...item,
    id: item._id || item.id,
    created_at: item.createdAt || item.created_at || new Date().toISOString(),
  };
}

export async function apiDeleteSlide(id: string, token?: string): Promise<void> {
  const res = await fetch(`${API_BASE}/slides/${id}`, {
    method: "DELETE",
    headers: getHeaders(token),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to delete hero slide");
  }
}

// ================= BOOKINGS API =================
export async function apiGetBookings(token?: string): Promise<MernBooking[]> {
  const res = await fetch(`${API_BASE}/bookings`, {
    headers: getHeaders(token),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch bookings");
  }
  return (data.data || []).map((b: MernBooking) => ({
    ...b,
    id: b._id || b.id,
  }));
}

export async function apiCreateBooking(booking: Omit<MernBooking, "_id" | "id">): Promise<MernBooking> {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(booking),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to submit booking");
  }
  return data.data;
}

export async function apiDeleteBooking(id: string, token?: string): Promise<void> {
  const res = await fetch(`${API_BASE}/bookings/${id}`, {
    method: "DELETE",
    headers: getHeaders(token),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to delete booking");
  }
}

// ================= CONTACTS API =================
export async function apiGetContacts(token?: string): Promise<MernContact[]> {
  const res = await fetch(`${API_BASE}/contacts`, {
    headers: getHeaders(token),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch contact inquiries");
  }
  return (data.data || []).map((c: MernContact) => ({
    ...c,
    id: c._id || c.id,
  }));
}

export async function apiCreateContact(contact: Omit<MernContact, "_id" | "id">): Promise<MernContact> {
  const res = await fetch(`${API_BASE}/contacts`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(contact),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to send contact inquiry");
  }
  return data.data;
}

export async function apiDeleteContact(id: string, token?: string): Promise<void> {
  const res = await fetch(`${API_BASE}/contacts/${id}`, {
    method: "DELETE",
    headers: getHeaders(token),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to delete contact inquiry");
  }
}
