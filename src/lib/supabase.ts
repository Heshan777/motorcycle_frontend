import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const supabase = isSupabaseConfigured ? createClient(supabaseUrl!, supabaseAnonKey!) : null;
export const supabaseStorageBucket =
  import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'motorcycle-images';

const SUPABASE_PUBLIC_OBJECT_PATH = '/storage/v1/object/public/';

export function resolveMotorcycleImageUrl(imageUrl: string): string {
  if (!imageUrl) {
    return imageUrl;
  }

  try {
    const parsedUrl = new URL(imageUrl);
    const path = parsedUrl.pathname;
    const prefixIndex = path.indexOf(SUPABASE_PUBLIC_OBJECT_PATH);

    if (prefixIndex === -1) {
      return imageUrl;
    }

    const bucketAndFilePath = path.slice(prefixIndex + SUPABASE_PUBLIC_OBJECT_PATH.length);
    const firstSlashIndex = bucketAndFilePath.indexOf('/');

    if (firstSlashIndex === -1) {
      return imageUrl;
    }

    const currentBucket = bucketAndFilePath.slice(0, firstSlashIndex);
    if (!currentBucket || currentBucket === supabaseStorageBucket) {
      return imageUrl;
    }

    const filePath = bucketAndFilePath.slice(firstSlashIndex + 1);
    parsedUrl.pathname = `${SUPABASE_PUBLIC_OBJECT_PATH}${supabaseStorageBucket}/${filePath}`;
    return parsedUrl.toString();
  } catch {
    return imageUrl;
  }
}
