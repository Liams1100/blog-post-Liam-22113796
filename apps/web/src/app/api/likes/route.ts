import { toggleActivePostLike } from "@repo/db/posts";
import { NextRequest, NextResponse } from "next/server";

function getRequestIP(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");

  return forwardedFor?.split(",")[0]?.trim() || realIP || "local-user";
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    urlId?: unknown;
  } | null;

  if (typeof body?.urlId !== "string" || body.urlId.trim().length === 0) {
    return NextResponse.json(
      { message: "A post urlId is required" },
      { status: 400 },
    );
  }

  const result = await toggleActivePostLike(
    body.urlId.trim(),
    getRequestIP(request),
  );

  if (!result) {
    return NextResponse.json({ message: "Article not found" }, { status: 404 });
  }

  return NextResponse.json(result, { status: 200 });
}
