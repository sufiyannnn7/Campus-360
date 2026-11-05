/**
 * Notifications Domain Models
 */

export type NotificationType = "event" | "club" | "announcement" | "system" | "reminder";

export interface CampusNotification {
  id: number | string;
  title: string;
  message: string;
  body?: string;
  type: NotificationType;
  timestamp: string;
  createdAt?: string;
  isRead: boolean;
  readStatus?: boolean;
  actionUrl?: string;
}
