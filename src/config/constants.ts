/**
 * Application Constants
 * 
 * Central catalog of immutable application constants, route paths,
 * storage keys, and domain definitions.
 */

export const APP_CONFIG = {
  NAME: "Campus 360",
  INSTITUTION: "NKOCET Solapur",
  TAGLINE: "Your Unified Campus Operating System",
  CONTACT_EMAIL: "support@campus360.edu",
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  DASHBOARD: "/dashboard",
  EVENTS: "/events",
  EVENT_DETAIL: (id: string | number) => `/events/${id}`,
  CLUBS: "/clubs",
  CLUB_DETAIL: (id: string | number) => `/clubs/${id}`,
  CALENDAR: "/calendar",
  MAP: "/map",
  NEWS: "/news",
  NEWS_DETAIL: (id: string | number) => `/news/${id}`,
  RECRUITMENTS: "/recruitments",
  LEADERBOARD: "/leaderboard",
  PROFILE: "/profile",
  CERTIFICATES: "/certificates",
  CERTIFICATE_VERIFY: (code: string) => `/certificates/verify/${code}`,
  NOTIFICATIONS: "/notifications",
  SEARCH: "/search",
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: "token",
  USER_ROLE: "demo_role",
  THEME: "theme",
  RECENT_SEARCHES: "recent_searches",
} as const;

export const USER_ROLES = {
  STUDENT: "student",
  FACULTY: "faculty",
  COORDINATOR: "coordinator",
  ADMIN: "admin",
} as const;

export type UserRoleType = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const ROLE_LABELS: Record<UserRoleType, string> = {
  [USER_ROLES.STUDENT]: "Student",
  [USER_ROLES.FACULTY]: "Faculty Advisor",
  [USER_ROLES.COORDINATOR]: "Club Coordinator",
  [USER_ROLES.ADMIN]: "Super Admin",
};

export const EVENT_CATEGORIES = [
  "All",
  "Academic",
  "Technical",
  "Cultural",
  "Sports",
  "Club",
  "Workshop",
  "Hackathon",
  "Seminar",
] as const;

export const VENUE_CATEGORIES = [
  "All",
  "Academic",
  "Sports",
  "Canteen",
  "Hostel",
  "Workshop",
] as const;
