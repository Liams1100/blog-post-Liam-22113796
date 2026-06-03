import { client } from "./client.js";
import type { Post } from "./data.js";

type DbPostWithLikes = {
  id: number;
  urlId: string;
  title: string;
  content: string;
  description: string;
  imageUrl: string;
  date: Date;
  category: string;
  tags: string;
  views: number;
  active: boolean;
  _count: {
    Likes: number;
  };
};

function toPost(post: DbPostWithLikes): Post {
  return {
    id: post.id,
    urlId: post.urlId,
    title: post.title,
    content: post.content,
    description: post.description,
    imageUrl: post.imageUrl,
    date: post.date,
    category: post.category,
    views: post.views,
    likes: post._count.Likes,
    tags: post.tags,
    active: post.active,
  };
}

const includeLikesCount = {
  _count: {
    select: {
      Likes: true,
    },
  },
} as const;

type PostFields = {
  title: string;
  content: string;
  description: string;
  imageUrl: string;
  category: string;
  tags: string;
};

function toUrlPath(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function getPosts(): Promise<Post[]> {
  const posts = await client.db.post.findMany({
    orderBy: {
      date: "desc",
    },
    include: includeLikesCount,
  });

  return posts.map(toPost);
}

export async function getActivePosts(): Promise<Post[]> {
  const posts = await client.db.post.findMany({
    where: {
      active: true,
    },
    orderBy: {
      date: "desc",
    },
    include: includeLikesCount,
  });

  return posts.map(toPost);
}

export async function getPostByUrlId(urlId: string): Promise<Post | null> {
  const post = await client.db.post.findUnique({
    where: {
      urlId,
    },
    include: includeLikesCount,
  });

  return post ? toPost(post) : null;
}

export async function getActivePostByUrlId(
  urlId: string,
): Promise<Post | null> {
  const post = await client.db.post.findFirst({
    where: {
      urlId,
      active: true,
    },
    include: includeLikesCount,
  });

  return post ? toPost(post) : null;
}

export async function updatePostActive(
  id: number,
  active: boolean,
): Promise<Post | null> {
  const existingPost = await client.db.post.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!existingPost) {
    return null;
  }

  const post = await client.db.post.update({
    where: {
      id,
    },
    data: {
      active,
    },
    include: includeLikesCount,
  });

  return toPost(post);
}

export async function updatePost(
  id: number,
  fields: PostFields,
): Promise<Post | null> {
  const existingPost = await client.db.post.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!existingPost) {
    return null;
  }

  const post = await client.db.post.update({
    where: {
      id,
    },
    data: {
      ...fields,
      urlId: toUrlPath(fields.title),
    },
    include: includeLikesCount,
  });

  return toPost(post);
}

export async function createPost(fields: PostFields): Promise<Post> {
  const post = await client.db.post.create({
    data: {
      ...fields,
      urlId: toUrlPath(fields.title),
      active: true,
    },
    include: includeLikesCount,
  });

  return toPost(post);
}

export async function incrementActivePostViews(
  urlId: string,
): Promise<Post | null> {
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

  const updatedPost = await client.db.post.update({
    where: {
      id: post.id,
    },
    data: {
      views: {
        increment: 1,
      },
    },
    include: includeLikesCount,
  });

  return toPost(updatedPost);
}

export async function toggleActivePostLike(
  urlId: string,
  userIP: string,
): Promise<{ likes: number; liked: boolean } | null> {
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

  const existingLike = await client.db.like.findUnique({
    where: {
      postId_userIP: {
        postId: post.id,
        userIP,
      },
    },
  });

  const liked = !existingLike;

  if (existingLike) {
    await client.db.like.delete({
      where: {
        postId_userIP: {
          postId: post.id,
          userIP,
        },
      },
    });
  } else {
    await client.db.like.create({
      data: {
        postId: post.id,
        userIP,
      },
    });
  }

  const likes = await client.db.like.count({
    where: {
      postId: post.id,
    },
  });

  return { likes, liked };
}
