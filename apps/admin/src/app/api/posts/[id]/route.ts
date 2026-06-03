import { updatePost } from "@repo/db/posts";
import { NextRequest, NextResponse } from "next/server";
import { isLoggedIn } from "../../../../utils/auth";

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

  if (!body) {
    return NextResponse.json({ error: "Invalid post data" }, { status: 400 });
  }

  const post = await updatePost(postId, {
    title: body.title,
    category: body.category,
    description: body.description,
    content: body.content,
    imageUrl: body.imageUrl,
    tags: body.tags,
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ post });
}
