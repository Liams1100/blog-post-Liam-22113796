"use client";

import { useState, useTransition } from "react";

type LikeButtonProps = {
  initialLikes: number;
  urlId: string;
};

export function LikeButton({ initialLikes, urlId }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isPending, startTransition] = useTransition();

  // Sends the like/unlike action to the database-backed API route.
  function likePost() {
    startTransition(async () => {
      const response = await fetch("/api/likes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ urlId }),
      });

      if (!response.ok) {
        return;
      }

      const result = (await response.json()) as { likes: number };
      setLikes(result.likes);
    });
  }

  return (
    <div className="flex items-center gap-3">
      <span>{likes} likes</span>
      <button
        className="rounded bg-accentSurface px-3 py-1 text-sm font-medium text-accentForeground disabled:cursor-not-allowed disabled:bg-accentSurfaceDisabled"
        data-test-id="like-button"
        disabled={isPending}
        onClick={likePost}
        type="button"
      >
        Like
      </button>
    </div>
  );
}
