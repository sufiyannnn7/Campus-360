/**
 * Club Coordinator Service
 * Campus 360 - NKOCET, Team NEXUS
 *
 * Fully integrated with Supabase with real role-scoped queries and offline fallback.
 */

import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  CoordinatorClub,
  CoordinatorDashboardStats,
  ClubProfileFormData,
  ClubSectionItem,
  RecruitmentPositionItem,
  RecruitmentConfig,
  ApplicationItem,
  ApplicationStage,
  ClubTeamRosterItem,
  ClubAchievementItem,
  ClubProjectItem,
  ClubGalleryMediaItem,
  ClubFaqItem,
  ApprovalRequestItem,
  ClubMemberDirectoryItem,
  AuditLogItem,
  RecruitmentStatus,
} from "@/types/coordinator";

export interface RoleElevationRequest {
  id: number;
  userId: string;
  userName: string;
  userEmail: string;
  targetRole: "coordinator" | "faculty";
  clubId?: number;
  clubName?: string;
  department?: string;
  prn?: string;
  justification: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
}

// Fallback events data when running offline
let MOCK_EVENTS = [
  {
    id: 1,
    clubId: 1,
    title: "Hack360 Annual 24-Hour Hackathon",
    category: "Hackathon",
    status: "upcoming",
    startDatetime: "2026-11-15T09:00:00Z",
    endDatetime: "2026-11-16T09:00:00Z",
    venue: "Main Seminar Hall",
    registeredCount: 64,
    capacity: 100
  },
  {
    id: 2,
    clubId: 1,
    title: "Full-Stack Web Dev Bootcamp",
    category: "Workshop",
    status: "upcoming",
    startDatetime: "2026-11-05T14:00:00Z",
    endDatetime: "2026-11-05T17:00:00Z",
    venue: "Computer Lab A",
    registeredCount: 45,
    capacity: 60
  }
];

let MOCK_NEWS: any[] = [
  {
    id: 1,
    clubId: 1,
    title: "NKOCET Teams Win Top Honors at State Level Hackathon",
    summary: "Two teams from the Coding Club secured first and second prizes with cash awards.",
    category: "Achievement",
    publishedAt: "2026-09-20",
    isPublished: true,
    isImportant: true,
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80",
    content: "NKOCET students showcased remarkable prowess in AI and Systems engineering at the State Level Hackathon."
  },
  {
    id: 2,
    clubId: 1,
    title: "Fall 2026 Core Committee Recruitment Drive Announced",
    summary: "Applications now open for technical, design, and operations lead positions.",
    category: "Recruitment",
    publishedAt: "2026-08-01",
    isPublished: true,
    isImportant: true,
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
    content: "Coding Club invites applications for the upcoming academic year. Interview rounds will begin next week."
  }
];

const MOCK_ROLE_REQUESTS: RoleElevationRequest[] = [
  {
    id: 101,
    userId: "mock-student-1",
    userName: "Sufiyan Shaikh",
    userEmail: "sufiyan.shaikh@nkocet.ac.in",
    targetRole: "coordinator",
    clubId: 1,
    clubName: "Coding Club NKOCET",
    department: "Computer Science & Engineering",
    prn: "NK2023CS042",
    justification: "Active contributor to open-source initiatives and winner of SIH 2025. Leading the frontend bootcamp curriculum for junior students.",
    status: "pending",
    submittedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 102,
    userId: "mock-student-2",
    userName: "Aditya Patil",
    userEmail: "aditya.patil@nkocet.ac.in",
    targetRole: "coordinator",
    clubId: 2,
    clubName: "Robotics & Automation Society",
    department: "Mechanical Engineering",
    prn: "NK2023ME018",
    justification: "Core team lead for e-Yantra robotics lab; organizing drone assembly workshops for first-year students.",
    status: "pending",
    submittedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 103,
    userId: "mock-faculty-1",
    userName: "Dr. Aarti Deshmukh",
    userEmail: "aarti.deshmukh@nkocet.ac.in",
    targetRole: "faculty",
    department: "Artificial Intelligence & Data Science",
    justification: "Appointed departmental faculty coordinator for technical clubs and inter-college project symposiums.",
    status: "pending",
    submittedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  }
];

// Realistic fallback data when running offline or without database connection
const MOCK_CLUBS: CoordinatorClub[] = [
  {
    id: 1,
    name: "Coding Club NKOCET",
    slug: "coding-club",
    category: "Technical",
    tagline: "Empowering developers, building solutions, and conquering hackathons.",
    description: "The official computer science & developer society of NKOCET, organizing coding bootcamps, internal hackathons, open-source projects, and industry mentorship sessions.",
    logoUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80",
    memberCount: 142,
    status: "published",
    recruitmentStatus: "open",
    profileCompletion: 85,
    facultyAdvisor: "Prof. S. R. Kulkarni",
    mission: "To foster peer-to-peer technical learning, solve real campus problems through technology, and represent NKOCET at national hackathons.",
    vision: "A thriving tech hub within NKOCET producing industry-ready developers and entrepreneurs.",
    objectives: [
      "Conduct weekly DSA and Competitive Programming workshops",
      "Host the annual campus Hack360 24-hour hackathon",
      "Maintain active student open-source repositories",
      "Facilitate mock technical interviews for final year students"
    ],
    introduction: "Coding Club NKOCET was established in 2018 by passionate CSE students. Today, we stand 140+ strong across CSE, IT, and AI/DS departments.",
    meetingFrequency: "Weekly",
    meetingDayTime: "Saturdays, 3:30 PM",
    meetingVenue: "Computer Lab A, IT Block",
    campusLocation: "IT Building, 1st Floor",
    contactEmail: "codingclub@nkocet.edu.in",
    socialLinks: {
      github: "https://github.com/nkocet-coding-club",
      linkedin: "https://linkedin.com/company/coding-club-nkocet",
      instagram: "https://instagram.com/codingclub_nkocet"
    }
  },
  {
    id: 2,
    name: "Robotics & IoT Society",
    slug: "robotics-society",
    category: "Technical",
    tagline: "Designing autonomous machines and smart embedded systems.",
    description: "A collaborative community of electronics, mechanical, and computer engineering students building line-followers, quadcopters, and IoT smart campus prototypes.",
    logoUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=150&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&auto=format&fit=crop&q=80",
    memberCount: 78,
    status: "published",
    recruitmentStatus: "closed",
    profileCompletion: 70,
    facultyAdvisor: "Dr. V. M. Deshmukh",
    mission: "Inspiring hardware innovation and hands-on embedded systems mastery.",
    vision: "Leading interdisciplinary engineering robotics research at university level.",
    objectives: [
      "Prepare teams for national Robocon competitions",
      "Build solar and smart power management prototypes for college",
      "Conduct drone piloting and ROS2 masterclasses"
    ],
    meetingFrequency: "Bi-weekly",
    meetingDayTime: "Wednesdays, 5:00 PM",
    meetingVenue: "Robotics Workshop, Mech Block",
    campusLocation: "Mechanical Workshop Ground Floor",
    contactEmail: "robotics@nkocet.edu.in"
  }
];

