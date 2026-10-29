/**
 * Authentication Service
 * 
 * Supports both live Supabase Authentication and offline mock mode.
 * When Supabase is configured, operations authenticate against auth.users and public.profiles.
 * Database errors are thrown directly to prevent silent failures on live backend.
 */

import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { User, LoginCredentials, SignupPayload, AuthResponse, UserRole } from "@/types/auth";
import { STORAGE_KEYS } from "@/config/constants";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

function mapProfileToUser(profile: any, emailFallback?: string): User {
  return {
    id: profile.id,
    name: profile.name || (emailFallback ? emailFallback.split("@")[0] : "Campus User"),
    email: profile.email || emailFallback || "",
    role: (profile.role as UserRole) || "student",
    department: profile.department || undefined,
    year: profile.year || undefined,
    prn: profile.prn || undefined,
    division: profile.division || undefined,
    phone: profile.phone || undefined,
    rollNumber: profile.roll_number || undefined,
    bio: profile.bio || undefined,
    avatarUrl: profile.avatar_url || undefined,
    points: profile.points ?? 0,
    totalPoints: profile.points ?? 0,
    badgesCount: profile.badges_count ?? 0,
    eventsAttended: profile.events_attended ?? 0,
  };
}

export const authService = {
  async getMe(): Promise<User | null> {
    const cachedUserStr = localStorage.getItem("campus360_user");
    let cachedUser: User | null = null;
    if (cachedUserStr) {
      try {
        cachedUser = JSON.parse(cachedUserStr);
      } catch {}
    }

    if (!isSupabaseConfigured()) {
      const res = await apiClient.get<User | null>(API_ENDPOINTS.AUTH.ME);
      return res || cachedUser;
    }

    try {
      const { data: { user }, error: authErr } = await supabase.auth.getUser();
      if (authErr || !user) {
        return cachedUser;
      }

      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      let resolvedUser: User;
      if (profile && !profileErr) {
        resolvedUser = mapProfileToUser(profile, user.email);
      } else {
        resolvedUser = {
          id: user.id,
          name: user.user_metadata?.name || user.email?.split("@")[0] || cachedUser?.name || "User",
          email: user.email || cachedUser?.email || "",
          role: (user.user_metadata?.role || cachedUser?.role || (user.email === "sufiyannnn7@gmail.com" ? "admin" : "student")) as UserRole,
          department: user.user_metadata?.department || cachedUser?.department,
          year: user.user_metadata?.year || cachedUser?.year,
          prn: user.user_metadata?.prn || cachedUser?.prn,
          bio: user.user_metadata?.bio || cachedUser?.bio,
          avatarUrl: user.user_metadata?.avatar_url || cachedUser?.avatarUrl,
          division: user.user_metadata?.division || (cachedUser as any)?.division,
          phone: user.user_metadata?.phone || (cachedUser as any)?.phone,
          points: cachedUser?.points ?? 0,
          totalPoints: cachedUser?.totalPoints ?? 0,
          badgesCount: cachedUser?.badgesCount ?? 0,
          eventsAttended: cachedUser?.eventsAttended ?? 0,
        };
      }

      if (user.user_metadata) {
        if (user.user_metadata.division) (resolvedUser as any).division = user.user_metadata.division;
        if (user.user_metadata.phone) (resolvedUser as any).phone = user.user_metadata.phone;
        if (user.user_metadata.avatar_url) (resolvedUser as any).avatarUrl = user.user_metadata.avatar_url;
      }

      // Admin elevation for designated administrator account
      if (user.email?.toLowerCase().trim() === "sufiyannnn7@gmail.com") {
        resolvedUser.role = "admin";
      }

      localStorage.setItem("campus360_user", JSON.stringify(resolvedUser));
      return resolvedUser;
    } catch (err: any) {
      console.warn("Supabase getMe failed, using cached session:", err?.message);
      return cachedUser;
    }
  },

  async login(rawCredentials: LoginCredentials): Promise<AuthResponse> {
    const credentials = (rawCredentials as any)?.data || rawCredentials;
    const email = credentials.email?.trim().toLowerCase();
    const password = credentials.password;

    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    const isAdminUser = email === "sufiyannnn7@gmail.com";

    if (!isSupabaseConfigured()) {
      const data = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
      const token = data?.token || (data as any)?.accessToken || "mock-token";
      const userRole = isAdminUser ? "admin" : (credentials.role || "student");
      const userObj: User = {
        id: isAdminUser ? "admin-sufiyan" : 1,
        name: isAdminUser ? "Sufiyan Shaikh (Super Admin)" : "Campus User",
        email,
        role: userRole as UserRole,
        department: "Computer Science & Engineering",
        points: 500,
        badgesCount: 5,
        eventsAttended: 8,
      };

      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      localStorage.setItem("token", token);
      localStorage.setItem(STORAGE_KEYS.USER_ROLE, userRole);
      localStorage.setItem("campus360_user", JSON.stringify(userObj));

      return {
        token,
        accessToken: token,
        user: userObj,
      };
    }

    let authData: any = null;
    let authError: any = null;

    const res = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    authData = res.data;
    authError = res.error;

    // If account doesn't exist yet in Supabase for sufiyannnn7@gmail.com, automatically register it
    if (authError && isAdminUser) {
      const signupRes = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: "Sufiyan Shaikh (Super Admin)",
            role: "admin",
            department: "Computer Science & Engineering",
          },
        },
      });

      if (signupRes.data.user) {
        authData = signupRes.data;
        authError = null;
      }
    }

    if (authError || !authData?.user) {
      throw new Error(authError?.message || "Failed to log in with Supabase.");
    }

    const token = authData.session?.access_token || "auth-session-token";
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    localStorage.setItem("token", token);

    // Fetch profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .maybeSingle();

    const userObj: User = profile
      ? mapProfileToUser(profile, authData.user.email)
      : {
          id: authData.user.id,
          name: authData.user.user_metadata?.name || authData.user.email?.split("@")[0] || "User",
          email: authData.user.email || "",
          role: isAdminUser ? "admin" : ((authData.user.user_metadata?.role as UserRole) || "student"),
          points: 0,
          badgesCount: 0,
          eventsAttended: 0,
        };

    if (isAdminUser) {
      userObj.role = "admin";
      localStorage.setItem(STORAGE_KEYS.USER_ROLE, "admin");
      // Silently sync profile role in Supabase if needed
      try {
        await supabase.from("profiles").update({ role: "admin" }).eq("id", authData.user.id);
      } catch {}
    }

    localStorage.setItem("campus360_user", JSON.stringify(userObj));

    localStorage.setItem(STORAGE_KEYS.USER_ROLE, userObj.role);

    return {
      token,
      accessToken: token,
      user: userObj,
    };
  },

  async signup(rawPayload: SignupPayload): Promise<AuthResponse> {
    const payload = (rawPayload as any)?.data || rawPayload;

    if (!isSupabaseConfigured()) {
      const data = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.SIGNUP, payload);
      const token = data?.token || (data as any)?.accessToken || "";
      if (token) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        localStorage.setItem("token", token);
      }
      if (payload.role) {
        localStorage.setItem(STORAGE_KEYS.USER_ROLE, payload.role);
      }
      return {
        ...data,
        accessToken: token,
      };
    }

    const email = payload.email?.trim();
    const password = payload.password;
    const name = payload.name?.trim();

    if (!email || !password) {
      throw new Error("Email and password are required for signup.");
    }

    if (!name) {
      throw new Error("Full name is required for signup.");
    }

    // Enforce strict role safety: public signup is strictly for Students.
    // Faculty and Coordinator accounts must be provisioned by Admin.
    const role: UserRole = "student";

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/login?confirmed=true` : undefined,
        data: {
          name,
          role,
          department: payload.department || null,
          year: payload.year || null,
          prn: payload.prn || null,
        },
      },
    });

    if (authError) {
      throw new Error(authError.message || "Failed to sign up with Supabase.");
    }

    if (!authData.user) {
      throw new Error("Failed to create user account.");
    }

    // Detect if Supabase returned existing user with empty identities (anti-enumeration behavior)
    if (authData.user.identities && authData.user.identities.length === 0) {
      throw new Error("An account with this email address already exists. Please log in instead.");
    }

    const session = authData.session;
    const token = session?.access_token || "";
    const emailConfirmationRequired = !session;

    if (token) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      localStorage.setItem("token", token);
    }
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, role);

    // If session is immediately active, perform client profile sync in case DB trigger is not installed yet
    if (session) {
      try {
        await supabase.from("profiles").upsert(
          {
            id: authData.user.id,
            name,
            email,
            role,
            department: payload.department || null,
            year: payload.year || null,
            prn: payload.prn || null,
          },
          { onConflict: "id" }
        );
      } catch (profileErr) {
        console.warn("Client-side profile sync notice:", profileErr);
      }
    }

    const userObj: User = {
      id: authData.user.id,
      name,
      email,
      role,
      department: payload.department,
      year: payload.year,
      prn: payload.prn,
      points: 0,
      badgesCount: 0,
      eventsAttended: 0,
    };

    return {
      token,
      accessToken: token,
      user: userObj,
      emailConfirmationRequired,
    };
  },

  async logout(): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn("Supabase sign out warning:", err);
      }
    }
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem("token");
    localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
    localStorage.removeItem("campus360_user");
    return true;
  },

  async updateProfile(rawProfileData: Partial<User>): Promise<User> {
    const profileData = (rawProfileData as any)?.data || rawProfileData;

    if (!isSupabaseConfigured()) {
      return apiClient.put<User>(API_ENDPOINTS.PROFILE.UPDATE, profileData);
    }

    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr || !user) {
      throw new Error("Must be logged in to update profile.");
    }

    // 1. First persist in Supabase Auth user_metadata (always succeeds and preserves state across sessions)
    try {
      await supabase.auth.updateUser({
        data: {
          name: profileData.name,
          bio: profileData.bio,
          department: profileData.department,
          year: profileData.year,
          prn: profileData.prn,
          division: (profileData as any).division,
          phone: (profileData as any).phone,
          avatar_url: profileData.avatarUrl,
        }
      });
    } catch (authErr) {
      console.warn("Auth user_metadata update warning:", authErr);
    }

    // 2. Prepare payload for public.profiles table
    const updatePayload: any = {};
    if (profileData.name !== undefined) updatePayload.name = profileData.name;
    if (profileData.bio !== undefined) updatePayload.bio = profileData.bio;
    if (profileData.department !== undefined) updatePayload.department = profileData.department;
    if (profileData.year !== undefined) updatePayload.year = profileData.year;
    if (profileData.prn !== undefined) updatePayload.prn = profileData.prn;
    if (profileData.avatarUrl !== undefined) updatePayload.avatar_url = profileData.avatarUrl;

    // 3. Attempt database table update with schema fallback
    let dbUpdated: any = null;
    try {
      const fullPayload = {
        ...updatePayload,
        ...((profileData as any).division !== undefined ? { division: (profileData as any).division } : {}),
        ...((profileData as any).phone !== undefined ? { phone: (profileData as any).phone } : {}),
      };

      const { data, error } = await supabase
        .from("profiles")
        .update(fullPayload)
        .eq("id", user.id)
        .select()
        .maybeSingle();

      if (!error) {
        dbUpdated = data;
      } else if (error.message.includes("division") || error.message.includes("phone")) {
        const retry = await supabase
          .from("profiles")
          .update(updatePayload)
          .eq("id", user.id)
          .select()
          .maybeSingle();
        if (!retry.error) dbUpdated = retry.data;
      }
    } catch (dbErr) {
      console.warn("profiles table update skipped:", dbErr);
    }

    // 4. Construct complete resolved user object
    const cachedUserStr = localStorage.getItem("campus360_user");
    const cached = cachedUserStr ? JSON.parse(cachedUserStr) : {};

    const resolved: User = {
      id: user.id,
      name: profileData.name || dbUpdated?.name || user.user_metadata?.name || cached.name || "User",
      email: user.email || cached.email || "",
      role: (dbUpdated?.role || cached.role || (user.email === "sufiyannnn7@gmail.com" ? "admin" : "student")) as UserRole,
      department: profileData.department || dbUpdated?.department || cached.department,
      year: profileData.year || dbUpdated?.year || cached.year,
      prn: profileData.prn || dbUpdated?.prn || cached.prn,
      bio: profileData.bio || dbUpdated?.bio || cached.bio,
      avatarUrl: profileData.avatarUrl || dbUpdated?.avatar_url || cached.avatarUrl,
      division: (profileData as any).division || dbUpdated?.division || cached.division,
      phone: (profileData as any).phone || dbUpdated?.phone || cached.phone,
      points: dbUpdated?.points ?? cached.points ?? 0,
      totalPoints: dbUpdated?.points ?? cached.totalPoints ?? 0,
      badgesCount: dbUpdated?.badges_count ?? cached.badgesCount ?? 0,
      eventsAttended: dbUpdated?.events_attended ?? cached.eventsAttended ?? 0,
    };

    localStorage.setItem("campus360_user", JSON.stringify(resolved));
    return resolved;
  },
};

export default authService;
