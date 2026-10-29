/**
 * Authentication and User Domain Models
 */

export type UserRole = "student" | "faculty" | "coordinator" | "admin";

export interface User {
  id: number | string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  avatarUrl?: string;
  year?: string;
  prn?: string;
  division?: string;
  phone?: string;
  rollNumber?: string;
  points?: number;
  totalPoints?: number;
  bio?: string;
  badgesCount?: number;
  eventsAttended?: number;
}

export interface LoginCredentials {
  email?: string;
  password?: string;
  role?: UserRole;
}

export interface SignupPayload {
  name: string;
  email: string;
  password?: string;
  role?: UserRole;
  department?: string;
  year?: string;
  prn?: string;
  division?: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  accessToken?: string;
  user: User;
  emailConfirmationRequired?: boolean;
}
