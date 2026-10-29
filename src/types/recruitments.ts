/**
 * Recruitments Domain Models
 */

export interface Recruitment {
  id: number | string;
  clubId?: number;
  clubName: string;
  role: string;
  department?: string;
  description: string;
  requirements: string[];
  deadline: string;
  positionsCount?: number;
  isOpen: boolean;
  status?: "open" | "closing_soon" | "closed";
  formFields?: Array<{
    name: string;
    label: string;
    type: "text" | "textarea" | "select";
    required?: boolean;
    options?: string[];
  }>;
}

export interface RecruitmentApplicationPayload {
  recruitmentId: number | string;
  applicantName: string;
  applicantEmail: string;
  department: string;
  year: string;
  statementOfPurpose?: string;
  portfolioUrl?: string;
  answers?: Record<string, any>;
}
