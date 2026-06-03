import Link from "next/link";
// import { posts } from "@repo/db/data";
import { getActivePosts } from "@repo/db/posts";
import { CategoryList } from "./CategoryList";
import { HistoryList } from "./HistoryList";
import { TagList } from "./TagList";

export async function LeftMenu() {
  // const menuPosts = posts;
  const menuPosts = await getActivePosts();
  const navButtonClass =
    "block rounded-md border border-transparent px-3 py-2 text-sm font-medium text-primary transition-colors hover:border-border hover:bg-background hover:text-accentHover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface";

  return (
    <nav aria-label="Sidebar navigation" className="space-y-6">
      <div className="border-b border-border pb-4">
        <Link
          href="/"
          className="block rounded-md px-3 py-2 text-2xl font-bold text-accent transition-colors hover:bg-background hover:text-accentHover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface"
        >
          Blog Name
        </Link>
        <ul className="mt-3 space-y-1">
          <li>
            <Link href="/" className={navButtonClass}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/search" className={navButtonClass}>
              Search
            </Link>
          </li>
        </ul>
      </div>

      <section>
        <h3 className="px-3 text-sm font-semibold uppercase tracking-wide text-secondary">
          Categories
        </h3>
        <ul className="mt-2 space-y-1">
          <CategoryList posts={menuPosts} />
        </ul>
      </section>

      <section>
        <h3 className="px-3 text-sm font-semibold uppercase tracking-wide text-secondary">
          History
        </h3>
        <ul className="mt-2 space-y-1">
          <HistoryList selectedYear="" selectedMonth="" posts={menuPosts} />
        </ul>
      </section>

      <section>
        <h3 className="px-3 text-sm font-semibold uppercase tracking-wide text-secondary">
          Tags
        </h3>
        <ul className="mt-2 space-y-1">
          <TagList selectedTag="" posts={menuPosts} />
        </ul>
      </section>

      <div>
        <Link href="http://localhost:3002" className={navButtonClass}>
          Admin
        </Link>
      </div>
    </nav>
  );
}
