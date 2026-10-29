/**
 * Leaderboard Domain Models
 */

export interface LeaderboardEntry {
  rank: number;
  userId: number | string;
  name: string;
  department: string;
  year?: string;
  points: number;
  eventsAttended: number;
  badgesCount: number;
  avatarUrl?: string;
  change?: "up" | "down" | "same";
}
