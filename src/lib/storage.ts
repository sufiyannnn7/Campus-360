/**
 * Storage and Image Compression Utilities
 * Campus 360 - NKOCET
 *
 * Provides client-side compression (via native canvas in image-compressor)
 * and deterministic Supabase Storage uploads with upsert (replace) to avoid storage bloat.
 */

import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { compressImage as baseCompressImage } from "@/lib/image-compressor";

export interface CompressResult {
  file: File;
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  reductionPercent: number;
}

/**
 * Format bytes into human-readable string (KB, MB).
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export interface UploadClubImageParams {
  file: File;
  clubId?: number | string;
  assetType: "banner" | "logo";
  tempId?: string;
  compress?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export interface UploadResult {
  url: string;
  path: string;
  stats?: {
    originalSize: number;
    compressedSize: number;
    reductionPercent: number;
  };
}

/**
 * Uploads a club asset (banner or logo) to Supabase Storage with deterministic path
 * and upsert: true so existing images are replaced rather than creating new files.
 */
export async function uploadClubImage(
  params: UploadClubImageParams
): Promise<UploadResult> {
  const {
    file,
    clubId,
    assetType,
    tempId,
    compress = true,
    maxWidth = assetType === "logo" ? 512 : 1600,
    maxHeight = assetType === "logo" ? 512 : 900,
    quality = 0.82,
  } = params;

  let fileToUpload: File = file;
  let fallbackDataUrl: string | null = null;
  let stats: UploadResult["stats"] | undefined;

  // Step 1: Compress image using existing codebase image-compressor
  if (compress && !file.type.includes("svg") && !file.type.includes("gif")) {
    try {
      const comp = await baseCompressImage(file, {
        maxWidth,
        maxHeight,
        quality,
        mimeType: "image/webp",
      });

      const ext = "webp";
      const newName = file.name.replace(/\.[^/.]+$/, "") + `.${ext}`;
      fileToUpload = new File([comp.blob], newName, {
        type: "image/webp",
        lastModified: Date.now(),
      });

      fallbackDataUrl = comp.dataUrl;

      const reduction = Math.max(
        0,
        Math.round(((comp.originalSize - comp.compressedSize) / comp.originalSize) * 100)
      );

      stats = {
        originalSize: comp.originalSize,
        compressedSize: comp.compressedSize,
        reductionPercent: reduction,
      };
    } catch (err) {
      console.warn("Image compression warning, proceeding with original:", err);
    }
  }

  // Step 2: Deterministic path per club asset
  // Ensures any new upload for this club replaces the previous file
  const identifier = clubId ? `club_${clubId}` : `temp_${tempId || "draft"}`;
  const filePath = `clubs/${identifier}_${assetType}.webp`;
  const bucketName = "club-assets";

  // Step 3: Offline / unconfigured Supabase fallback
  if (!isSupabaseConfigured()) {
    const dataUrl = fallbackDataUrl || (await fileToDataUrl(fileToUpload));
    return {
      url: dataUrl,
      path: filePath,
      stats,
    };
  }

  try {
    // Upsert replaces existing file at filePath rather than duplicating
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, fileToUpload, {
        upsert: true,
        contentType: fileToUpload.type,
        cacheControl: "3600",
      });

    if (uploadError) {
      console.warn("Supabase Storage upload warning, falling back to base64:", uploadError.message);
      const dataUrl = fallbackDataUrl || (await fileToDataUrl(fileToUpload));
      return {
        url: dataUrl,
        path: filePath,
        stats,
      };
    }

    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    // Cache-busting query parameter so browser reloads replaced image immediately
    const publicUrlWithTimestamp = `${urlData.publicUrl}?t=${Date.now()}`;

    return {
      url: publicUrlWithTimestamp,
      path: filePath,
      stats,
    };
  } catch (err: any) {
    console.warn("Storage operation failed, using base64 fallback:", err?.message);
    const dataUrl = fallbackDataUrl || (await fileToDataUrl(fileToUpload));
    return {
      url: dataUrl,
      path: filePath,
      stats,
    };
  }
}

/**
 * Convert a File or Blob into a base64 Data URL.
 */
function fileToDataUrl(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file as Data URL"));
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}
