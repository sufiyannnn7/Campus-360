/**
 * API Endpoints Catalog
 * 
 * Central catalog of all REST endpoint paths across the system.
 */

export const API_ENDPOINTS = {
  AUTH: {
    ME: "/api/auth/me",
    LOGIN: "/api/auth/login",
    SIGNUP: "/api/auth/signup",
    LOGOUT: "/api/auth/logout",
  },
  DASHBOARD: {
    STUDENT: "/api/dashboard/student",
    ADMIN: "/api/dashboard/admin",
  },
  EVENTS: {
    LIST: "/api/events",
    DETAIL: (id: string | number) => `/api/events/${id}`,
    REGISTER: (id: string | number) => `/api/events/${id}/register`,
    CANCEL: (id: string | number) => `/api/events/${id}/cancel`,
  },
  CLUBS: {
    LIST: "/api/clubs",
    DETAIL: (id: string | number) => `/api/clubs/${id}`,
    JOIN: (id: string | number) => `/api/clubs/${id}/join`,
    LEAVE: (id: string | number) => `/api/clubs/${id}/leave`,
  },
  NEWS: {
    LIST: "/api/news",
    DETAIL: (id: string | number) => `/api/news/${id}`,
  },
  RECRUITMENTS: {
    LIST: "/api/recruitments",
    APPLY: (id: string | number) => `/api/recruitments/${id}/apply`,
  },
  CERTIFICATES: {
    LIST: "/api/certificates",
    VERIFY: (code: string) => `/api/certificates/verify/${code}`,
  },
  NOTIFICATIONS: {
    LIST: "/api/notifications",
    MARK_READ: (id: string | number) => `/api/notifications/${id}/read`,
    MARK_ALL_READ: "/api/notifications/read-all",
  },
  LEADERBOARD: {
    LIST: "/api/leaderboard",
  },
  PROFILE: {
    UPDATE: "/api/profile",
  },
  SEARCH: {
    GLOBAL: "/api/search",
  },
} as const;
