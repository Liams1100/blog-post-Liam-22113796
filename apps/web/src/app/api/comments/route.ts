import { createComment } from "@repo/db/comments";
import { NextResponse } from "next/server";

const MAX_AUTHOR_LENGTH = 80;
const MAX_CONTENT_LENGTH = 1000;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    urlId?: unknown;
    authorName?: unknown;
    content?: unknown;
    parentCommentId?: unknown;
  } | null;

  if (typeof body?.urlId !== "string" || body.urlId.trim().length === 0) {
    return NextResponse.json(
      { message: "A post urlId is required" },
      { status: 400 },
    );
  }

  if (typeof body.content !== "string" || body.content.trim().length === 0) {
    return NextResponse.json(
      { message: "Comment content is required" },
      { status: 400 },
    );
  }

  const authorName =
    typeof body.authorName === "string" && body.authorName.trim().length > 0
      ? body.authorName.trim().slice(0, MAX_AUTHOR_LENGTH)
      : "Anonymous";
  const parentCommentId =
    typeof body.parentCommentId === "number" ? body.parentCommentId : null;

  const comment = await createComment({
    urlId: body.urlId.trim(),
    authorName,
    content: body.content.trim().slice(0, MAX_CONTENT_LENGTH),
    parentCommentId,
  });

  if (!comment) {
    return NextResponse.json(
      { message: "Article or parent comment not found" },
      { status: 404 },
    );
  }

  return NextResponse.json(comment, { status: 201 });
}
