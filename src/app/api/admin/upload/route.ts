import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin";

export async function POST(request: NextRequest) {
  try {
    console.log("🔍 Upload API: Starting upload process");

    await requireAdmin();
    console.log("✅ Upload API: Admin authentication passed");

    const supabase = createAdminClient();
    console.log("✅ Upload API: Supabase admin client created");

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const path = formData.get("path") as string;

    console.log("📁 Upload API: File info:", {
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      path: path,
    });

    if (!file) {
      console.error("❌ Upload API: No file provided");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!path) {
      console.error("❌ Upload API: No path provided");
      return NextResponse.json({ error: "No path provided" }, { status: 400 });
    }

    // Check if the bucket exists
    console.log("🔍 Upload API: Checking storage buckets");
    const { data: buckets, error: bucketError } =
      await supabase.storage.listBuckets();

    if (bucketError) {
      console.error("❌ Upload API: Error listing buckets:", bucketError);
      return NextResponse.json(
        { error: `Storage error: ${bucketError.message}` },
        { status: 500 }
      );
    }

    console.log(
      "📦 Upload API: Available buckets:",
      buckets?.map((b) => b.id)
    );

    const productImagesBucket = buckets?.find(
      (bucket) => bucket.id === "product-images"
    );
    if (!productImagesBucket) {
      console.error("❌ Upload API: Product images bucket not found");
      return NextResponse.json(
        {
          error:
            "Product images bucket not found. Please run the storage setup SQL.",
        },
        { status: 500 }
      );
    }

    console.log("✅ Upload API: Product images bucket found");

    // Upload the file
    console.log("📤 Upload API: Starting file upload to Supabase Storage");
    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("❌ Upload API: Upload error:", error);
      return NextResponse.json(
        {
          error: `Failed to upload image: ${error.message}`,
          details: error,
        },
        { status: 500 }
      );
    }

    console.log("✅ Upload API: File uploaded successfully:", data);

    const {
      data: { publicUrl },
    } = supabase.storage.from("product-images").getPublicUrl(data.path);

    console.log("🔗 Upload API: Public URL generated:", publicUrl);

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      {
        error: "Upload failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
