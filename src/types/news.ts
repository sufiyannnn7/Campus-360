/**
 * News and Announcements Domain Models
 */

export interface NewsArticle {
  id: number;
  title: string;
  summary?: string;
  excerpt?: string;
  content?: string;
  body?: string;
  category?: string;
  author?: string;
  authorRole?: string;
  publishedAt?: string;
  date?: string;
  imageUrl?: string;
  readTime?: string;
  isImportant?: boolean;
  tags?: string[];
}

export interface NewsFilterParams {
  q?: string;
  category?: string;
  isImportant?: boolean;
  limit?: number;
  page?: number;
}
