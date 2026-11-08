/**
 * Campus 360 Institutional Certificate Template
 * Official Collegiate Format for NKOCET Campus Events & Societies
 * 
 * Features:
 * - Landscape A4 aspect ratio (1.414 : 1)
 * - Dual institutional border with guilloche corner accents
 * - Automatic Campus 360 horizontal brand and Club logo
 * - Live QR verification link
 * - Two official signatories (Left & Right) with image/line support
 * - Print-ready layout
 */

import React from "react";
import { ShieldCheck, Award } from "lucide-react";

export interface CertificateTemplateProps {
  title?: string;
  recipientName?: string;
  eventName?: string;
  eventDate?: string;
  clubName?: string;
  clubLogoUrl?: string;
  bodyText?: string;
  verificationCode?: string;
  issueDate?: string;
  leftSignatory?: {
    name: string;
    designation: string;
    department?: string;
    signatureUrl?: string;
  };
  rightSignatory?: {
    name: string;
    designation: string;
    department?: string;
    signatureUrl?: string;
  };
  isPreview?: boolean;
  className?: string;
}

export function CertificateTemplate({
  title = "Certificate of Participation",
  recipientName = "Participant Name",
  eventName = "Campus Technical Symposium 2026",
  eventDate = "November 2026",
  clubName = "Coding Club NKOCET",
  clubLogoUrl,
  bodyText,
  verificationCode = "C360-CERT-2026-PREVIEW",
  issueDate = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
  leftSignatory = {
    name: "Dr. S. R. Kulkarni",
    designation: "Faculty Advisor",
    department: "Computer Science & Engineering",
  },
  rightSignatory = {
    name: "Club Coordinator",
    designation: "Student Lead",
    department: "Technical Society NKOCET",
  },
  isPreview = false,
  className = "",
}: CertificateTemplateProps) {
  // Public verification URL
  const origin = typeof window !== "undefined" ? window.location.origin : "https://campus360.local";
  const verifyUrl = `${origin}/certificates/verify/${verificationCode}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verifyUrl)}&format=svg`;

  const defaultBody = `for active and successful participation in ${eventName} held on ${eventDate}, organized by ${clubName} at N. K. Orchid College of Engineering & Technology, Solapur.`;
  const finalBody = bodyText && bodyText.trim() ? bodyText.trim() : defaultBody;

  return (
    <div
      id={`cert-${verificationCode}`}
      className={`printable-certificate relative w-full bg-[#fdfcf9] text-slate-900 overflow-hidden shadow-2xl select-none font-sans aspect-[1.414/1] flex flex-col justify-between p-6 sm:p-10 md:p-12 border-[8px] border-[#c5a059] ${className}`}
      style={{
        boxShadow: "0 20px 40px -15px rgba(0,0,0,0.15), 0 0 0 1px rgba(197,160,89,0.4)",
      }}
    >
      {/* Subtle Guilloche / Security Pattern Watermark */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] bg-repeat"
        style={{
          backgroundImage: `radial-gradient(#1e293b 1px, transparent 1px), radial-gradient(#c5a059 1px, #fdfcf9 1px)`,
          backgroundSize: "24px 24px",
          backgroundPosition: "0 0, 12px 12px",
        }}
      />

      {/* Inner Elegant Border with Corner Accents */}
      <div className="absolute inset-3 sm:inset-4 md:inset-5 border border-[#c5a059]/60 pointer-events-none">
        <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-[#c5a059] rotate-45" />
        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-[#c5a059] rotate-45" />
        <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-[#c5a059] rotate-45" />
        <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-[#c5a059] rotate-45" />
      </div>

      {/* Top Header: Institutional Branding & Club Crest */}
      <div className="relative z-10 flex items-center justify-between border-b border-[#c5a059]/30 pb-3 sm:pb-4 gap-4">
        {/* Left: Campus 360 Logo & Institutional Name */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-[#c5a059]/15 border border-[#c5a059]/40 p-1 flex items-center justify-center shrink-0 shadow-2xs">
            <img src="/logo.png" alt="Campus 360 Logo" className="h-full w-full object-contain" />
          </div>
          <div className="text-left">
            <div className="text-[10px] sm:text-xs font-black tracking-widest text-[#8c6d2e] uppercase">
              N. K. Orchid College of Engineering & Technology
            </div>
            <div className="text-xs sm:text-sm font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5">
              <span>Campus 360</span>
              <span className="text-[9px] font-semibold text-slate-400 border-l border-slate-300 pl-1.5">Official Credentials</span>
            </div>
          </div>
        </div>

        {/* Center: Institutional Accreditation Badge */}
        <div className="hidden lg:flex flex-col items-center justify-center text-center px-2">
          <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
            NAAC Accredited 'A' Grade • Solapur, Maharashtra
          </div>
          <div className="text-[8px] font-medium text-slate-400">
            Internal Quality Assurance Cell (IQAC) Endorsed
          </div>
        </div>

        {/* Right: Organizing Club Logo & Identity */}
        <div className="flex items-center gap-2.5 text-right">
          <div className="hidden sm:block text-right">
            <div className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Organized By
            </div>
            <div className="text-xs sm:text-sm font-extrabold text-[#1e293b] truncate max-w-[160px] sm:max-w-[200px]">
              {clubName}
            </div>
          </div>
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
            {clubLogoUrl ? (
              <img src={clubLogoUrl} alt={clubName} className="h-full w-full object-cover" />
            ) : (
              <div className="font-black text-xs text-[#c5a059] flex items-center justify-center h-full w-full bg-[#c5a059]/10">
                {(clubName || "CC").substring(0, 2).toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Center Body: Certificate Title, Recipient Name & Narrative */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center my-3 sm:my-5 px-4 sm:px-8 space-y-2.5 sm:space-y-3.5">
        {/* Certificate Title */}
        <div className="space-y-1">
          <div className="text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#8c6d2e]">
            Official Credential of Achievement
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-black tracking-wide text-slate-900 uppercase">
            {title}
          </h1>
          <div className="w-24 sm:w-32 h-0.5 bg-gradient-to-r from-transparent via-[#c5a059] to-transparent mx-auto" />
        </div>

        {/* Presentation Phrase */}
        <p className="text-[10px] sm:text-xs font-serif italic text-slate-500">
          This is proudly presented and certified to
        </p>

        {/* Recipient Full Name */}
        <div className="space-y-1">
          <div className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-primary tracking-tight px-4 border-b border-dashed border-[#c5a059]/50 pb-1">
            {recipientName}
          </div>
        </div>

        {/* Certificate Custom Narrative Body */}
        <p className="text-[10px] sm:text-xs md:text-sm text-slate-700 max-w-2xl leading-relaxed mx-auto font-medium">
          {finalBody}
        </p>
      </div>

      {/* Bottom Footer: Left Signatory, Official Seal, Right Signatory & QR Verification */}
      <div className="relative z-10 pt-3 sm:pt-4 border-t border-[#c5a059]/30 grid grid-cols-3 items-end gap-2 sm:gap-4 text-center">
        {/* Left Signatory */}
        <div className="flex flex-col items-center justify-end text-center">
          <div className="h-10 sm:h-12 w-28 sm:w-36 flex items-end justify-center mb-1">
            {leftSignatory?.signatureUrl ? (
              <img
                src={leftSignatory.signatureUrl}
                alt={leftSignatory.name}
                className="max-h-full max-w-full object-contain filter contrast-125"
              />
            ) : (
              <div className="w-full border-b border-slate-400 mb-2 opacity-60" />
            )}
          </div>
          <div className="text-[10px] sm:text-xs font-bold text-slate-900 truncate max-w-[150px]">
            {leftSignatory?.name || "Dr. S. R. Kulkarni"}
          </div>
          <div className="text-[8px] sm:text-[10px] font-medium text-slate-500 truncate max-w-[150px]">
            {leftSignatory?.designation || "Faculty Advisor"}
          </div>
          {leftSignatory?.department && (
            <div className="text-[7px] sm:text-[9px] text-slate-400 truncate max-w-[150px]">
              {leftSignatory.department}
            </div>
          )}
        </div>

        {/* Center: Official Seal & Verification ID */}
        <div className="flex flex-col items-center justify-end">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 border-[#c5a059] bg-[#fbf8f0] flex items-center justify-center text-[#8c6d2e] shadow-xs mb-1">
            <Award className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="text-[8px] sm:text-[9px] font-mono font-bold text-slate-700 uppercase tracking-wider">
            {verificationCode}
          </div>
          <div className="text-[7px] sm:text-[8px] text-slate-400">
            Issued: {issueDate}
          </div>
        </div>

        {/* Right Signatory & QR Code */}
        <div className="flex items-end justify-between sm:justify-end gap-2 sm:gap-4">
          <div className="flex flex-col items-center justify-end text-center">
            <div className="h-10 sm:h-12 w-28 sm:w-36 flex items-end justify-center mb-1">
              {rightSignatory?.signatureUrl ? (
                <img
                  src={rightSignatory.signatureUrl}
                  alt={rightSignatory.name}
                  className="max-h-full max-w-full object-contain filter contrast-125"
                />
              ) : (
                <div className="w-full border-b border-slate-400 mb-2 opacity-60" />
              )}
            </div>
            <div className="text-[10px] sm:text-xs font-bold text-slate-900 truncate max-w-[150px]">
              {rightSignatory?.name || "Club Coordinator"}
            </div>
            <div className="text-[8px] sm:text-[10px] font-medium text-slate-500 truncate max-w-[150px]">
              {rightSignatory?.designation || "Lead Coordinator"}
            </div>
            {rightSignatory?.department && (
              <div className="text-[7px] sm:text-[9px] text-slate-400 truncate max-w-[150px]">
                {rightSignatory.department}
              </div>
            )}
          </div>

          {/* QR Code Verification Link */}
          <div className="hidden sm:flex flex-col items-center shrink-0">
            <div className="h-10 w-10 sm:h-12 sm:w-12 p-0.5 bg-white border border-[#c5a059]/50 rounded-md shadow-2xs">
              <img src={qrCodeUrl} alt="QR Code" className="h-full w-full object-contain" />
            </div>
            <span className="text-[6px] sm:text-[7px] text-slate-400 tracking-tighter mt-0.5">
              Scan to verify
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CertificateTemplate;

