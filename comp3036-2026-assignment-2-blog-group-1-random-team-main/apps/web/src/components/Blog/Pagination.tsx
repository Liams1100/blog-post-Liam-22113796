"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const pathname = usePathname(); // Get current path
  const searchParams = useSearchParams(); // Get current query parameters

  if (totalPages <= 1) {
    return null;
  }

  function pageHref(page: number) {
    const params = new URLSearchParams(searchParams.toString());

    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }

    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname; //rebuild the URL with both pathname and params query
  }

  return (
    <nav
      aria-label="Blog post pagination"
      className="mt-6 flex items-center justify-between gap-3"
    >
      {currentPage > 1 ? (
        <Link
          href={pageHref(currentPage - 1)}
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-background hover:text-accentHover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
        >
          Previous
        </Link>
      ) : (
        <span className="rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-secondary opacity-60">
          Previous
        </span>
      )}

      <span className="text-sm font-medium text-secondary">
        Page {currentPage} of {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Link
          href={pageHref(currentPage + 1)}
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-background hover:text-accentHover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
        >
          Next
        </Link>
      ) : (
        <span className="rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-secondary opacity-60">
          Next
        </span>
      )}
    </nav>
  );
}
