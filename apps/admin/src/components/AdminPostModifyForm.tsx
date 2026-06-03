"use client";

import type { Post } from "@repo/db/data";
import { marked } from "marked";
import { useEffect, useRef, useState } from "react";
import type Quill from "quill";

type FormErrors = {
  title?: string;
  category?: string;
  description?: string;
  content?: string;
  tags?: string;
  imageUrl?: string;
};

const richContentClassName = //classes cuz tailwind doesn't support
  "min-h-40 rounded border border-gray-300 px-3 py-2 text-sm " +
  "[&_blockquote]:my-3 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-700 " +
  "[&_h1]:mb-3 [&_h1]:mt-4 [&_h1]:text-3xl [&_h1]:font-bold " +
  "[&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-2xl [&_h2]:font-bold " +
  "[&_h3]:mb-2 [&_h3]:mt-3 [&_h3]:text-xl [&_h3]:font-semibold " +
  "[&_li]:my-1 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 " +
  "[&_p]:my-2 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6";

function validateUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function AdminPostModifyForm({ post }: { post?: Post }) {
  const [title, setTitle] = useState(post?.title ?? "");
  const [category, setCategory] = useState(post?.category ?? "");
  const [description, setDescription] = useState(post?.description ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [tags, setTags] = useState(post?.tags ?? "");
  const [imageUrl, setImageUrl] = useState(post?.imageUrl ?? "");
  const [errors, setErrors] = useState<FormErrors>({});
  const [saveMessage, setSaveMessage] = useState("");

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);


  const contentRef = useRef<HTMLTextAreaElement | null>(null);
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);
  const editorContentRef = useRef(content);
  const syncingEditorRef = useRef(false);
  const selectionRef = useRef<{ start: number; end: number } | null>(null);
  //preview cursor position
  useEffect(() => {
    if (isPreviewOpen) {
      return;
    }

    const textarea = contentRef.current;
    const selection = selectionRef.current;

    if (!textarea || !selection) {
      return;
    }

    textarea.focus();
    textarea.setSelectionRange(selection.start, selection.end);
  }, [isPreviewOpen]);

  useEffect(() => {
    if (isPreviewOpen || !editorContainerRef.current || quillRef.current) {
      return;
    }

    let isMounted = true;
    const editorContainer = editorContainerRef.current;

    async function loadEditor() {
      const { default: QuillEditor } = await import("quill");

      if (!isMounted || !editorContainerRef.current || quillRef.current) {
        return;
      }

      const editor = new QuillEditor(editorContainerRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            ["bold", "italic", "underline"],
            [{ header: [2, 3, false] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["blockquote", "link"],
            ["clean"],
          ],
        },
      });
      //state -> quill
      quillRef.current = editor;
      syncingEditorRef.current = true;
      editor.clipboard.dangerouslyPasteHTML(
        marked.parse(editorContentRef.current) as string,
      );
      syncingEditorRef.current = false;

      editor.on("text-change", () => {
        if (syncingEditorRef.current) {
          return;
        }

        const nextContent = editor.getSemanticHTML();
        editorContentRef.current = nextContent;
        setContent(nextContent);
      });
    }

    void loadEditor();

    return () => {
      isMounted = false;
      quillRef.current = null;
      editorContainer.innerHTML = "";
    };
  }, [isPreviewOpen]);

  //quill -> state
  useEffect(() => {
    const editor = quillRef.current;

    if (!editor || content === editorContentRef.current) {
      return;
    }

    editorContentRef.current = content;
    syncingEditorRef.current = true;
    editor.clipboard.dangerouslyPasteHTML(marked.parse(content) as string);
    syncingEditorRef.current = false;
  }, [content]);

  async function onSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaveMessage("");

    const nextErrors: FormErrors = {};

    if (!title.trim()) {
      nextErrors.title = "Title is required";
    }

    if (!category.trim()) {
      nextErrors.category = "Category is required";
    }

    if (!description.trim()) {
      nextErrors.description = "Description is required";
    } else if (description.length > 200) {
      nextErrors.description =
        "Description is too long. Maximum is 200 characters";
    }

    if (!content.trim()) {
      nextErrors.content = "Content is required";
    }

    if (!imageUrl.trim()) {
      nextErrors.imageUrl = "Image URL is required";
    } else if (!validateUrl(imageUrl.trim())) {
      nextErrors.imageUrl = "This is not a valid URL";
    }

    const hasAtLeastOneTag = tags
      .split(",")
      .some((tag) => tag.trim().length > 0);

    if (!hasAtLeastOneTag) {
      nextErrors.tags = "At least one tag is required";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const response = await fetch(
      post ? `/api/posts/${post.id}` : "/api/posts",
      {
        method: post ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          category: category.trim(),
          description: description.trim(),
          content: content.trim(),
          imageUrl: imageUrl.trim(),
          tags: tags.trim(),
        }),
      },
    );

    if (response.ok) {
      setSaveMessage("Post updated successfully");
      return;
    }

    setErrors({
      title: "Post could not be saved",
    });
  }

  function togglePreview() {
    if (!isPreviewOpen) {
      const textarea = contentRef.current;

      if (textarea) {
        selectionRef.current = {
          start: textarea.selectionStart,
          end: textarea.selectionEnd,
        };
      }

      setIsPreviewOpen(true);
      return;
    }

    setIsPreviewOpen(false);
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-3xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold text-blue-700">Modify Post</h1>

        <form className="space-y-4" onSubmit={onSave} noValidate>
          {/*save button error message*/}
          {Object.keys(errors).length > 0 ? (
            <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              Please fix the errors before saving
            </p>
          ) : null}
          {saveMessage ? (
            <p className="rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
              {saveMessage}
            </p>
          ) : null}

          <div className="flex flex-col gap-1">
            <label
              htmlFor="title"
              className="text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              id="title"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.title ? (
              <p className="text-sm text-red-700">{errors.title}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="category"
              className="text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <input
              id="category"
              required
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.category ? (
              <p className="text-sm text-red-700">{errors.category}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              required
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-20 rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.description ? (
              <p className="text-sm text-red-700">{errors.description}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={togglePreview}
              className="mb-1 w-fit rounded border border-gray-300 px-3 py-1 text-sm text-gray-700"
            >
              {isPreviewOpen ? "Close Preview" : "Preview"}
            </button>

            <label
              htmlFor="content"
              className="text-sm font-medium text-gray-700"
            >
              Content
            </label>
            {isPreviewOpen ? (
              <div
                data-test-id="content-preview"
                className={richContentClassName}
                dangerouslySetInnerHTML={{
                  __html: marked.parse(content) as string,
                }}
              />
            ) : (
              <div className="space-y-3">
                <textarea
                  id="content"
                  ref={contentRef}
                  required
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  className="min-h-40 w-full resize-y rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                />
                <div
                  ref={editorContainerRef}
                  aria-label="Rich text editor"
                  className="min-h-40 rounded bg-white"
                />
              </div>
            )}
            {errors.content ? (
              <p className="text-sm text-red-700">{errors.content}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="tags" className="text-sm font-medium text-gray-700">
              Tags
            </label>
            <input
              id="tags"
              required
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              className="rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.tags ? (
              <p className="text-sm text-red-700">{errors.tags}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="image-url"
              className="text-sm font-medium text-gray-700"
            >
              Image URL
            </label>
            <input
              id="image-url"
              required
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              className="rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
            {/*image preview*/}

            {imageUrl.trim() ? (
              <img
                data-test-id="image-preview"
                src={imageUrl}
                alt="Preview"
                className="mt-2 h-40 w-full rounded border border-gray-200 object-cover"
              />
            ) : null}

            {errors.imageUrl ? (
              <p className="text-sm text-red-700">{errors.imageUrl}</p>
            ) : null}
          </div>

          <button
            type="submit"
            className="rounded bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
          >
            Save
          </button>
        </form>
      </div>
    </main>
  );
}
