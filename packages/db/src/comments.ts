import { client } from "./client.js";
import type { BlogComment } from "./data.js";

type DbComment = {
  id: number;
  postId: number;
  parentCommentId: number | null;
  authorName: string;
  content: string;
  createdAt: Date;
};

type CommentFields = {
  urlId: string;
  authorName: string;
  content: string;
  parentCommentId?: number | null;
};

function toBlogComment(comment: DbComment): BlogComment {
  return {
    id: comment.id,
    postId: comment.postId,
    parentCommentId: comment.parentCommentId,
    authorName: comment.authorName,
    content: comment.content,
    createdAt: comment.createdAt.toISOString(),
    replies: [],
  };
}

function nestComments(comments: DbComment[]): BlogComment[] {
  const byId = new Map<number, BlogComment>();
  const roots: BlogComment[] = [];

  for (const comment of comments) {
    byId.set(comment.id, toBlogComment(comment));
  }

  for (const comment of comments) {
    const item = byId.get(comment.id);

    if (!item) {
      continue;
    }

    const parent = comment.parentCommentId
      ? byId.get(comment.parentCommentId)
      : undefined;

    if (parent) {
      parent.replies.push(item);
    } else {
      roots.push(item);
    }
  }

  return roots;
}

export async function getCommentsByPostUrlId(
  urlId: string,
): Promise<BlogComment[]> {
  const post = await client.db.post.findFirst({
    where: {
      urlId,
      active: true,
    },
    select: {
      id: true,
    },
  });

  if (!post) {
    return [];
  }

  const comments = await client.db.comment.findMany({
    where: {
      postId: post.id,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return nestComments(comments);
}

export async function createComment({
  urlId,
  authorName,
  content,
  parentCommentId,
}: CommentFields): Promise<BlogComment | null> {
  const post = await client.db.post.findFirst({
    where: {
      urlId,
      active: true,
    },
    select: {
      id: true,
    },
  });

  if (!post) {
    return null;
  }

  if (parentCommentId) {
    const parent = await client.db.comment.findFirst({
      where: {
        id: parentCommentId,
        postId: post.id,
      },
      select: {
        id: true,
      },
    });

    if (!parent) {
      return null;
    }
  }

  const comment = await client.db.comment.create({
    data: {
      postId: post.id,
      parentCommentId: parentCommentId || null,
      authorName,
      content,
    },
  });

  return toBlogComment(comment);
}
