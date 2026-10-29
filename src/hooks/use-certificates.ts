/**
 * Certificates React Query Hooks
 */

import { useQuery } from "@tanstack/react-query";
import { certificatesService } from "@/api/services/certificates.service";
import { Certificate } from "@/types/certificates";

export const certificateQueryKeys = {
  all: ["/api/certificates"] as const,
  list: (params?: any) => ["/api/certificates", params] as const,
  verify: (code: string) => ["/api/certificates/verify", code] as const,
};

export function useCertificates(params?: any) {
  return useQuery<Certificate[]>({
    queryKey: certificateQueryKeys.list(params),
    queryFn: () => certificatesService.listCertificates(params),
  });
}

export function useVerifyCertificate(code: string) {
  return useQuery({
    queryKey: certificateQueryKeys.verify(code),
    queryFn: () => certificatesService.verifyCertificate(code),
    enabled: !!code,
  });
}
