import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, isAuthConfigured } from "@/lib/auth/session";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;
const IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/jpg", "image/heic", "image/heif"]);
const VIDEO_TYPES = new Set(["video/mp4", "video/quicktime"]);

export async function POST(req: NextRequest) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Photo/video uploads are not configured yet." },
      { status: 503 },
    );
  }

  if (isAuthConfigured) {
    const user = await getSessionUser();
    if (!user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const isImage = IMAGE_TYPES.has(file.type);
  const isVideo = VIDEO_TYPES.has(file.type);
  if (!isImage && !isVideo) {
    return NextResponse.json(
      { error: "Only PNG, JPEG, or HEIC photos and MP4 or MOV videos are supported." },
      { status: 400 },
    );
  }

  const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (file.size > maxBytes) {
    return NextResponse.json(
      { error: `${isVideo ? "Videos" : "Photos"} must be under ${maxBytes / (1024 * 1024)}MB.` },
      { status: 400 },
    );
  }

  const { put } = await import("@vercel/blob");
  const path = `products/${Date.now()}-${crypto.randomUUID()}-${file.name}`;

  try {
    const blob = await put(path, file, { access: "public" });
    return NextResponse.json({ url: blob.url, type: isVideo ? "video" : "image" });
  } catch (err) {
    console.error("Vercel Blob upload failed:", err);
    return NextResponse.json(
      { error: "Upload failed. Check the server logs for details." },
      { status: 500 },
    );
  }
}
