// import { posts, type Post } from "../components/data";

export function tags(posts: { tags: string; active: boolean }[]) {
  const tagMap = new Map<string, number>();

  for (const post of posts) {
    if (!post.active) continue;

    const postTags = post.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    for (const tag of postTags) {
      tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
    }
  }

  const result = Array.from(tagMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, count]) => ({ name, count }));

  return result;
}
