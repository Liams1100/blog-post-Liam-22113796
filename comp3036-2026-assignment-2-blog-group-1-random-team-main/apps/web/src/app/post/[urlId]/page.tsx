import { AppLayout } from "@/components/Layout/AppLayout";
import { BlogDetail } from "@/components/Blog/Detail";
import { CommentSection } from "@/components/Blog/CommentSection";
// import { posts } from "@repo/db/data";
// import { getActivePostByUrlId } from "@repo/db/posts";
import { getCommentsByPostUrlId } from "@repo/db/comments";
import { incrementActivePostViews } from "@repo/db/posts";

export default async function Page({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const { urlId } = await params;

  // const post = posts.find((p) => p.urlId === urlId && p.active);
  // const post = await getActivePostByUrlId(urlId);
  const post = await incrementActivePostViews(urlId);

  if (!post) {
    return <AppLayout>Article not found</AppLayout>;
  }

  // Previous hard-coded data implementation simulated persisted views in memory:
  // post.views += 1;
  const comments = await getCommentsByPostUrlId(urlId);

  return (
    <AppLayout>
      <BlogDetail post={post} />
      <CommentSection comments={comments} urlId={post.urlId} />
    </AppLayout>
  );
}
