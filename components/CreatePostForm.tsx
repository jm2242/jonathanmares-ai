"use client";

import { useState, FormEvent } from "react";

export default function CreatePostForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }

    if (title.length > 300) {
      setError("Title must be 300 characters or less");
      return;
    }

    if (content.length > 10000) {
      setError("Content must be 10,000 characters or less");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: title.trim(), content: content.trim() }),
      });

      if (response.ok) {
        setTitle("");
        setContent("");
        // Refresh the page to show new post
        window.location.reload();
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to create post. Please try again.");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      setError("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5 shadow-sm create-post-form"
    >
      <h2 className="mb-2 text-xl font-bold text-[var(--foreground)]">Create a Post</h2>
      <p className="mb-4 text-sm text-[var(--muted)]">Write something nice!</p>

      {error && (
        <div className="mb-4 rounded-lg border border-[#e2b5ae] bg-[#f8e8e6] p-3 text-sm font-semibold text-[#7e2f2b] dark:border-[#76504b] dark:bg-[#3a211f] dark:text-[#ffd2cb]">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label
          htmlFor="title"
          className="mb-2 block text-sm font-extrabold text-[var(--foreground)]"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={300}
          placeholder="Enter post title..."
          className="min-h-11 w-full rounded-lg border border-[var(--line)] bg-[var(--paper)] px-3 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[rgb(197_138_43/0.22)]"
          required
        />
        <div className="mt-1 text-right text-xs text-[var(--muted)]">{title.length}/300</div>
      </div>

      <div className="mb-4">
        <label
          htmlFor="content"
          className="mb-2 block text-sm font-extrabold text-[var(--foreground)]"
        >
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={10000}
          rows={6}
          placeholder="What's on your mind?"
          className="w-full resize-none rounded-lg border border-[var(--line)] bg-[var(--paper)] px-3 py-2 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[rgb(197_138_43/0.22)]"
          required
        />
        <div className="mt-1 text-right text-xs text-[var(--muted)]">{content.length}/10,000</div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !title.trim() || !content.trim()}
        className="min-h-11 w-full rounded-full bg-[var(--green-dark)] px-4 py-2 font-extrabold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#d9f0e9] dark:text-[#111816]"
      >
        {isSubmitting ? "Posting..." : "Post"}
      </button>
    </form>
  );
}
