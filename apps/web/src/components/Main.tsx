import type { Post } from "@repo/db/data";
import BlogList from "./Blog/List";
import { Pagination } from "./Blog/Pagination";

const POSTS_PER_PAGE = 4;

function normalizePage(page?: string) {
  const parsedPage = Number.parseInt(page ?? "1", 10);
  return Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1; //ensure safe page number
}

export function Main({
  posts,
  className,
  page,
}: {
  posts: Post[];
  className?: string;
  page?: string;
}) {
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE)); 
  const currentPage = Math.min(normalizePage(page), totalPages);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const pagePosts = posts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  return (
    <section className={className}>
      <BlogList posts={pagePosts} />
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </section>
  );
}
