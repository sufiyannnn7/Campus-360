/**
 * Certificates Domain Models & Management Specifications
 * Campus 360 - NKOCET, Team NEXUS
 */

export interface CertificateSignatory {
  name: string;
  designation: string;
  department?: string;
  signatureUrl?: string;
}

export interface EventCertificateSettings {
  enabled: boolean;
  title: string;
  bodyText: string;
  leftSignatory: CertificateSignatory;
  rightSignatory: CertificateSignatory;
}

export interface Certificate {
  id: number | string;
  title: string;
  eventName: string;
  eventId?: number;
  issueDate: string;
  issuedAt?: string;
  recipientName: string;
  recipientEmail?: string;
  userId?: string;
  verificationCode: string;
  issuer: string;
  category?: string;
  description?: string;
  status?: "valid" | "revoked" | "pending";
  downloadUrl?: string;
  clubId?: number;
  clubName?: string;
  clubLogoUrl?: string;
  bodyText?: string;
  signatories?: CertificateSignatory[];
  teamName?: string;
  revocationReason?: string;
  revokedAt?: string;
}

export interface CertificateVerification {
  isValid: boolean;
  certificate?: Certificate;
  message?: string;
}

export interface EventParticipantItem {
  registrationId: number;
  userId: string;
  name: string;
  email: string;
  department?: string;
  year?: string;
  prn?: string;
  rollNumber?: string;
  status: "registered" | "confirmed" | "attended" | "cancelled";
  teamName?: string;
  registrationType: "individual" | "team";
  isIssued: boolean;
  issuedCertificateCode?: string;
  registeredAt?: string;
}

export interface IssueCertificatesPayload {
  eventId: number;
  eventName: string;
  clubId?: number;
  clubName?: string;
  clubLogoUrl?: string;
  eventDate?: string;
  settings: EventCertificateSettings;
  participants: Array<{
    userId: string;
    recipientName: string;
    recipientEmail?: string;
    teamName?: string;
    department?: string;
    prn?: string;
  }>;
}
