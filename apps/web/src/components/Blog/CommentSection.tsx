"use client";

import type { BlogComment } from "@repo/db/data";
import { FormEvent, useState, useTransition } from "react";

type CommentSectionProps = {
  comments: BlogComment[];
  urlId: string;
};

type CommentFormProps = {
  buttonLabel: string;
  onSubmit: (fields: { authorName: string; content: string }) => void;
  pending: boolean;
};

function addComment(
  comments: BlogComment[],
  comment: BlogComment,
): BlogComment[] {
  if (!comment.parentCommentId) {
    return [...comments, comment];
  }

  return comments.map((item) => {
    if (item.id === comment.parentCommentId) {
      return {
        ...item,
        replies: [...item.replies, comment],
      };
    }

    return {
      ...item,
      replies: addComment(item.replies, comment),
    };
  });
}

function formatCommentDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function countComments(comments: BlogComment[]): number {
  return comments.reduce(
    (total, comment) => total + 1 + countComments(comment.replies),
    0,
  );
}

function CommentForm({ buttonLabel, onSubmit, pending }: CommentFormProps) {
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");

  function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (content.trim().length === 0) {
      return;
    }

    onSubmit({ authorName, content });
    setContent("");
  }

  return (
    <form className="grid gap-3" onSubmit={submitComment}>
      <label className="text-primary grid gap-1 text-sm font-medium">
        Name
        <input
          className="border-border bg-background text-primary rounded border px-3 py-2"
          maxLength={80}
          onChange={(event) => setAuthorName(event.target.value)}
          placeholder="Anonymous"
          type="text"
          value={authorName}
        />
      </label>
      <label className="text-primary grid gap-1 text-sm font-medium">
        Comment
        <textarea
          className="border-border bg-background text-primary min-h-24 resize-y rounded border px-3 py-2"
          maxLength={1000}
          onChange={(event) => setContent(event.target.value)}
          required
          value={content}
        />
      </label>
      <div>
        <button
          className="bg-accentSurface text-accentForeground disabled:bg-accentSurfaceDisabled rounded px-4 py-2 text-sm font-medium disabled:cursor-not-allowed"
          disabled={pending}
          type="submit"
        >
          {buttonLabel}
        </button>
      </div>
    </form>
  );
}

function CommentItem({
  comment,
  onReply,
  pending,
}: {
  comment: BlogComment;
  onReply: (
    parentCommentId: number,
    fields: { authorName: string; content: string },
  ) => void;
  pending: boolean;
}) {
  const [replying, setReplying] = useState(false);

  return (
    <li
      className="border-border grid gap-3 border-l-2 pl-4"
      data-test-id={`comment-${comment.id}`}
    >
      <article className="border-border bg-background grid gap-2 rounded border p-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <strong className="text-primary">{comment.authorName}</strong>
          <span className="text-secondary">
            {formatCommentDate(comment.createdAt)}
          </span>
        </div>
        <p className="text-primary whitespace-pre-wrap text-sm leading-6">
          {comment.content}
        </p>
        <div>
          <button
            className="text-accent hover:text-accentHover text-sm font-medium"
            onClick={() => setReplying((value) => !value)}
            type="button"
          >
            {replying ? "Cancel reply" : "Reply"}
          </button>
        </div>
      </article>

      {replying ? (
        <div className="border-border bg-surface rounded border p-3">
          <CommentForm
            buttonLabel="Post reply"
            onSubmit={(fields) => {
              onReply(comment.id, fields);
              setReplying(false);
            }}
            pending={pending}
          />
        </div>
      ) : null}

      {comment.replies.length > 0 ? (
        <ol className="grid gap-3">
          {comment.replies.map((reply) => (
            <CommentItem
              comment={reply}
              key={reply.id}
              onReply={onReply}
              pending={pending}
            />
          ))}
        </ol>
      ) : null}
    </li>
  );
}

export function CommentSection({
  comments: initialComments,
  urlId,
}: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const [isPending, startTransition] = useTransition();
  const commentCount = countComments(comments);

  function submitComment(
    fields: { authorName: string; content: string },
    parentCommentId?: number,
  ) {
    startTransition(async () => {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          urlId,
          parentCommentId,
          ...fields,
        }),
      });

      if (!response.ok) {
        return;
      }

      const comment = (await response.json()) as BlogComment;
      setComments((currentComments) => addComment(currentComments, comment));
    });
  }

  return (
    <section
      className="border-border bg-surface mb-4 grid gap-4 rounded-lg border p-4 shadow-sm"
      data-test-id="comment-section"
    >
      <div>
        <h2 className="text-accent text-xl font-semibold">Comments</h2>
        <p className="text-secondary text-sm">
          {commentCount} {commentCount === 1 ? "comment" : "comments"}
        </p>
      </div>

      <CommentForm
        buttonLabel="Post comment"
        onSubmit={(fields) => submitComment(fields)}
        pending={isPending}
      />

      {comments.length > 0 ? (
        <ol className="grid gap-3">
          {comments.map((comment) => (
            <CommentItem
              comment={comment}
              key={comment.id}
              onReply={(parentCommentId, fields) =>
                submitComment(fields, parentCommentId)
              }
              pending={isPending}
            />
          ))}
        </ol>
      ) : (
        <p className="text-secondary text-sm">No comments yet.</p>
      )}
    </section>
  );
}
