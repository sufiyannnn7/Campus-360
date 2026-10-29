/**
 * Notifications Domain Models
 */

export type NotificationType = "event" | "club" | "announcement" | "system" | "reminder";

export interface CampusNotification {
  id: number | string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}
