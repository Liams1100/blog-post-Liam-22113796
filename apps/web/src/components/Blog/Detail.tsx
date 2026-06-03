import type { Post } from "@repo/db/data";
import Link from "next/link";
import { marked } from "marked";
import { LikeButton } from "./LikeButton";

export async function BlogDetail({ post }: { post: Post }) {
  const content = await marked.parse(post.content);
  const tags = post.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
  const formattedDate = post.date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <article
      className="mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm"
      data-test-id={`blog-post-${post.id}`}
    >
      <div className="grid gap-4 md:grid-cols-[160px_1fr]">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="h-36 w-full rounded object-cover md:h-48"
        />
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-accent">
            <Link href={`/post/${post.urlId}`}>{post.title}</Link>
          </h2>

          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-secondary">
              {post.category}
            </span>
            {tags.map((tag) => (
              <span key={tag} className="text-sm text-accent">
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-secondary">
            <span>{formattedDate}</span>
            {/* Previous hard-coded data implementation displayed: post.views + 1 */}
            <span>{post.views} views</span>
            {/* Previous implementation only displayed the count without a like action: */}
            {/* <span>{post.likes} likes</span> */}
            <LikeButton initialLikes={post.likes} urlId={post.urlId} />
          </div>

          <div
            data-test-id="content-markdown"
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </article>
  );
}