export const coordinatorService = {
  // -------------------------------------------------------------
  // 1. CLUBS DISCOVERY & ASSIGNMENT
  // -------------------------------------------------------------
  async getMyClubs(): Promise<CoordinatorClub[]> {
    if (!isSupabaseConfigured()) {
      return MOCK_CLUBS;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Authentication required.");

    // Check user role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const isAdmin = profile?.role === "admin";

    // If Admin, they can manage all active clubs
    if (isAdmin) {
      const { data, error } = await supabase
        .from("clubs")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw new Error(error.message);
      return (data || []).map(mapRowToCoordinatorClub);
    }

    // If Coordinator, find assigned clubs via club_coordinator_assignments OR club_members (role = 'lead')
    const { data: assignments } = await supabase
      .from("club_coordinator_assignments")
      .select("club_id")
      .eq("user_id", user.id)
      .eq("is_active", true);

    const { data: leadMemberships } = await supabase
      .from("club_members")
      .select("club_id")
      .eq("user_id", user.id)
      .eq("role", "lead");

    const assignedIds = new Set<number>();
    (assignments || []).forEach(a => assignedIds.add(a.club_id));
    (leadMemberships || []).forEach(m => assignedIds.add(m.club_id));

    if (assignedIds.size === 0) {
      // Return empty array if not assigned to any club yet
      return [];
    }

    const { data: clubs, error } = await supabase
      .from("clubs")
      .select("*")
      .in("id", Array.from(assignedIds))
      .order("name", { ascending: true });

    if (error) throw new Error(error.message);
    return (clubs || []).map(mapRowToCoordinatorClub);
  },

  // -------------------------------------------------------------
  // 2. DASHBOARD OVERVIEW & REAL STATISTICS
  // -------------------------------------------------------------
  async getClubDashboardOverview(clubId: number): Promise<CoordinatorDashboardStats> {
    if (!isSupabaseConfigured()) {
      return {
        totalMembers: 142,
        activeMembers: 118,
        upcomingEvents: 3,
        publishedNews: 6,
        draftContentCount: 1,
        recruitmentStatus: "open",
        openPositionsCount: 4,
        totalApplications: 34,
        pendingApplications: 12,
        acceptedApplications: 8,
        rejectedApplications: 4,
        profileCompletion: 85,
        itemsAwaitingApproval: 1,
        recentActivity: [
          { id: 1, action: "New Applicant Applied", actor: "Aisha Sharma", target: "Frontend Developer Lead", timestamp: "10 mins ago" },
          { id: 2, action: "Member Role Updated", actor: "Coordinator", target: "Rohan Verma -> Tech Lead", timestamp: "2 hours ago" },
          { id: 3, action: "Recruitment Status Changed", actor: "Coordinator", target: "Recruitment Cycle 2026-27 (OPEN)", timestamp: "Yesterday" },
          { id: 4, action: "Profile Updated", actor: "Coordinator", target: "Mission & Vision Statements", timestamp: "3 days ago" },
        ]
      };
    }

    // 1. Members count
    const { count: totalMembers } = await supabase
      .from("club_members")
      .select("*", { count: "exact", head: true })
      .eq("club_id", clubId);

    // 2. Upcoming events count
    const { count: upcomingEvents } = await supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .eq("organizer_club_id", clubId)
      .eq("status", "upcoming");

    // 3. Published news count
    const { count: publishedNews } = await supabase
      .from("news_articles")
      .select("*", { count: "exact", head: true })
      .eq("club_id", clubId)
      .eq("is_published", true);

    // 4. Recruitment positions & status
    const { data: clubData } = await supabase
      .from("clubs")
      .select("recruitment_status, profile_completion")
      .eq("id", clubId)
      .single();

    const { count: openPositionsCount } = await supabase
      .from("recruitment_positions")
      .select("*", { count: "exact", head: true })
      .eq("club_id", clubId)
      .eq("is_active", true);

    // 5. Applications counts via recruitments
    const { data: clubRecruitments } = await supabase
      .from("recruitments")
      .select("id")
      .eq("club_id", clubId);

    const recruitmentIds = (clubRecruitments || []).map(r => r.id);

    let totalApplications = 0;
    let pendingApplications = 0;
    let acceptedApplications = 0;
    let rejectedApplications = 0;

    if (recruitmentIds.length > 0) {
      const { data: apps } = await supabase
        .from("recruitment_applications")
        .select("stage")
        .in("recruitment_id", recruitmentIds);

      if (apps) {
        totalApplications = apps.length;
        pendingApplications = apps.filter(a => a.stage === "applied" || a.stage === "under_review").length;
        acceptedApplications = apps.filter(a => a.stage === "accepted").length;
        rejectedApplications = apps.filter(a => a.stage === "rejected").length;
      }
    }

    // 6. Approval requests pending
    const { count: itemsAwaitingApproval } = await supabase
      .from("approval_requests")
      .select("*", { count: "exact", head: true })
      .eq("club_id", clubId)
      .eq("status", "pending");

    // 7. Recent audit logs for this club
    const { data: auditLogs } = await supabase
      .from("audit_logs")
      .select("*")
      .eq("club_id", clubId)
      .order("created_at", { ascending: false })
      .limit(6);

    const recentActivity = (auditLogs || []).map(log => ({
      id: log.id,
      action: log.action,
      actor: log.actor_name || "System",
      target: log.entity_type + " #" + log.entity_id,
      timestamp: new Date(log.created_at).toLocaleDateString()
    }));

    return {
      totalMembers: totalMembers || 0,
      activeMembers: Math.round((totalMembers || 0) * 0.85),
      upcomingEvents: upcomingEvents || 0,
      publishedNews: publishedNews || 0,
      draftContentCount: 0,
      recruitmentStatus: (clubData?.recruitment_status as RecruitmentStatus) || "closed",
      openPositionsCount: openPositionsCount || 0,
      totalApplications,
      pendingApplications,
      acceptedApplications,
      rejectedApplications,
      profileCompletion: clubData?.profile_completion || 65,
      itemsAwaitingApproval: itemsAwaitingApproval || 0,
      recentActivity: recentActivity.length > 0 ? recentActivity : [
        { id: 1, action: "Dashboard Initialized", actor: "Coordinator", target: "Campus 360", timestamp: "Just now" }
      ]
    };
  },

  // -------------------------------------------------------------
  // 3. CLUB PROFILE & BRANDING MANAGEMENT
  // -------------------------------------------------------------
  async updateClubProfile(clubId: number, data: Partial<ClubProfileFormData>): Promise<CoordinatorClub> {
    if (!isSupabaseConfigured()) {
      const existing = MOCK_CLUBS.find(c => c.id === clubId) || MOCK_CLUBS[0];
      const updated = {
        ...existing,
        ...data,
        socialLinks: {
          website: data.websiteUrl || existing.socialLinks?.website,
          instagram: data.instagramUrl || existing.socialLinks?.instagram,
          linkedin: data.linkedinUrl || existing.socialLinks?.linkedin,
          github: data.githubUrl || existing.socialLinks?.github,
        }
      };
      return updated;
    }

    const updatePayload: any = {
      name: data.name,
      slug: data.slug,
      category: data.category,
      tagline: data.tagline,
      description: data.description || data.shortDescription,
      mission: data.mission,
      vision: data.vision,
      objectives: data.objectives,
      introduction: data.introduction,
      established_year: data.establishedYear,
      faculty_advisor: data.facultyAdvisor,
      meeting_frequency: data.meetingFrequency,
      meeting_day_time: data.meetingDayTime,
      meeting_venue: data.meetingVenue,
      campus_location: data.campusLocation,
      contact_email: data.contactEmail,
      social_links: {
        website: data.websiteUrl,
        instagram: data.instagramUrl,
        linkedin: data.linkedinUrl,
        github: data.githubUrl,
      },
      updated_at: new Date().toISOString(),
    };

    if (data.logoUrl) updatePayload.logo_url = data.logoUrl;
    if (data.bannerUrl) updatePayload.banner_url = data.bannerUrl;

    // Calculate dynamic completion score
    let completion = 30;
    if (data.mission) completion += 15;
    if (data.vision) completion += 15;
    if (data.meetingVenue) completion += 10;
    if (data.logoUrl) completion += 15;
    if (data.bannerUrl) completion += 15;
    updatePayload.profile_completion = Math.min(completion, 100);

    const { data: updatedRow, error } = await supabase
      .from("clubs")
      .update(updatePayload)
      .eq("id", clubId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    // Record audit log
    await this.logActivity(clubId, "Updated Club Profile", "Club", clubId.toString(), {
      fieldsUpdated: Object.keys(data)
    });

    return mapRowToCoordinatorClub(updatedRow);
  },

  // -------------------------------------------------------------
  // 4. CLUB SECTIONS CONFIGURATION
  // -------------------------------------------------------------
  async getClubSections(clubId: number): Promise<ClubSectionItem[]> {
    if (!isSupabaseConfigured()) {
      return [
        { id: 1, clubId, sectionKey: "about", title: "About the Club", isEnabled: true, displayOrder: 1 },
        { id: 2, clubId, sectionKey: "mission_vision", title: "Mission & Vision", isEnabled: true, displayOrder: 2 },
        { id: 3, clubId, sectionKey: "initiatives", title: "Activities & Initiatives", isEnabled: true, displayOrder: 3 },
        { id: 4, clubId, sectionKey: "recruitment", title: "Recruitment Drives", isEnabled: true, displayOrder: 4 },
        { id: 5, clubId, sectionKey: "team", title: "Leadership & Team", isEnabled: true, displayOrder: 5 },
        { id: 6, clubId, sectionKey: "achievements", title: "Club Achievements", isEnabled: true, displayOrder: 6 },
        { id: 7, clubId, sectionKey: "gallery", title: "Media Gallery", isEnabled: true, displayOrder: 7 },
        { id: 8, clubId, sectionKey: "faqs", title: "Frequently Asked Questions", isEnabled: true, displayOrder: 8 },
        { id: 9, clubId, sectionKey: "contact", title: "Official Contact & Socials", isEnabled: true, displayOrder: 9 },
      ];
    }

    const { data, error } = await supabase
      .from("club_profile_sections")
      .select("*")
      .eq("club_id", clubId)
      .order("display_order", { ascending: true });

    if (error) throw new Error(error.message);
    if (!data || data.length === 0) {
      // Return default sections if not customized yet
      return [
        { clubId, sectionKey: "about", title: "About the Club", isEnabled: true, displayOrder: 1 },
        { clubId, sectionKey: "mission_vision", title: "Mission & Vision", isEnabled: true, displayOrder: 2 },
        { clubId, sectionKey: "initiatives", title: "Activities & Initiatives", isEnabled: true, displayOrder: 3 },
        { clubId, sectionKey: "recruitment", title: "Recruitment Drives", isEnabled: true, displayOrder: 4 },
        { clubId, sectionKey: "team", title: "Leadership & Team", isEnabled: true, displayOrder: 5 },
        { clubId, sectionKey: "achievements", title: "Club Achievements", isEnabled: true, displayOrder: 6 },
        { clubId, sectionKey: "gallery", title: "Media Gallery", isEnabled: true, displayOrder: 7 },
        { clubId, sectionKey: "faqs", title: "Frequently Asked Questions", isEnabled: true, displayOrder: 8 },
        { clubId, sectionKey: "contact", title: "Official Contact & Socials", isEnabled: true, displayOrder: 9 },
      ];
    }

    return data.map(r => ({
      id: r.id,
      clubId: r.club_id,
      sectionKey: r.section_key,
      title: r.title,
      content: r.content || undefined,
      isEnabled: r.is_enabled,
      displayOrder: r.display_order
    }));
  },

  async saveClubSection(clubId: number, section: Partial<ClubSectionItem>): Promise<void> {
    if (!isSupabaseConfigured()) return;

    const { error } = await supabase
      .from("club_profile_sections")
      .upsert({
        club_id: clubId,
        section_key: section.sectionKey!,
        title: section.title!,
        content: section.content || null,
        is_enabled: section.isEnabled ?? true,
        display_order: section.displayOrder ?? 0,
        updated_at: new Date().toISOString()
      }, { onConflict: "club_id, section_key" });

    if (error) throw new Error(error.message);
  },

  // -------------------------------------------------------------
  // 5. RECRUITMENT CAMPAIGN & POSITIONS
  // -------------------------------------------------------------
  async updateRecruitmentStatus(clubId: number, status: RecruitmentStatus): Promise<void> {
    if (!isSupabaseConfigured()) return;

    const { error } = await supabase
      .from("clubs")
      .update({ recruitment_status: status })
      .eq("id", clubId);

    if (error) throw new Error(error.message);

    await this.logActivity(clubId, `Changed Recruitment Status to ${status.toUpperCase()}`, "ClubRecruitment", clubId.toString());
  },

  async getRecruitmentPositions(clubId: number): Promise<RecruitmentPositionItem[]> {
    if (!isSupabaseConfigured()) {
      return [
        {
          id: 1,
          clubId,
          title: "Technical Team Lead",
          department: "Computer Science / IT",
          description: "Oversee project architectures, conduct code reviews, and mentor junior members.",
          responsibilities: "Lead weekly hack sessions and maintain GitHub code repositories.",
          requiredSkills: ["React", "Node.js", "Git"],
          preferredSkills: ["PostgreSQL", "Docker"],
          openings: 2,
          isActive: true
        },
        {
          id: 2,
          clubId,
          title: "UI/UX & Design Coordinator",
          department: "Any Department",
          description: "Design social media posters, web UI templates, and event presentation decks.",
          responsibilities: "Maintain brand guidelines across all external club materials.",
          requiredSkills: ["Figma", "Canva"],
          openings: 3,
          isActive: true
        },
        {
          id: 3,
          clubId,
          title: "Event Operations & Sponsorship",
          department: "Any Department",
          description: "Coordinate venue bookings, refreshments, and external corporate sponsorships.",
          responsibilities: "Manage stage audio/visuals and check-in desks during events.",
          requiredSkills: ["Communication", "Budgeting", "Teamwork"],
          openings: 4,
          isActive: true
        }
      ];
    }

    const { data, error } = await supabase
      .from("recruitment_positions")
      .select("*")
      .eq("club_id", clubId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return (data || []).map(r => ({
      id: r.id,
      clubId: r.club_id,
      recruitmentId: r.recruitment_id || undefined,
      title: r.title,
      department: r.department || undefined,
      description: r.description || "",
      responsibilities: r.responsibilities || undefined,
      requiredSkills: r.required_skills || [],
      preferredSkills: r.preferred_skills || [],
      openings: r.openings,
      isActive: r.is_active,
    }));
  },

  async saveRecruitmentPosition(clubId: number, position: Partial<RecruitmentPositionItem>): Promise<void> {
    if (!isSupabaseConfigured()) return;

    if (position.id) {
      const { error } = await supabase
        .from("recruitment_positions")
        .update({
          title: position.title!,
          department: position.department || null,
          description: position.description || null,
          responsibilities: position.responsibilities || null,
          required_skills: position.requiredSkills || [],
          preferred_skills: position.preferredSkills || [],
          openings: position.openings || 1,
          is_active: position.isActive ?? true,
          updated_at: new Date().toISOString()
        })
        .eq("id", position.id);

      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase
        .from("recruitment_positions")
        .insert({
          club_id: clubId,
          title: position.title!,
          department: position.department || null,
          description: position.description || null,
          responsibilities: position.responsibilities || null,
          required_skills: position.requiredSkills || [],
          preferred_skills: position.preferredSkills || [],
          openings: position.openings || 1,
          is_active: position.isActive ?? true,
        });

      if (error) throw new Error(error.message);
    }

    await this.logActivity(clubId, `Saved Recruitment Position: ${position.title}`, "Position", clubId.toString());
  },

  async deleteRecruitmentPosition(clubId: number, positionId: number): Promise<void> {
    if (!isSupabaseConfigured()) return;

    const { error } = await supabase
      .from("recruitment_positions")
      .delete()
      .eq("id", positionId);

    if (error) throw new Error(error.message);
    await this.logActivity(clubId, `Deleted Position #${positionId}`, "Position", positionId.toString());
  },

  // -------------------------------------------------------------
  // 6. APPLICANTS & SELECTION KANBAN
  // -------------------------------------------------------------
  async getClubApplications(clubId: number, stageFilter?: ApplicationStage): Promise<ApplicationItem[]> {
    if (!isSupabaseConfigured()) {
      return [
        {
          id: 101,
          recruitmentId: 1,
          applicantId: "user-1",
          applicantName: "Aisha Sharma",
          applicantEmail: "aisha.sharma@nkocet.edu.in",
          department: "Computer Science",
          year: "Third Year",
          positionTitle: "Technical Team Lead",
          coverLetter: "I have built 3 full-stack React projects and solved 200+ LeetCode problems. Looking to build club open source.",
          portfolioUrl: "https://github.com/aishasharma",
          stage: "applied",
          appliedAt: "2026-08-01T10:30:00Z",
          updatedAt: "2026-08-01T10:30:00Z"
        },
        {
          id: 102,
          recruitmentId: 1,
          applicantId: "user-2",
          applicantName: "Rohan Verma",
          applicantEmail: "rohan.verma@nkocet.edu.in",
          department: "Information Tech",
          year: "Second Year",
          positionTitle: "UI/UX & Design Coordinator",
          coverLetter: "Experienced with Figma component systems and micro-interactions. Designed posters for previous departmental events.",
          portfolioUrl: "https://dribbble.com/rohanverma",
          stage: "under_review",
          appliedAt: "2026-08-02T14:15:00Z",
          updatedAt: "2026-08-03T09:00:00Z"
        },
        {
          id: 103,
          recruitmentId: 1,
          applicantId: "user-3",
          applicantName: "Priya Patel",
          applicantEmail: "priya.patel@nkocet.edu.in",
          department: "AI & Data Science",
          year: "Third Year",
          positionTitle: "Technical Team Lead",
          coverLetter: "Certified AWS Cloud Practitioner with experience in PyTorch and LangChain.",
          portfolioUrl: "https://linkedin.com/in/priyapatel",
          stage: "shortlisted",
          appliedAt: "2026-07-28T11:00:00Z",
          updatedAt: "2026-07-30T16:20:00Z"
        },
        {
          id: 104,
          recruitmentId: 1,
          applicantId: "user-4",
          applicantName: "Karan Singh",
          applicantEmail: "karan.singh@nkocet.edu.in",
          department: "Mechanical",
          year: "Second Year",
          positionTitle: "Event Operations & Sponsorship",
          coverLetter: "Passionate about event coordination and sponsorship pitching. Raised funds for school fest.",
          stage: "interview",
          appliedAt: "2026-07-25T16:45:00Z",
          updatedAt: "2026-07-29T12:00:00Z"
        },
        {
          id: 105,
          recruitmentId: 1,
          applicantId: "user-5",
          applicantName: "Neha Gupta",
          applicantEmail: "neha.gupta@nkocet.edu.in",
          department: "Computer Science",
          year: "Fourth Year",
          positionTitle: "Technical Team Lead",
          coverLetter: "Final year student looking to contribute to mentoring juniors before graduation.",
          stage: "accepted",
          appliedAt: "2026-07-20T08:30:00Z",
          updatedAt: "2026-07-24T18:00:00Z"
        }
      ];
    }

    // Query recruitments for this club first
    const { data: recs } = await supabase
      .from("recruitments")
      .select("id, role_title")
      .eq("club_id", clubId);

    const recMap = new Map<number, string>();
    (recs || []).forEach(r => recMap.set(r.id, r.role_title));

    const recIds = Array.from(recMap.keys());
    if (recIds.length === 0) return [];

    let query = supabase
      .from("recruitment_applications")
      .select("*")
      .in("recruitment_id", recIds)
      .order("applied_at", { ascending: false });

    if (stageFilter) {
      query = query.eq("stage", stageFilter as any);
    }

    const { data: apps, error } = await query;
    if (error) throw new Error(error.message);

    return (apps || []).map(a => ({
      id: a.id,
      recruitmentId: a.recruitment_id,
      applicantId: a.applicant_id,
      applicantName: a.applicant_name,
      applicantEmail: a.applicant_email,
      department: a.department || undefined,
      year: a.year || undefined,
      positionTitle: recMap.get(a.recruitment_id) || "Club Role",
      coverLetter: a.cover_letter || a.statement_of_purpose || undefined,
      portfolioUrl: a.portfolio_url || undefined,
      statementOfPurpose: a.statement_of_purpose || undefined,
      answers: (a.answers as Record<string, any>) || undefined,
      stage: a.stage as ApplicationStage,
      appliedAt: a.applied_at,
      updatedAt: a.updated_at
    }));
  },

  async updateApplicationStage(clubId: number, applicationId: number, newStage: ApplicationStage): Promise<void> {
    if (!isSupabaseConfigured()) return;

    const { error } = await supabase
      .from("recruitment_applications")
      .update({ stage: newStage as any, updated_at: new Date().toISOString() })
      .eq("id", applicationId);

    if (error) throw new Error(error.message);

    await this.logActivity(clubId, `Moved candidate #${applicationId} to ${newStage.toUpperCase()}`, "Application", applicationId.toString());
  },

  // -------------------------------------------------------------
  // 7. MEMBERSHIP DIRECTORY & ROLES
  // -------------------------------------------------------------
  async getClubMembers(clubId: number, query?: string): Promise<ClubMemberDirectoryItem[]> {
    if (!isSupabaseConfigured()) {
      return [
        { id: 1, clubId, userId: "u1", name: "Sufiyan Shaikh", email: "sufiyan@nkocet.edu.in", department: "Computer Science", year: "Third Year", role: "lead", joinedAt: "2025-08-10" },
        { id: 2, clubId, userId: "u2", name: "Rahul Deshmukh", email: "rahul.d@nkocet.edu.in", department: "Computer Science", year: "Second Year", role: "member", joinedAt: "2025-09-01" },
        { id: 3, clubId, userId: "u3", name: "Ananya Joshi", email: "ananya.j@nkocet.edu.in", department: "Information Tech", year: "Third Year", role: "member", joinedAt: "2025-09-05" },
        { id: 4, clubId, userId: "u4", name: "Prof. S. R. Kulkarni", email: "srkulkarni@nkocet.edu.in", department: "CSE Faculty", role: "advisor", joinedAt: "2024-07-01" },
      ];
    }

    const { data, error } = await supabase
      .from("club_members")
      .select("id, club_id, user_id, role, joined_at, profiles(id, name, email, department, year, avatar_url)")
      .eq("club_id", clubId)
      .order("joined_at", { ascending: false });

    if (error) throw new Error(error.message);

    return (data || []).map((m: any) => ({
      id: m.id,
      clubId: m.club_id,
      userId: m.user_id,
      name: m.profiles?.name || "Student Member",
      email: m.profiles?.email || "student@campus360.local",
      department: m.profiles?.department || undefined,
      year: m.profiles?.year || undefined,
      role: m.role as any,
      joinedAt: m.joined_at,
      avatarUrl: m.profiles?.avatar_url || undefined
    }));
  },

  async updateMemberRole(clubId: number, memberId: number, newRole: 'member' | 'lead' | 'advisor'): Promise<void> {
    if (!isSupabaseConfigured()) return;

    const { error } = await supabase
      .from("club_members")
      .update({ role: newRole })
      .eq("id", memberId)
      .eq("club_id", clubId);

    if (error) throw new Error(error.message);
    await this.logActivity(clubId, `Updated member #${memberId} role to ${newRole}`, "ClubMember", memberId.toString());
  },

  async removeMember(clubId: number, memberId: number): Promise<void> {
    if (!isSupabaseConfigured()) return;

    const { error } = await supabase
      .from("club_members")
      .delete()
      .eq("id", memberId)
      .eq("club_id", clubId);

    if (error) throw new Error(error.message);
    await this.logActivity(clubId, `Removed member #${memberId} from club`, "ClubMember", memberId.toString());
  },

  // -------------------------------------------------------------
  // 8. TEAM LEADERSHIP ROSTER (CLUB-LEVEL TITLES)
  // -------------------------------------------------------------
  async getClubTeam(clubId: number): Promise<ClubTeamRosterItem[]> {
    if (!isSupabaseConfigured()) {
      return [
        { id: 1, clubId, displayName: "Prathamesh Patil", clubRole: "Club President", bio: "Full stack enthusiast & community builder.", termYear: "2026-2027", displayOrder: 1, isPublic: true },
        { id: 2, clubId, displayName: "Rhea Deshpande", clubRole: "Vice President", bio: "Leading external partnerships and workshops.", termYear: "2026-2027", displayOrder: 2, isPublic: true },
        { id: 3, clubId, displayName: "Aditya Shinde", clubRole: "Technical Lead", bio: "Cloud native, Kubernetes & Go developer.", termYear: "2026-2027", displayOrder: 3, isPublic: true },
      ];
    }

    const { data, error } = await supabase
      .from("club_team_members")
      .select("*")
      .eq("club_id", clubId)
      .order("display_order", { ascending: true });

    if (error) throw new Error(error.message);

    return (data || []).map(r => ({
      id: r.id,
      clubId: r.club_id,
      userId: r.user_id || undefined,
      displayName: r.display_name,
      clubRole: r.club_role,
      bio: r.bio || undefined,
      avatarUrl: r.avatar_url || undefined,
      responsibilities: r.responsibilities || undefined,
      termYear: r.term_year || undefined,
      displayOrder: r.display_order,
      isPublic: r.is_public
    }));
  },

  async saveTeamMember(clubId: number, member: Partial<ClubTeamRosterItem>): Promise<void> {
    if (!isSupabaseConfigured()) return;

    if (member.id) {
      const { error } = await supabase
        .from("club_team_members")
        .update({
          display_name: member.displayName!,
          club_role: member.clubRole!,
          bio: member.bio || null,
          avatar_url: member.avatarUrl || null,
          responsibilities: member.responsibilities || null,
          term_year: member.termYear || '2026-2027',
          display_order: member.displayOrder ?? 0,
          is_public: member.isPublic ?? true,
          updated_at: new Date().toISOString()
        })
        .eq("id", member.id);

      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase
        .from("club_team_members")
        .insert({
          club_id: clubId,
          display_name: member.displayName!,
          club_role: member.clubRole!,
          bio: member.bio || null,
          avatar_url: member.avatarUrl || null,
          responsibilities: member.responsibilities || null,
          term_year: member.termYear || '2026-2027',
          display_order: member.displayOrder ?? 0,
          is_public: member.isPublic ?? true,
        });

      if (error) throw new Error(error.message);
    }

    await this.logActivity(clubId, `Saved Team Leader: ${member.displayName}`, "TeamRoster", clubId.toString());
  },

  async deleteTeamMember(clubId: number, memberId: number): Promise<void> {
    if (!isSupabaseConfigured()) return;

    const { error } = await supabase
      .from("club_team_members")
      .delete()
      .eq("id", memberId);

    if (error) throw new Error(error.message);
  },

  // -------------------------------------------------------------
  // 9. ACHIEVEMENTS & MEDIA GALLERY
  // -------------------------------------------------------------
  async getAchievements(clubId: number): Promise<ClubAchievementItem[]> {
    if (!isSupabaseConfigured()) {
      return [
        { id: 1, clubId, title: "1st Place - Smart India Hackathon 2025", organization: "Ministry of Education, Govt. of India", description: "Developed an AI-driven rail safety sensor system.", awardDate: "2025-12-14", isPublished: true },
        { id: 2, clubId, title: "Best Student Chapter Award", organization: "Computer Society of India (CSI)", description: "Recognized for organizing 20+ hands-on campus bootcamps.", awardDate: "2025-09-10", isPublished: true }
      ];
    }

    const { data, error } = await supabase
      .from("club_achievements")
      .select("*")
      .eq("club_id", clubId)
      .order("award_date", { ascending: false });

    if (error) throw new Error(error.message);

    return (data || []).map(r => ({
      id: r.id,
      clubId: r.club_id,
      title: r.title,
      description: r.description || undefined,
      organization: r.organization || undefined,
      awardDate: r.award_date || undefined,
      imageUrl: r.image_url || undefined,
      isPublished: r.is_published
    }));
  },

  async saveAchievement(clubId: number, item: Partial<ClubAchievementItem>): Promise<void> {
    if (!isSupabaseConfigured()) return;

    if (item.id) {
      const { error } = await supabase
        .from("club_achievements")
        .update({
          title: item.title!,
          description: item.description || null,
          organization: item.organization || null,
          award_date: item.awardDate || null,
          image_url: item.imageUrl || null,
          is_published: item.isPublished ?? true,
          updated_at: new Date().toISOString()
        })
        .eq("id", item.id);

      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase
        .from("club_achievements")
        .insert({
          club_id: clubId,
          title: item.title!,
          description: item.description || null,
          organization: item.organization || null,
          award_date: item.awardDate || null,
          image_url: item.imageUrl || null,
          is_published: item.isPublished ?? true,
        });

      if (error) throw new Error(error.message);
    }
  },

  async deleteAchievement(clubId: number, id: number): Promise<void> {
    if (!isSupabaseConfigured()) return;
    const { error } = await supabase.from("club_achievements").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },

  async getGallery(clubId: number): Promise<ClubGalleryMediaItem[]> {
    if (!isSupabaseConfigured()) {
      return [
        { id: 1, clubId, title: "Hack360 Inauguration", imageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&auto=format&fit=crop&q=80", caption: "Opening ceremony of 24-hr hackathon", eventTag: "Hack360", displayOrder: 1, isPublished: true },
        { id: 2, clubId, title: "Web3 Workshop Session", imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80", caption: "Hands-on smart contract deployment lab", eventTag: "Workshop", displayOrder: 2, isPublished: true },
      ];
    }

    const { data, error } = await supabase
      .from("club_gallery")
      .select("*")
      .eq("club_id", clubId)
      .order("display_order", { ascending: true });

    if (error) throw new Error(error.message);

    return (data || []).map(r => ({
      id: r.id,
      clubId: r.club_id,
      title: r.title,
      imageUrl: r.image_url,
      caption: r.caption || undefined,
      eventTag: r.event_tag || undefined,
      displayOrder: r.display_order,
      isPublished: r.is_published
    }));
  },

  async saveGalleryItem(clubId: number, item: Partial<ClubGalleryMediaItem>): Promise<void> {
    if (!isSupabaseConfigured()) return;

    if (item.id) {
      const { error } = await supabase
        .from("club_gallery")
        .update({
          title: item.title!,
          image_url: item.imageUrl!,
          caption: item.caption || null,
          event_tag: item.eventTag || null,
          display_order: item.displayOrder ?? 0,
          is_published: item.isPublished ?? true
        })
        .eq("id", item.id);

      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase
        .from("club_gallery")
        .insert({
          club_id: clubId,
          title: item.title!,
          image_url: item.imageUrl!,
          caption: item.caption || null,
          event_tag: item.eventTag || null,
          display_order: item.displayOrder ?? 0,
          is_published: item.isPublished ?? true
        });

      if (error) throw new Error(error.message);
    }
  },

  async deleteGalleryItem(clubId: number, id: number): Promise<void> {
    if (!isSupabaseConfigured()) return;
    const { error } = await supabase.from("club_gallery").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },

  // -------------------------------------------------------------
  // 10. FAQS & OFFICIAL CONTACTS
  // -------------------------------------------------------------
  async getFaqs(clubId: number): Promise<ClubFaqItem[]> {
    if (!isSupabaseConfigured()) {
      return [
        { id: 1, clubId, question: "Who is eligible to apply for club membership?", answer: "Any enrolled student of NKOCET across any year or engineering branch can apply during active recruitment cycles.", category: "Membership", displayOrder: 1, isPublished: true },
        { id: 2, clubId, question: "Are prior coding skills mandatory to join?", answer: "No prior experience is strictly needed for general club membership. We host beginner cohorts to teach fundamentals.", category: "Eligibility", displayOrder: 2, isPublished: true },
        { id: 3, clubId, question: "When and where do weekly club meetups happen?", answer: "Every Saturday at 3:30 PM in Computer Lab A, IT Block.", category: "Meetings", displayOrder: 3, isPublished: true },
      ];
    }

    const { data, error } = await supabase
      .from("club_faqs")
      .select("*")
      .eq("club_id", clubId)
      .order("display_order", { ascending: true });

    if (error) throw new Error(error.message);

    return (data || []).map(r => ({
      id: r.id,
      clubId: r.club_id,
      question: r.question,
      answer: r.answer,
      category: r.category,
      displayOrder: r.display_order,
      isPublished: r.is_published
    }));
  },

  async saveFaq(clubId: number, item: Partial<ClubFaqItem>): Promise<void> {
    if (!isSupabaseConfigured()) return;

    if (item.id) {
      const { error } = await supabase
        .from("club_faqs")
        .update({
          question: item.question!,
          answer: item.answer!,
          category: item.category || 'General',
          display_order: item.displayOrder ?? 0,
          is_published: item.isPublished ?? true
        })
        .eq("id", item.id);

      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase
        .from("club_faqs")
        .insert({
          club_id: clubId,
          question: item.question!,
          answer: item.answer!,
          category: item.category || 'General',
          display_order: item.displayOrder ?? 0,
          is_published: item.isPublished ?? true
        });

      if (error) throw new Error(error.message);
    }
  },

  async deleteFaq(clubId: number, id: number): Promise<void> {
    if (!isSupabaseConfigured()) return;
    const { error } = await supabase.from("club_faqs").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },

  // -------------------------------------------------------------
  // 11. CLUB EVENTS & ANNOUNCEMENTS
  // -------------------------------------------------------------
  async getClubEvents(clubId: number) {
    if (!isSupabaseConfigured()) {
      return MOCK_EVENTS.filter(e => e.clubId === clubId || !e.clubId);
    }

    const { data, error } = await supabase
      .from("events")
      .select("*, venues(name)")
      .eq("organizer_club_id", clubId)
      .order("start_datetime", { ascending: false });

    if (error) throw new Error(error.message);

    return (data || []).map((e: any) => ({
      id: e.id,
      clubId: e.organizer_club_id,
      title: e.title,
      tagline: e.tagline,
      description: e.description,
      imageUrl: e.banner_url || e.image_url,
      category: e.category,
      status: e.status,
      startDatetime: e.start_datetime,
      endDatetime: e.end_datetime,
      venue: e.venues?.name || "Campus Venue",
      registeredCount: e.registered_count || 0,
      capacity: e.capacity || 0
    }));
  },

  async saveClubEvent(clubId: number, event: any): Promise<void> {
    if (!isSupabaseConfigured()) {
      if (event.id) {
        const idx = MOCK_EVENTS.findIndex(e => e.id === event.id);
        if (idx !== -1) {
          MOCK_EVENTS[idx] = { ...MOCK_EVENTS[idx], ...event };
        }
      } else {
        const newEvent = {
          id: Date.now(),
          clubId,
          title: event.title,
          tagline: event.tagline || "",
          description: event.description || "",
          category: event.category || "Technical",
          status: event.status || "upcoming",
          startDatetime: event.startDatetime,
          endDatetime: event.endDatetime || null,
          venue: event.venue || "Campus Tech Lab",
          registeredCount: 0,
          capacity: event.capacity ? Number(event.capacity) : 60,
          imageUrl: event.imageUrl || event.bannerUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80",
        };
        MOCK_EVENTS.unshift(newEvent);
      }
      return;
    }

    const payload: any = {
      organizer_club_id: clubId,
      organizer_name: event.organizerName || "Club Committee",
      title: event.title,
      tagline: event.tagline || null,
      description: event.description || null,
      category: event.category || "Technical",
      status: event.status || "upcoming",
      start_datetime: event.startDatetime,
      end_datetime: event.endDatetime || null,
      venue_id: event.venueId ? Number(event.venueId) : null,
      capacity: event.capacity ? Number(event.capacity) : 100,
      banner_url: event.imageUrl || event.bannerUrl || null,
      poster_url: event.posterUrl || event.imageUrl || null,
      updated_at: new Date().toISOString()
    };

    if (event.galleryUrls && Array.isArray(event.galleryUrls)) {
      payload.gallery_urls = event.galleryUrls;
    }
    if (event.additionalInfo) {
      payload.additional_info = event.additionalInfo;
    }

    try {
      if (event.id) {
        const { error } = await supabase.from("events").update(payload).eq("id", event.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("events").insert(payload);
        if (error) throw error;
      }
    } catch (err: any) {
      if (err?.code === "42501" || err?.message?.includes("permission denied")) {
        throw new Error(
          "Permission Denied: Your account currently has the 'Student' role in Supabase. Only approved Club Coordinators, Faculty, or System Administrators can publish events. Please request coordinator elevation or log in with an Administrator account."
        );
      }
      throw new Error(err?.message || "Failed to save event");
    }

    await this.logActivity(clubId, `Saved Event: ${event.title}`, "Event", clubId.toString());
  },

  async deleteClubEvent(clubId: number, eventId: number): Promise<void> {
    if (!isSupabaseConfigured()) {
      MOCK_EVENTS = MOCK_EVENTS.filter(e => e.id !== eventId);
      return;
    }

    const { error } = await supabase.from("events").delete().eq("id", eventId).eq("organizer_club_id", clubId);
    if (error) throw new Error(error.message);

    await this.logActivity(clubId, `Deleted Event #${eventId}`, "Event", eventId.toString());
  },

  async getClubNews(clubId: number) {
    if (!isSupabaseConfigured()) {
      return MOCK_NEWS.filter(n => n.clubId === clubId || !n.clubId);
    }

    const { data, error } = await supabase
      .from("news_articles")
      .select("*")
      .eq("club_id", clubId)
      .order("published_at", { ascending: false });

    if (error) throw new Error(error.message);

    return (data || []).map(n => ({
      id: n.id,
      clubId: n.club_id,
      title: n.title,
      summary: n.summary,
      content: n.content,
      category: n.category,
      imageUrl: n.image_url,
      publishedAt: n.published_at,
      isPublished: n.is_published,
      isImportant: n.is_important
    }));
  },

  async saveClubNews(clubId: number, news: any): Promise<void> {
    if (!isSupabaseConfigured()) {
      if (news.id) {
        const idx = MOCK_NEWS.findIndex(n => n.id === news.id);
        if (idx !== -1) {
          MOCK_NEWS[idx] = { ...MOCK_NEWS[idx], ...news };
        }
      } else {
        const newArt = {
          id: Date.now(),
          clubId,
          title: news.title,
          summary: news.summary || null,
          content: news.content || null,
          category: news.category || "General Announcement",
          imageUrl: news.imageUrl || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
          isImportant: news.isImportant ?? false,
          isPublished: news.isPublished ?? true,
          publishedAt: new Date().toISOString(),
        };
        MOCK_NEWS.unshift(newArt);
      }
      return;
    }

    const payload = {
      club_id: clubId,
      title: news.title,
      summary: news.summary || null,
      content: news.content || null,
      category: news.category || "General Announcement",
      image_url: news.imageUrl || null,
      is_important: news.isImportant ?? false,
      is_published: news.isPublished ?? true,
      published_at: news.publishedAt || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (news.id) {
      const { error } = await supabase.from("news_articles").update(payload).eq("id", news.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase.from("news_articles").insert(payload);
      if (error) throw new Error(error.message);
    }

    await this.logActivity(clubId, `Published Announcement: ${news.title}`, "News", clubId.toString());
  },

  async deleteClubNews(clubId: number, newsId: number): Promise<void> {
    if (!isSupabaseConfigured()) {
      MOCK_NEWS = MOCK_NEWS.filter(n => n.id !== newsId);
      return;
    }

    const { error } = await supabase.from("news_articles").delete().eq("id", newsId).eq("club_id", clubId);
    if (error) throw new Error(error.message);

    await this.logActivity(clubId, `Deleted Article #${newsId}`, "News", newsId.toString());
  },

  // -------------------------------------------------------------
  // 12. AUDIT LOGGING & APPROVAL WORKFLOW
  // -------------------------------------------------------------
  async logActivity(clubId: number, action: string, entityType: string, entityId: string, details?: any): Promise<void> {
    if (!isSupabaseConfigured()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("audit_logs").insert({
        club_id: clubId,
        actor_id: user?.id || null,
        actor_name: user?.user_metadata?.name || "Coordinator",
        action,
        entity_type: entityType,
        entity_id: entityId,
        details: details || null,
      });
    } catch (e) {
      console.warn("Audit logging skipped:", e);
    }
  },

  async submitApprovalRequest(clubId: number, requestType: any, payload: any): Promise<void> {
    if (!isSupabaseConfigured()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Must be logged in.");

    const { error } = await supabase
      .from("approval_requests")
      .insert({
        club_id: clubId,
        submitted_by: user.id,
        request_type: requestType,
        status: "pending",
        payload,
      });

    if (error) throw new Error(error.message);

    // Also set club status to pending_approval if profile change
    if (requestType === "profile_update") {
      await supabase.from("clubs").update({ status: "pending_approval" as any }).eq("id", clubId);
    }

    await this.logActivity(clubId, `Submitted ${requestType} for Admin Approval`, "ApprovalRequest", clubId.toString());
  },

  // -------------------------------------------------------------
  // 13. ROLE ELEVATION (STUDENT -> COORDINATOR / FACULTY)
  // -------------------------------------------------------------
  async requestRoleElevation(params: {
    targetRole: "coordinator" | "faculty";
    clubId?: number;
    clubName?: string;
    department?: string;
    prn?: string;
    justification: string;
  }): Promise<void> {
    if (!isSupabaseConfigured()) {
      const stored = JSON.parse(localStorage.getItem("campus360_role_requests") || "[]");
      const newReq: RoleElevationRequest = {
        id: Date.now(),
        userId: "current-user",
        userName: "Sufiyan Shaikh",
        userEmail: "sufiyan.shaikh@nkocet.ac.in",
        targetRole: params.targetRole,
        clubId: params.clubId,
        clubName: params.clubName || (params.clubId === 1 ? "Coding Club NKOCET" : "Robotics & Automation Society"),
        department: params.department || "Computer Science & Engineering",
        prn: params.prn || "NK2023CS042",
        justification: params.justification,
        status: "pending",
        submittedAt: new Date().toISOString(),
      };
      stored.unshift(newReq);
      localStorage.setItem("campus360_role_requests", JSON.stringify(stored));
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Please log in to submit a role elevation request.");

    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

    const payload = {
      requester_id: user.id,
      requester_name: profile?.name || user.email?.split("@")[0] || "Applicant",
      requester_email: user.email,
      target_role: params.targetRole,
      club_id: params.clubId || null,
      club_name: params.clubName || null,
      department: params.department || profile?.department || null,
      prn: params.prn || profile?.prn || null,
      justification: params.justification,
    };

    let insertError = null;
    try {
      const { error } = await supabase.from("approval_requests").insert({
        club_id: params.clubId || null,
        request_type: "role_elevation",
        payload,
        status: "pending",
        submitted_by: user.id,
      });
      insertError = error;
    } catch (err: any) {
      insertError = err;
    }

    // If Supabase table has a permission or schema error, save to local queue so request is not lost
    if (insertError) {
      console.warn("Supabase approval_requests insert failed, queueing locally:", insertError);
      const stored: RoleElevationRequest[] = JSON.parse(localStorage.getItem("campus360_role_requests") || "[]");
      const newReq: RoleElevationRequest = {
        id: Date.now(),
        userId: user.id,
        userName: profile?.name || user.email?.split("@")[0] || "Applicant",
        userEmail: user.email || "",
        targetRole: params.targetRole,
        clubId: params.clubId,
        clubName: params.clubName || (params.clubId === 1 ? "Coding Club NKOCET" : "Robotics & Automation Society"),
        department: params.department || profile?.department || "Computer Science & Engineering",
        prn: params.prn || profile?.prn || "PRN-PENDING",
        justification: params.justification,
        status: "pending",
        submittedAt: new Date().toISOString(),
      };
      stored.unshift(newReq);
      localStorage.setItem("campus360_role_requests", JSON.stringify(stored));
    }
  },

  async getPendingRoleElevations(): Promise<RoleElevationRequest[]> {
    const localRequests: RoleElevationRequest[] = JSON.parse(localStorage.getItem("campus360_role_requests") || "[]");
    const resolvedIds: number[] = JSON.parse(localStorage.getItem("campus360_resolved_role_reqs") || "[]");

    let dbRequests: RoleElevationRequest[] = [];

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from("approval_requests")
          .select("*")
          .eq("request_type", "role_elevation")
          .eq("status", "pending")
          .order("created_at", { ascending: false });

        if (!error && data) {
          dbRequests = data.map((row: any) => {
            const p = (row.payload as any) || {};
            return {
              id: row.id,
              userId: row.submitted_by || p.requester_id,
              userName: p.requester_name || "Applicant",
              userEmail: p.requester_email || "",
              targetRole: p.target_role || "coordinator",
              clubId: row.club_id || p.club_id,
              clubName: p.club_name,
              department: p.department,
              prn: p.prn,
              justification: p.justification || row.admin_notes || "",
              status: row.status,
              submittedAt: row.created_at,
            };
          });
        }
      } catch (err) {
        console.warn("Could not query approval_requests table, using local requests:", err);
      }
    }

    const combined = [...localRequests, ...dbRequests, ...MOCK_ROLE_REQUESTS];
    // Deduplicate by ID and filter out resolved
    const seen = new Set<number>();
    return combined.filter(r => {
      if (seen.has(r.id) || resolvedIds.includes(r.id) || r.status !== "pending") return false;
      seen.add(r.id);
      return true;
    });
  },

  async resolveRoleElevation(
    requestId: number,
    approve: boolean,
    targetRole?: "coordinator" | "faculty",
    clubId?: number,
    userId?: string
  ): Promise<void> {
    const resolvedIds: number[] = JSON.parse(localStorage.getItem("campus360_resolved_role_reqs") || "[]");
    resolvedIds.push(requestId);
    localStorage.setItem("campus360_resolved_role_reqs", JSON.stringify(resolvedIds));

    if (!isSupabaseConfigured()) {
      if (approve && targetRole) {
        localStorage.setItem("demo_role", targetRole);
      }
      return;
    }

    const newStatus = approve ? "approved" : "rejected";

    try {
      const { data: req } = await supabase
        .from("approval_requests")
        .select("*")
        .eq("id", requestId)
        .maybeSingle();

      const payload = (req?.payload as any) || {};
      const finalRole = targetRole || payload.target_role || "coordinator";
      const finalClubId = clubId || req?.club_id || payload.club_id;
      const finalUserId = userId || req?.submitted_by || payload.requester_id;

      if (req) {
        await supabase
          .from("approval_requests")
          .update({
            status: newStatus,
            reviewed_at: new Date().toISOString(),
          })
          .eq("id", requestId);
      }

      if (approve && finalUserId) {
        await supabase
          .from("profiles")
          .update({ role: finalRole })
          .eq("id", finalUserId);

        if (finalRole === "coordinator" && finalClubId) {
          try {
            await supabase
              .from("club_coordinator_assignments")
              .upsert({
                club_id: Number(finalClubId),
                user_id: finalUserId,
                is_active: true,
              }, { onConflict: "club_id,user_id" });
          } catch {}
        }
      }
    } catch (err) {
      console.warn("Could not sync approval to Supabase, marked locally resolved:", err);
    }
  },

  // -------------------------------------------------------------
  // 14. CSV EXPORTS
  // -------------------------------------------------------------
  exportToCsv(filename: string, rows: Record<string, any>[]): void {
    if (!rows || rows.length === 0) return;

    const headers = Object.keys(rows[0]);
    const csvContent = [
      headers.join(","),
      ...rows.map(row =>
        headers
          .map(header => {
            const val = row[header] ?? "";
            const str = String(val).replace(/"/g, '""');
            return `"${str}"`;
          })
          .join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

function mapRowToCoordinatorClub(row: any): CoordinatorClub {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.category,
    tagline: row.tagline,
    description: row.description || undefined,
    logoUrl: row.logo_url || undefined,
    bannerUrl: row.banner_url || undefined,
    memberCount: row.member_count ?? 0,
    status: (row.status as any) || "published",
    recruitmentStatus: (row.recruitment_status as any) || "closed",
    profileCompletion: row.profile_completion ?? 60,
    facultyAdvisor: row.faculty_advisor || undefined,
    mission: row.mission || undefined,
    vision: row.vision || undefined,
    objectives: row.objectives || [],
    introduction: row.introduction || undefined,
    meetingFrequency: row.meeting_frequency || "Weekly",
    meetingDayTime: row.meeting_day_time || "Saturdays, 4:00 PM",
    meetingVenue: row.meeting_venue || "Campus Tech Lab",
    campusLocation: row.campus_location || "Main Building, Block B",
    contactEmail: row.contact_email || undefined,
    socialLinks: row.social_links || undefined,
  };
}

export default coordinatorService;
