import Link from "next/link";
import type { Post } from "@repo/db/data";

export function BlogListItem({ post }: { post: Post }) {
  const tags = post.tags.split(",").map((t) => t.trim());
  
  // Format date as "DD Mon YYYY"
  const day = String(post.date.getDate()).padStart(2, "0");
  const month = post.date.toLocaleDateString("en-US", { month: "short" });
  const year = post.date.getFullYear();
  const dateStr = `${day} ${month} ${year}`;

  return (
    <article
      key={post.id}
      className="flex flex-row gap-8"
      data-test-id={`blog-post-${post.id}`}
    >
      <div className="flex-1">
        <h2 className="text-xl font-bold">
          <Link href={`/post/${post.urlId}`}>
            {post.title.replace("!", "")}
          </Link>
        </h2>
        <p className="text-secondary">{post.category}</p>
        <div className="flex gap-2 flex-wrap">
          {tags.map((tag) => (
            <span key={tag} className="whitespace-nowrap">{`#${tag}`}</span>
          ))}
        </div>
        <p className="text-sm text-secondary">{dateStr}</p>
        <p className="text-sm text-secondary">{post.views} views</p>
        <p className="text-sm text-secondary">{post.likes} likes</p>
      </div>
    </article>
  );
}
