/**
 * Campus Venue and Interactive Map Domain Models
 */

export type VenueCategory = "Academic" | "Sports" | "Canteen" | "Hostel" | "Workshop" | "Administration" | "Other";

export interface CampusCoordinates {
  x: number;
  y: number;
}

export interface CampusVenue {
  id: number;
  name: string;
  code: string;
  address: string;
  building: string;
  floor: string;
  capacity: number;
  category: VenueCategory;
  facilities: string[];
  coordinates: CampusCoordinates;
  description: string;
  upcomingEventTitle?: string;
  upcomingEventDate?: string;
  organizer?: string;
  imageUrl?: string;
}

export interface VenueFilterParams {
  q?: string;
  category?: VenueCategory | "All";
}
