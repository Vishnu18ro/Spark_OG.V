import { supabase } from "@/integrations/supabase/client";

const BUCKET_NAME = "images";

/**
 * Upload an image file to Supabase Storage and return the public URL.
 * Falls back to base64 if upload fails (backward compatible).
 * 
 * @param file - The File object to upload
 * @param path - Storage path prefix (e.g., "profile", "projects", "certificates")
 * @returns The public URL of the uploaded image, or base64 fallback
 */
export async function uploadImage(
  file: File,
  path: string
): Promise<string> {
  try {
    // Generate a unique filename: path/timestamp-originalname
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = `${path}/${timestamp}-${safeName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.warn("Storage upload failed, falling back to base64:", error.message);
      return fileToBase64(file);
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (err) {
    console.warn("Storage upload error, falling back to base64:", err);
    return fileToBase64(file);
  }
}

/**
 * Fallback: convert file to base64 data URL (old behavior).
 * Used when Supabase Storage is unavailable.
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Check if a string is a base64 data URL (old format)
 * vs a Supabase Storage URL (new format).
 */
export function isBase64Image(src: string): boolean {
  return src.startsWith("data:image/");
}
