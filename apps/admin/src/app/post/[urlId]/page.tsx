// import { posts } from "@repo/db/data";
import { getPostByUrlId } from "@repo/db/posts";
import { redirect } from "next/navigation";
import { isLoggedIn } from "../../../utils/auth";
import { AdminPostModifyForm } from "../../../components/AdminPostModifyForm";

export default async function PostModifyPage({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    redirect("/login");
  }

  const { urlId } = await params;
  // const post = posts.find((item) => item.urlId === urlId);
  const post = await getPostByUrlId(urlId);

  if (!post) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-3xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          Post not found
        </div>
      </main>
    );
  }

  return <AdminPostModifyForm post={post} />;
}
