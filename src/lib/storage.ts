import { createClient } from "@/lib/supabase/server";

export async function uploadImage(file: File, path: string): Promise<string> {
  const supabase = await createClient();

  const { data, error } = await supabase.storage
    .from("product-images")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("product-images").getPublicUrl(data.path);

  return publicUrl;
}

export async function deleteImage(path: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.storage
    .from("product-images")
    .remove([path]);

  if (error) {
    throw new Error(`Failed to delete image: ${error.message}`);
  }
}



