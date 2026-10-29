/**
 * Application Environment Configuration
 * 
 * Provides type-safe access to environment variables with sensible defaults.
 * Variables can be overridden via .env files (prefixed with VITE_).
 */

export interface AppEnvConfig {
  /** The base URL for backend API requests */
  apiBaseUrl: string;
  /** Application display name */
  appName: string;
  /** Application version string */
  appVersion: string;
  /** Whether the app is currently running in development mode */
  isDev: boolean;
  /** Whether the app is currently running in production mode */
  isProd: boolean;
  /** Whether demo / mock mode is enabled when no backend is detected */
  enableMockFallback: boolean;
  /** Simulated mock response latency in milliseconds */
  mockLatencyMs: number;
  /** Optional Supabase URL */
  supabaseUrl?: string;
  /** Optional Supabase anon key */
  supabaseAnonKey?: string;
}

export const env: AppEnvConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "/api",
  appName: import.meta.env.VITE_APP_NAME || "Campus 360",
  appVersion: import.meta.env.VITE_APP_VERSION || "1.0.0",
  isDev: Boolean(import.meta.env.DEV),
  isProd: Boolean(import.meta.env.PROD),
  enableMockFallback: import.meta.env.VITE_ENABLE_MOCK_FALLBACK !== "false",
  mockLatencyMs: Number(import.meta.env.VITE_MOCK_LATENCY_MS) || 200,
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || "",
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
};

export default env;
