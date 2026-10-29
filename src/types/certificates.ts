/**
 * Certificates Domain Models
 */

export interface Certificate {
  id: number | string;
  title: string;
  eventName: string;
  issueDate: string;
  recipientName: string;
  verificationCode: string;
  issuer: string;
  category?: string;
  description?: string;
  status?: "valid" | "revoked" | "pending";
  downloadUrl?: string;
}

export interface CertificateVerification {
  isValid: boolean;
  certificate?: Certificate;
  message?: string;
}
