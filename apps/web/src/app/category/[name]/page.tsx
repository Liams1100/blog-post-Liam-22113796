// apps/web/src/app/category/[name]/page.tsx
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

  const normalizedCategory = toUrlPath(name);

  // Filter active posts
  // const categoryPosts = posts.filter(
  //   (post) => post.active && toUrlPath(post.category) === normalizedCategory
  // );
  const posts = await getActivePosts();
  const categoryPosts = posts.filter(
    (post) => toUrlPath(post.category) === normalizedCategory
  );

  return (
    <AppLayout>
      <Main posts={categoryPosts} page={page} />
    </AppLayout>
  );
}
