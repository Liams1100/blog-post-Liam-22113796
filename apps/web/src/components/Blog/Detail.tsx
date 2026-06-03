import type { Post } from "@repo/db/data";
import Link from "next/link";
import { marked } from "marked";
import { LikeButton } from "./LikeButton";

const richContentClassName =
  "max-w-none " +
  "[&_blockquote]:my-3 [&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-secondary " +
  "[&_h1]:mb-3 [&_h1]:mt-4 [&_h1]:text-3xl [&_h1]:font-bold " +
  "[&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-2xl [&_h2]:font-bold " +
  "[&_h3]:mb-2 [&_h3]:mt-3 [&_h3]:text-xl [&_h3]:font-semibold " +
  "[&_li]:my-1 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 " +
  "[&_p]:my-2 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6";

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
            className={richContentClassName}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </article>
  );
}
