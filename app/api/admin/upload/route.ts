import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, isAuthConfigured } from "@/lib/auth/session";
import { getBlobToken } from "@/lib/blob/token";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;
const IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/heic", "image/heif"];
const VIDEO_TYPES = ["video/mp4", "video/quicktime"];

// Vercel serverless functions cap request bodies at ~4.5MB, well under our
// 10MB photo / 100MB video limits — so uploads go browser-to-Blob directly.
// This route only ever handles the small JSON handshake (handleUpload),
// never the actual file bytes. See components/admin/product-form.tsx.
export async function POST(request: NextRequest): Promise<NextResponse> {
  const token = getBlobToken();
  if (!token) {
    return NextResponse.json(
      { error: "Photo/video uploads are not configured yet." },
      { status: 503 },
    );
  }

  const { handleUpload } = await import("@vercel/blob/client");
  const body = await request.json();

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      token,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        if (isAuthConfigured) {
          const user = await getSessionUser();
          if (!user?.isAdmin) {
            throw new Error("Unauthorized");
          }
        }

        const isVideo = clientPayload === "video";
        return {
          allowedContentTypes: isVideo ? VIDEO_TYPES : IMAGE_TYPES,
          maximumSizeInBytes: isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {},
    });

    return NextResponse.json(jsonResponse);
  } catch (err) {
    console.error("Vercel Blob token generation failed:", err);
    const detail = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Upload failed — ${detail}` }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const token = getBlobToken();
  if (!token) {
    return NextResponse.json({ ok: true }); // nothing to delete without storage configured
  }

  if (isAuthConfigured) {
    const user = await getSessionUser();
    if (!user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const { url } = await req.json();
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  try {
    const { del } = await import("@vercel/blob");
    await del(url, { token });
  } catch (err) {
    console.error("Vercel Blob delete failed:", err);
    // Non-fatal — an already-deleted or foreign URL shouldn't block the UI.
  }

  return NextResponse.json({ ok: true });
}
