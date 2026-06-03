import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
// import { posts } from "@repo/db/data";
import { getActivePosts } from "@repo/db/posts";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = await searchParams;
  const search = (q ?? "").trim().toLowerCase();

  // Previous hard-coded data implementation:
  // const filteredPosts = posts.filter((post) => {
  //   if (!post.active) {
  //     return false;
  //   }
  //
  //   if (!search) {
  //     return true;
  //   }
  //
  //   return (
  //     post.title.toLowerCase().includes(search) ||
  //     post.description.toLowerCase().includes(search)
  //   );
  // });
  const posts = await getActivePosts();
  const filteredPosts = posts.filter((post) => {
    if (!search) {
      return true;
    }

    return (
      post.title.toLowerCase().includes(search) ||
      post.description.toLowerCase().includes(search)
    );
  });

  return (
    <AppLayout query={q}>
      <Main posts={filteredPosts} page={page} />
    </AppLayout>
  );
}
