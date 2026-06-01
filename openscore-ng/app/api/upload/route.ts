import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadBytes, uploadDuration } from "@/lib/metrics";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  const start = performance.now();
  let outcome = "error";

  try {
    const session = await auth();
    if (!session?.user?.id) {
      outcome = "unauthenticated";
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      outcome = "invalid_type";
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      outcome = "too_large";
      return NextResponse.json(
        { error: "File too large. Maximum size is 5 MB." },
        { status: 400 }
      );
    }

    uploadBytes()?.record(file.size, { mime_type: file.type });

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    await prisma.usuario.update({
      where: { id: parseInt(session.user.id) },
      data: { stickerCard: dataUrl },
    });

    outcome = "success";
    return NextResponse.json({ url: dataUrl });
  } finally {
    uploadDuration()?.record((performance.now() - start) / 1000, { outcome });
  }
}
