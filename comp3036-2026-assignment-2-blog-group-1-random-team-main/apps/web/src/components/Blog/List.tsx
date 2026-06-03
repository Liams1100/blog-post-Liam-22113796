import Link from "next/link";
import type { Post } from "@repo/db/data";

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// posts list
export function BlogList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return <div className="py-4">0 Posts</div>;
  }

  return (
    <div className="py-4 space-y-4">
      {posts.map((post) => {
        const tags = post.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0);

        return (
          <article
            key={post.id}
            className="mb-4 p-4 border border-border rounded-lg shadow-sm bg-surface"
            data-test-id={`blog-post-${post.id}`}
          >
            <div className="grid md:grid-cols-[160px_1fr] gap-4">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-36 md:h-48 object-cover rounded"
              />
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold text-accent">
                  <Link href={`/post/${post.urlId}`}>
                    {post.title}
                  </Link>
                </h2>

                <p className="text-primary">{post.description}</p>

                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-medium text-secondary">{post.category}</span>
                  {tags.map((tag) => (
                    <span key={tag} className="text-sm text-accent">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-secondary">
                  <span>{formatDate(post.date)}</span>
                  <span>{post.views} views</span>
                  <span>{post.likes} likes</span>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default BlogList;
