// import { posts } from "@repo/db/data";
import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { toUrlPath } from "@repo/utils/url";
import { getActivePosts } from "@repo/db/posts";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ name: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { name } = await params;
  const { page } = await searchParams;
  const normalizedName = toUrlPath(name);

  // Previous hard-coded data implementation:
  // const tagPosts = posts.filter((post) => {
  //   if (!post.active) return false;
  //
  //   const postTagSlugs = post.tags
  //     .split(",")
  //     .map((tag) => toUrlPath(tag.trim()))
  //     .filter(Boolean);
  //
  //   return postTagSlugs.includes(normalizedName);
  // });
  const posts = await getActivePosts();
  const tagPosts = posts.filter((post) => {
    const postTagSlugs = post.tags
      .split(",")
      .map((tag) => toUrlPath(tag.trim()))
      .filter(Boolean);

    return postTagSlugs.includes(normalizedName);
  });

  return (
    <AppLayout>
      <Main posts={tagPosts} page={page} />
    </AppLayout>
  );
}
