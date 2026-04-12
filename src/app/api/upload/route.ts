import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const MAX_FILE_SIZE = parseInt(
  process.env.UPLOAD_MAX_FILE_SIZE || String(10 * 1024 * 1024),
  10
);

const ALLOWED_TYPES = (process.env.UPLOAD_ALLOWED_TYPES || "")
  .split(",")
  .map((t) => t.trim())
  .filter(Boolean);

const DEFAULT_BUCKET = process.env.UPLOAD_BUCKET || "uploads";

function isTypeAllowed(mimeType: string): boolean {
  if (ALLOWED_TYPES.length === 0) return true;
  return ALLOWED_TYPES.some((pattern) => {
    if (pattern.endsWith("/*")) {
      return mimeType.startsWith(pattern.replace("/*", "/"));
    }
    return mimeType === pattern;
  });
}

export async function POST(request: NextRequest) {
  try {
    // --- Auth check ---
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: "Supabase not configured" },
        { status: 500 }
      );
    }

    // Forward the user's auth cookie/token to verify identity
    const authHeader = request.headers.get("authorization");
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: authHeader ? { Authorization: authHeader } : {},
      },
    });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // --- Parse multipart form data ---
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const bucket = (formData.get("bucket") as string) || DEFAULT_BUCKET;
    const pathPrefix = (formData.get("path") as string) || user.id;

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No file provided. Send a 'file' field in multipart form data." },
        { status: 400 }
      );
    }

    // --- Validate size ---
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File too large. Maximum size is ${Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB.`,
          maxSize: MAX_FILE_SIZE,
          fileSize: file.size,
        },
        { status: 413 }
      );
    }

    // --- Validate type ---
    if (!isTypeAllowed(file.type)) {
      return NextResponse.json(
        {
          error: `File type "${file.type}" is not allowed.`,
          allowedTypes: ALLOWED_TYPES,
        },
        { status: 415 }
      );
    }

    // --- Upload to Supabase Storage ---
    // Use service role key for storage operations if available, fall back to anon
    const storageKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;
    const storageClient = createClient(supabaseUrl, storageKey);

    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storagePath = `${pathPrefix}/${timestamp}-${safeName}`;

    const { data: uploadData, error: uploadError } =
      await storageClient.storage.from(bucket).upload(storagePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // --- Build response URL ---
    const { data: urlData } = storageClient.storage
      .from(bucket)
      .getPublicUrl(uploadData.path);

    return NextResponse.json({
      url: urlData.publicUrl,
      path: uploadData.path,
      size: file.size,
      type: file.type,
      name: file.name,
    });
  } catch (err) {
    console.error("Upload route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
