"use client";

import type { Post } from "@repo/db/data";
import Link from "next/link";
import { useState } from "react";

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function parseDateFilter(value: string): Date | null {
  const compact = value.replace(/\D/g, "");

  if (compact.length !== 8) {
    return null;
  }

  const day = Number(compact.slice(0, 2));
  const month = Number(compact.slice(2, 4));
  const year = Number(compact.slice(4, 8));
  const parsed = new Date(year, month - 1, day);

  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  return parsed;
}

export function AdminPostList({ posts }: { posts: Post[] }) {
  const [postItems, setPostItems] = useState(posts);
  const [contentFilter, setContentFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [savingPostId, setSavingPostId] = useState<number | null>(null);

  async function toggleActive(post: Post) {
    const nextActive = !post.active;

    setSavingPostId(post.id);
    setPostItems((currentPosts) =>
      currentPosts.map((currentPost) =>
        currentPost.id === post.id
          ? { ...currentPost, active: nextActive }
          : currentPost,
      ),
    );

    try {
      const response = await fetch(`/api/posts/${post.id}/active`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ active: nextActive }),
      });

      if (response.ok) {
        return;
      }

      setPostItems((currentPosts) =>
        currentPosts.map((currentPost) =>
          currentPost.id === post.id
            ? { ...currentPost, active: post.active }
            : currentPost,
        ),
      );
    } catch {
      setPostItems((currentPosts) =>
        currentPosts.map((currentPost) =>
          currentPost.id === post.id
            ? { ...currentPost, active: post.active }
            : currentPost,
        ),
      );
    } finally {
      setSavingPostId(null);
    }
  }

  const filtered = postItems
    .filter((post) => {


      if (contentFilter) {
        const q = contentFilter.toLowerCase();
        if (
          !post.title.toLowerCase().includes(q) &&
          !post.content.toLowerCase().includes(q)
        ) {
          return false;
        }
      }


      if (tagFilter) { 
        if (!post.tags.toLowerCase().includes(tagFilter.toLowerCase())) {
          return false;
        }
      }


      if (dateFilter) {
        const filterDate = parseDateFilter(dateFilter);
        if (filterDate && post.date < filterDate) return false;
      }
      return true;
    })


    .sort((a, b) => {
      if (sortBy === "title-asc") return a.title.localeCompare(b.title);
      if (sortBy === "title-desc") return b.title.localeCompare(a.title);
      if (sortBy === "date-asc") return a.date.getTime() - b.date.getTime();
      return b.date.getTime() - a.date.getTime(); // 
    });

  return (
    <div>
      {/* Create Post */}
      <div className="mb-4 flex justify-end">
        <Link
          href="/posts/create"
          className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
        >
          Create Post
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 grid gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="filter-content" className="text-sm font-medium text-gray-700">
            Filter by Content:
          </label>
          <input
            id="filter-content"
            type="text"
            value={contentFilter}
            onChange={(e) => setContentFilter(e.target.value)}
            className="rounded border border-gray-300 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="filter-tag" className="text-sm font-medium text-gray-700">
            Filter by Tag:
          </label>
          <input
            id="filter-tag"
            type="text"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="rounded border border-gray-300 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="filter-date" className="text-sm font-medium text-gray-700">
            Filter by Date Created:
          </label>
          <input
            id="filter-date"
            type="text"
            inputMode="numeric"
            placeholder="DDMMYYYY"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="rounded border border-gray-300 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="sort-by" className="text-sm font-medium text-gray-700">
            Sort By:
          </label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded border border-gray-300 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="date-desc">Date (Newest)</option>
            <option value="date-asc">Date (Oldest)</option>
            <option value="title-asc">Title (A–Z)</option>
            <option value="title-desc">Title (Z–A)</option>
          </select>
        </div>
      </div>

      {/* Post list */}
      <section className="space-y-4">
        {filtered.map((post) => {
          const tags = post.tags
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t.length > 0);

          return (
            <article
              key={post.id}
              data-test-id={`blog-post-${post.id}`}
              className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="grid gap-4 md:grid-cols-[160px_1fr]">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="h-36 w-full rounded object-cover"
                />
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl font-semibold text-blue-700">
                    <Link href={`/post/${post.urlId}`}>{post.title}</Link>
                  </h2>
                  <p className="text-sm text-gray-700">{post.description}</p>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    <span>{post.category}</span>
                    <span>{tags.map((t) => `#${t}`).join(", ")}</span>
                    <span>Posted on {formatDate(post.date)}</span>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => toggleActive(post)}
                      disabled={savingPostId === post.id}
                      className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-700"
                    >
                      {post.active ? "Active" : "Inactive"}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
