import { updatePostActive } from "@repo/db/posts";
import { NextRequest, NextResponse } from "next/server";
import { isLoggedIn } from "../../../../../utils/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const postId = Number(id);

  if (!Number.isInteger(postId)) {
    return NextResponse.json({ error: "Invalid post id" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);

  if (typeof body?.active !== "boolean") {
    return NextResponse.json({ error: "Invalid active value" }, { status: 400 });
  }

  const post = await updatePostActive(postId, body.active);

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ post });
}
