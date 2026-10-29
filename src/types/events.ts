/**
 * Events Domain Models
 */

export type EventCategory =
  | "Academic"
  | "Technical"
  | "Cultural"
  | "Sports"
  | "Club"
  | "Workshop"
  | "Hackathon"
  | "Seminar"
  | "General";

export type EventStatus = "upcoming" | "live" | "completed" | "cancelled" | "postponed";

export interface EventVenueInfo {
  id?: number | string;
  name: string;
  building?: string;
  floor?: string;
  room?: string;
}

export interface EventItem {
  id: number;
  title: string;
  tagline?: string;
  description?: string;
  date: string;
  time?: string;
  startDatetime?: string;
  endDatetime?: string;
  category: string;
  venue: string | EventVenueInfo;
  organizer: string;
  organizerClubId?: number;
  bannerUrl?: string;
  posterUrl?: string;
  capacity?: number;
  registeredCount?: number;
  seatsLeft?: number;
  isRegistered?: boolean;
  registrationDeadline?: string;
  tags?: string[];
  schedule?: Array<{ time: string; title: string }>;
  coordinators?: Array<{ name: string; contact?: string; role?: string }>;
  prizes?: Array<{ position: string; reward: string }>;
  status?: EventStatus;
}

export interface EventFilterParams {
  q?: string;
  category?: string;
  venue?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  page?: number;
}

export interface EventRegistrationPayload {
  eventId: number | string;
  participantName?: string;
  participantEmail?: string;
  department?: string;
  year?: string;
  rollNumber?: string;
}
