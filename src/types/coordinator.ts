/**
 * Club Coordinator Domain Types
 * Campus 360 - NKOCET, Team NEXUS
 */

export type ClubStatus = 'draft' | 'pending_approval' | 'published' | 'changes_requested' | 'archived';
export type RecruitmentStatus = 'closed' | 'coming_soon' | 'open' | 'paused';
export type RecruitmentMode = 'online' | 'offline' | 'hybrid';
export type ApplicationStage = 'applied' | 'under_review' | 'shortlisted' | 'interview' | 'accepted' | 'rejected';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'changes_requested';

export interface CoordinatorClub {
  id: number;
  name: string;
  slug: string;
  category: string;
  tagline: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  memberCount: number;
  status: ClubStatus;
  recruitmentStatus: RecruitmentStatus;
  profileCompletion: number;
  facultyAdvisor?: string;
  mission?: string;
  vision?: string;
  objectives?: string[];
  introduction?: string;
  meetingFrequency?: string;
  meetingDayTime?: string;
  meetingVenue?: string;
  campusLocation?: string;
  contactEmail?: string;
  socialLinks?: {
    instagram?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
}

export interface CoordinatorDashboardStats {
  totalMembers: number;
  activeMembers: number;
  upcomingEvents: number;
  publishedNews: number;
  draftContentCount: number;
  recruitmentStatus: RecruitmentStatus;
  openPositionsCount: number;
  totalApplications: number;
  pendingApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;
  profileCompletion: number;
  itemsAwaitingApproval: number;
  recentActivity: Array<{
    id: string | number;
    action: string;
    actor: string;
    target: string;
    timestamp: string;
  }>;
}

export interface ClubProfileFormData {
  name: string;
  slug: string;
  category: string;
  tagline: string;
  shortDescription?: string;
  description?: string;
  mission?: string;
  vision?: string;
  objectives?: string[];
  introduction?: string;
  establishedYear?: number;
  facultyAdvisor?: string;
  meetingFrequency?: string;
  meetingDayTime?: string;
  meetingVenue?: string;
  campusLocation?: string;
  contactEmail?: string;
  websiteUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  logoUrl?: string;
  bannerUrl?: string;
}

export interface ClubSectionItem {
  id?: number;
  clubId: number;
  sectionKey: string;
  title: string;
  content?: string;
  isEnabled: boolean;
  displayOrder: number;
}

export interface RecruitmentPositionItem {
  id?: number;
  clubId: number;
  recruitmentId?: number;
  title: string;
  department?: string;
  description: string;
  responsibilities?: string;
  requiredSkills: string[];
  preferredSkills?: string[];
  openings: number;
  isActive: boolean;
  deadline?: string;
}

export interface RecruitmentConfig {
  id?: number;
  clubId: number;
  title: string;
  cycleName: string;
  shortAnnouncement?: string;
  description: string;
  status: RecruitmentStatus;
  mode: RecruitmentMode;
  deadline: string;
  openingDate?: string;
  requiredYear?: string;
  eligibleDepartments?: string[];
  minGpaOrRequirements?: string;
  customQuestions?: Array<{
    id: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'checkbox';
    required: boolean;
    options?: string[];
  }>;
}

export interface ApplicationItem {
  id: number;
  recruitmentId: number;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  department?: string;
  year?: string;
  positionTitle?: string;
  coverLetter?: string;
  portfolioUrl?: string;
  statementOfPurpose?: string;
  answers?: Record<string, any>;
  stage: ApplicationStage;
  appliedAt: string;
  updatedAt: string;
}

export interface ClubTeamRosterItem {
  id?: number;
  clubId: number;
  userId?: string;
  displayName: string;
  clubRole: string;
  bio?: string;
  avatarUrl?: string;
  responsibilities?: string;
  termYear?: string;
  displayOrder: number;
  isPublic: boolean;
}

export interface ClubAchievementItem {
  id?: number;
  clubId: number;
  title: string;
  description?: string;
  organization?: string;
  awardDate?: string;
  imageUrl?: string;
  isPublished: boolean;
}

export interface ClubProjectItem {
  id?: number;
  clubId: number;
  title: string;
  summary?: string;
  description?: string;
  techStack: string[];
  demoUrl?: string;
  repoUrl?: string;
  status: string;
  year?: string;
  isPublished: boolean;
}

export interface ClubGalleryMediaItem {
  id?: number;
  clubId: number;
  title: string;
  imageUrl: string;
  caption?: string;
  eventTag?: string;
  displayOrder: number;
  isPublished: boolean;
}

export interface ClubFaqItem {
  id?: number;
  clubId: number;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
  isPublished: boolean;
}

export interface ApprovalRequestItem {
  id: number;
  clubId: number;
  submittedBy: string;
  requestType: 'profile_update' | 'event_publish' | 'recruitment_launch' | 'general';
  status: ApprovalStatus;
  payload: any;
  adminNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface ClubMemberDirectoryItem {
  id: number;
  clubId: number;
  userId: string;
  name: string;
  email: string;
  department?: string;
  year?: string;
  role: 'member' | 'lead' | 'advisor';
  joinedAt: string;
  avatarUrl?: string;
}

export interface AuditLogItem {
  id: number;
  actorId?: string;
  actorName?: string;
  action: string;
  entityType: string;
  entityId: string;
  clubId?: number;
  details?: any;
  createdAt: string;
}
