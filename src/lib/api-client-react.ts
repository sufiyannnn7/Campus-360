import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UPCOMING_EVENTS_DATA, FEATURED_CLUBS_DATA, LATEST_NEWS_DATA } from "@/data/landing-data";

let tokenGetter: () => string | null = () => localStorage.getItem("token");

export function setAuthTokenGetter(fn: () => string | null) {
  tokenGetter = fn;
}

export function getGetMeQueryKey() {
  return ["/api/auth/me"];
}

export function getGetEventQueryKey(id?: string) {
  return ["/api/events", id];
}

export function getGetClubQueryKey(id?: string) {
  return ["/api/clubs", id];
}

export function getGetNewsItemQueryKey(id?: string) {
  return ["/api/news", id];
}

async function fetcher(url: string) {
  try {
    const token = tokenGetter();
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(url, { headers });
    if (res.ok) {
      const data = await res.json();
      if (data && (Array.isArray(data) ? data.length > 0 : Object.keys(data).length > 0)) {
        return data;
      }
    }
  } catch (err) {
    // Network fallback below
  }

  if (url.includes("/api/auth/me")) {
    const token = localStorage.getItem("token");
    if (!token && !localStorage.getItem("demo_role")) return null;
    const role = localStorage.getItem("demo_role") || "student";
    const names: Record<string, string> = {
      student: "Sufiyan Shaikh (Student)",
      faculty: "Prof. Dr. Aayan Kazi (Faculty Advisor)",
      coordinator: "Prathamesh Patil (Club Coordinator)",
      admin: "Campus 360 Super Admin",
    };
    return {
      id: 1,
      name: names[role] || "Campus User",
      email: `${role}@nkocet.ac.in`,
      role: role,
      department: "Computer Science & Engineering",
    };
  }

  if (url.includes("/api/events")) {
    if (url.match(/\/api\/events\/\d+/)) {
      const id = Number(url.split("/api/events/")[1]?.split("?")[0]);
      return UPCOMING_EVENTS_DATA.find((e) => e.id === id) || UPCOMING_EVENTS_DATA[0];
    }
    return UPCOMING_EVENTS_DATA;
  }

  if (url.includes("/api/clubs")) {
    if (url.match(/\/api\/clubs\/\d+/)) {
      const id = Number(url.split("/api/clubs/")[1]?.split("?")[0]);
      return FEATURED_CLUBS_DATA.find((c) => c.id === id) || FEATURED_CLUBS_DATA[0];
    }
    return FEATURED_CLUBS_DATA;
  }

  if (url.includes("/api/news")) {
    if (url.match(/\/api\/news\/\d+/)) {
      const id = Number(url.split("/api/news/")[1]?.split("?")[0]);
      return LATEST_NEWS_DATA.find((n) => n.id === id) || LATEST_NEWS_DATA[0];
    }
    return LATEST_NEWS_DATA;
  }

  return [];
}

export function useGetMe() {
  return useQuery({
    queryKey: getGetMeQueryKey(),
    queryFn: () => fetcher("/api/auth/me"),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (credentials: any) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: "Login failed" }));
        throw new Error(error.message || "Invalid credentials");
      }
      return res.json();
    },
    onSuccess: (data: any) => {
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }
      queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
    },
  });
}

export function useSignup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userData: any) => {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: "Registration failed" }));
        throw new Error(error.message || "Failed to create account");
      }
      return res.json();
    },
    onSuccess: (data: any) => {
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }
      queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      localStorage.removeItem("token");
      return true;
    },
    onSuccess: () => {
      queryClient.setQueryData(getGetMeQueryKey(), null);
      queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
    },
  });
}

export function useGetStudentDashboard() {
  return useQuery({
    queryKey: ["/api/dashboard/student"],
    queryFn: () => fetcher("/api/dashboard/student"),
  });
}

export function useGetAdminDashboard() {
  return useQuery({
    queryKey: ["/api/dashboard/admin"],
    queryFn: () => fetcher("/api/dashboard/admin"),
  });
}

export function useGetEvents(params?: any) {
  return useQuery({
    queryKey: ["/api/events", params],
    queryFn: () => fetcher("/api/events"),
  });
}

export function useListEvents(params?: any) {
  return useGetEvents(params);
}

