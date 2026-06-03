import { createPost } from "@repo/db/posts";
import { NextRequest, NextResponse } from "next/server";
import { isLoggedIn } from "../../../utils/auth";

export async function POST(request: NextRequest) {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Invalid post data" }, { status: 400 });
  }

  const post = await createPost({
    title: body.title,
    category: body.category,
    description: body.description,
    content: body.content,
    imageUrl: body.imageUrl,
    tags: body.tags,
  });

  return NextResponse.json({ post });
}
