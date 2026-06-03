// import { posts } from "@repo/db/data";
import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { getActivePosts } from "@repo/db/posts";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ year: string; month: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { year, month } = await params;
  const { page } = await searchParams;

  // Filter active posts that match the year and month
  // Previous hard-coded data implementation:
  // const historyPosts = posts.filter((post) => {
  //   if (!post.active) return false;
  //
  //   const postYear = post.date.getFullYear();
  //   const postMonth = post.date.getMonth() + 1;
  //
  //   return postYear === parseInt(year) && postMonth === parseInt(month);
  // });
  const posts = await getActivePosts();
  const historyPosts = posts.filter((post) => {
    const postYear = post.date.getFullYear();
    const postMonth = post.date.getMonth() + 1; //

    return postYear === parseInt(year) && postMonth === parseInt(month);
  });

  return (
    <AppLayout>
      <Main posts={historyPosts} page={page} />
    </AppLayout>
  );
}
