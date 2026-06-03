"use client";

import { useRouter } from "next/navigation";
import type { ChangeEvent } from "react";

export function SearchInput({ query }: { query?: string }) {
  const router = useRouter();

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const search = event.target.value;
    router.push(`/search?q=${encodeURIComponent(search)}`);
  };

  return (
    <form action="#" method="GET" className="grid w-full max-w-md grid-cols-1">
      <input
        type="search"
        placeholder="Search"
        defaultValue={query ?? ""}
        onChange={handleSearch}
        className="rounded border border-border bg-background px-2 py-1 text-sm text-primary"
      />
    </form>
  );
}