export function useGetEvent(id?: string) {
  return useQuery({
    queryKey: getGetEventQueryKey(id),
    queryFn: () => fetcher(`/api/events/${id}`),
    enabled: !!id,
  });
}

export function useGetEventDetail(id?: string) {
  return useGetEvent(id);
}

export function useGetClubs() {
  return useQuery({
    queryKey: ["/api/clubs"],
    queryFn: () => fetcher("/api/clubs"),
  });
}

export function useListClubs() {
  return useGetClubs();
}

export function useGetClub(id?: string) {
  return useQuery({
    queryKey: getGetClubQueryKey(id),
    queryFn: () => fetcher(`/api/clubs/${id}`),
    enabled: !!id,
  });
}

export function useGetClubDetail(id?: string) {
  return useGetClub(id);
}

export function useGetNews() {
  return useQuery({
    queryKey: ["/api/news"],
    queryFn: () => fetcher("/api/news"),
  });
}

export function useListNews() {
  return useGetNews();
}

export function useGetNewsItem(id?: string) {
  return useQuery({
    queryKey: getGetNewsItemQueryKey(id),
    queryFn: () => fetcher(`/api/news/${id}`),
    enabled: !!id,
  });
}

export function useGetNewsArticle(id?: string) {
  return useGetNewsItem(id);
}

export function useGetNewsDetail(id?: string) {
  return useGetNewsItem(id);
}

export function useGetRecruitments() {
  return useQuery({
    queryKey: ["/api/recruitments"],
    queryFn: () => fetcher("/api/recruitments"),
  });
}

export function useListRecruitments() {
  return useGetRecruitments();
}

export function useGetCertificates() {
  return useQuery({
    queryKey: ["/api/certificates"],
    queryFn: () => fetcher("/api/certificates"),
  });
}

export function useGetMyCertificates() {
  return useGetCertificates();
}

export function useListCertificates() {
  return useGetCertificates();
}

export function useGetNotifications() {
  return useQuery({
    queryKey: ["/api/notifications"],
    queryFn: () => fetcher("/api/notifications"),
  });
}

export function getListNotificationsQueryKey() {
  return ["/api/notifications"];
}

export function useListNotifications() {
  return useGetNotifications();
}

export function useGetLeaderboard() {
  return useQuery({
    queryKey: ["/api/leaderboard"],
    queryFn: () => fetcher("/api/leaderboard"),
  });
}

export function useListLeaderboard() {
  return useGetLeaderboard();
}

export function useGlobalSearch(query?: { q?: string }) {
  const q = query?.q || "";
  return useQuery({
    queryKey: ["/api/search", q],
    queryFn: () => fetcher(`/api/search?q=${encodeURIComponent(q)}`),
    enabled: !!q,
  });
}

export function useRegisterEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const token = tokenGetter();
      const res = await fetch(`/api/events/${id}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error("Registration failed");
      return res.json();
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: getGetEventQueryKey(id) });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
    },
  });
}

export function useRegisterForEvent() {
  return useRegisterEvent();
}

export function useCancelRegistration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const token = tokenGetter();
      const res = await fetch(`/api/events/${id}/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error("Cancellation failed");
      return res.json();
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: getGetEventQueryKey(id) });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
    },
  });
}

export function useJoinClub() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const token = tokenGetter();
      const res = await fetch(`/api/clubs/${id}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error("Join request failed");
      return res.json();
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: getGetClubQueryKey(id) });
      queryClient.invalidateQueries({ queryKey: ["/api/clubs"] });
    },
  });
}

export function useJoinClubMutation() {
  return useJoinClub();
}

export function useLeaveClubMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const token = tokenGetter();
      const res = await fetch(`/api/clubs/${id}/leave`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error("Leave request failed");
      return res.json();
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: getGetClubQueryKey(id) });
      queryClient.invalidateQueries({ queryKey: ["/api/clubs"] });
    },
  });
}

export function useApplyRecruitment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data?: any }) => {
      const token = tokenGetter();
      const res = await fetch(`/api/recruitments/${id}/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data || {}),
      });
      if (!res.ok) throw new Error("Application failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recruitments"] });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const token = tokenGetter();
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
    },
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const token = tokenGetter();
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error("Failed to mark notification");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const token = tokenGetter();
      const res = await fetch(`/api/notifications/read-all`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error("Failed to mark all notifications read");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });
}
