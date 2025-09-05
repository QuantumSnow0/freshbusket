import { createAdminClient } from "@/lib/supabase/admin";

export async function checkStorageSetup() {
  try {
    const supabase = createAdminClient();

    // Check if buckets exist
    const { data: buckets, error: bucketError } =
      await supabase.storage.listBuckets();

    if (bucketError) {
      return {
        success: false,
        error: `Failed to list buckets: ${bucketError.message}`,
        buckets: null,
      };
    }

    const productImagesBucket = buckets?.find(
      (bucket) => bucket.id === "product-images"
    );

    if (!productImagesBucket) {
      return {
        success: false,
        error:
          "Product images bucket not found. Please run the storage setup SQL.",
        buckets: buckets?.map((b) => b.id) || [],
      };
    }

    // Check if we can access the bucket
    const { data: files, error: listError } = await supabase.storage
      .from("product-images")
      .list("", { limit: 1 });

    if (listError) {
      return {
        success: false,
        error: `Cannot access bucket: ${listError.message}`,
        buckets: buckets?.map((b) => b.id) || [],
      };
    }

    return {
      success: true,
      error: null,
      buckets: buckets?.map((b) => b.id) || [],
      bucketInfo: productImagesBucket,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      buckets: null,
    };
  }
}
