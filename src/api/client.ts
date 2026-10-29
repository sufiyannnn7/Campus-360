/**
 * Scalable HTTP Client with Unified Error Handling
 * 
 * Provides centralized fetch configuration, auth token injection,
 * request/response interceptors, and typed ApiError management.
 */

import { env } from "@/config/env";
import { STORAGE_KEYS } from "@/config/constants";
import { UPCOMING_EVENTS_DATA, FEATURED_CLUBS_DATA, LATEST_NEWS_DATA } from "@/data/landing-data";

export class ApiError extends Error {
  public statusCode: number;
  public details?: any;

  constructor(message: string, statusCode = 500, details?: any) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

let tokenGetter: () => string | null = () => localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

export function setAuthTokenGetter(fn: () => string | null) {
  tokenGetter = fn;
}

export function getAuthToken(): string | null {
  return tokenGetter();
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, any>;
  skipAuth?: boolean;
}

/**
 * Fallback mock handler for local development and offline environments
 */
function handleMockFallback(endpoint: string, options: RequestOptions = {}): any {
  // 1. Current user
  if (endpoint.includes("/api/auth/me")) {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const role = localStorage.getItem(STORAGE_KEYS.USER_ROLE) || "student";
    if (!token && !localStorage.getItem(STORAGE_KEYS.USER_ROLE)) return null;

    const names: Record<string, string> = {
      student: "Sufiyan Shaikh",
      faculty: "Prof. Dr. Aayan Kazi",
      coordinator: "Prathamesh Patil",
      admin: "Campus 360 Super Admin",
    };

    return {
      id: 1,
      name: names[role] || "Campus User",
      email: `${role}@nkocet.ac.in`,
      role,
      department: "Computer Science & Engineering",
      year: "Final Year (B.Tech)",
      points: 480,
      badgesCount: 6,
      eventsAttended: 12,
    };
  }

  // 2. Events
  if (endpoint.includes("/api/events")) {
    if (endpoint.match(/\/api\/events\/\d+/)) {
      const id = Number(endpoint.split("/api/events/")[1]?.split("?")[0]);
      return UPCOMING_EVENTS_DATA.find((e) => e.id === id) || UPCOMING_EVENTS_DATA[0];
    }
    return UPCOMING_EVENTS_DATA;
  }

  // 3. Clubs
  if (endpoint.includes("/api/clubs")) {
    if (endpoint.match(/\/api\/clubs\/\d+/)) {
      const id = Number(endpoint.split("/api/clubs/")[1]?.split("?")[0]);
      return FEATURED_CLUBS_DATA.find((c) => c.id === id) || FEATURED_CLUBS_DATA[0];
    }
    return FEATURED_CLUBS_DATA;
  }

  // 4. News
  if (endpoint.includes("/api/news")) {
    if (endpoint.match(/\/api\/news\/\d+/)) {
      const id = Number(endpoint.split("/api/news/")[1]?.split("?")[0]);
      return LATEST_NEWS_DATA.find((n) => n.id === id) || LATEST_NEWS_DATA[0];
    }
    return LATEST_NEWS_DATA;
  }

  // 5. Dashboards
  if (endpoint.includes("/api/dashboard/student")) {
    return {
      registeredEvents: UPCOMING_EVENTS_DATA.slice(0, 3),
      joinedClubs: FEATURED_CLUBS_DATA.slice(0, 2),
      points: 480,
      certificatesCount: 4,
      attendanceRate: "94%",
    };
  }

  if (endpoint.includes("/api/dashboard/admin")) {
    return {
      totalStudents: 3200,
      activeClubs: 18,
      upcomingEvents: 14,
      pendingApprovals: 5,
    };
  }

  // 6. Notifications
  if (endpoint.includes("/api/notifications")) {
    return [
      {
        id: 1,
        title: "Registration Confirmed",
        message: "You have successfully registered for CSESA Hackathon 2026.",
        type: "event",
        timestamp: "10 mins ago",
        isRead: false,
      },
      {
        id: 2,
        title: "Club Meeting Notice",
        message: "GDG Core Team meeting today at 5:00 PM in Lab 3.",
        type: "club",
        timestamp: "2 hours ago",
        isRead: false,
      },
      {
        id: 3,
        title: "Certificate Available",
        message: "Your participation certificate for TechFest 2026 is ready to download.",
        type: "announcement",
        timestamp: "1 day ago",
        isRead: true,
      },
    ];
  }

  // 7. Certificates
  if (endpoint.includes("/api/certificates")) {
    return [
      {
        id: 1,
        title: "Certificate of Excellence",
        eventName: "National Code-A-Thon 2026",
        issueDate: "2026-03-15",
        recipientName: "Sufiyan Shaikh",
        verificationCode: "CERT-C360-9841",
        issuer: "CSESA NKOCET",
      },
      {
        id: 2,
        title: "Certificate of Participation",
        eventName: "AI & Future Tech Summit",
        issueDate: "2026-02-20",
        recipientName: "Sufiyan Shaikh",
        verificationCode: "CERT-C360-8422",
        issuer: "Future Tech Club",
      },
    ];
  }

  // 8. Leaderboard
  if (endpoint.includes("/api/leaderboard")) {
    return [
      { rank: 1, userId: 101, name: "Sufiyan Shaikh", department: "Computer Science", points: 1450, eventsAttended: 14, badgesCount: 8 },
      { rank: 2, userId: 102, name: "Prathamesh Patil", department: "Information Tech", points: 1320, eventsAttended: 12, badgesCount: 7 },
      { rank: 3, userId: 103, name: "Aayan Kazi", department: "AI & Data Science", points: 1280, eventsAttended: 11, badgesCount: 6 },
      { rank: 4, userId: 104, name: "Sneha Deshmukh", department: "ENTC", points: 1190, eventsAttended: 10, badgesCount: 5 },
      { rank: 5, userId: 105, name: "Rahul Joshi", department: "Mechanical", points: 1050, eventsAttended: 9, badgesCount: 5 },
    ];
  }

  // 9. Recruitments
  if (endpoint.includes("/api/recruitments")) {
    return [
      {
        id: 1,
        clubName: "Google Developer Groups (GDG)",
        role: "Web & Mobile Lead",
        department: "Open to All",
        description: "Lead technical workshops, hackathons, and web projects for campus developers.",
        requirements: ["Experience with React/Node.js", "Team leadership", "Active GitHub profile"],
        deadline: "Oct 30, 2026",
        isOpen: true,
        status: "open",
      },
      {
        id: 2,
        clubName: "E-Cell NKOCET",
        role: "Corporate Sponsorship & PR Lead",
        department: "Open to All",
        description: "Liaise with startups, venture funds, and industry mentors for campus entrepreneurship.",
        requirements: ["Strong communication", "Negotiation skills", "Event pitching experience"],
        deadline: "Nov 05, 2026",
        isOpen: true,
        status: "open",
      },
    ];
  }

  return [];
}

/**
 * Universal request handler
 */
async function request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, skipAuth = false, headers: customHeaders, ...fetchOptions } = options;

  let url = endpoint;
  if (params && Object.keys(params).length > 0) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.append(key, String(value));
      }
    });
    const queryString = query.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  const token = !skipAuth ? tokenGetter() : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(customHeaders as Record<string, string>),
  };

  try {
    const res = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    if (res.ok) {
      const data = await res.json();
      if (data && (Array.isArray(data) ? data.length > 0 : Object.keys(data).length > 0)) {
        return data as T;
      }
    }

    if (!res.ok && res.status >= 400 && res.status !== 404) {
      const errorData = await res.json().catch(() => ({ message: res.statusText }));
      throw new ApiError(errorData.message || `Request failed with status ${res.status}`, res.status, errorData);
    }
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err;
    }
    // Network or server error - continue to mock fallback if enabled
  }

  if (env.enableMockFallback) {
    return handleMockFallback(endpoint, options) as T;
  }

  throw new ApiError(`Failed to fetch from ${endpoint}`, 500);
}

export const apiClient = {
  get: <T = any>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "GET" }),

  post: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T = any>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};

export default apiClient;
