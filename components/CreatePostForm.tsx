"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function CreatePostForm() {
  const router = useRouter();
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
    <form onSubmit={handleSubmit} className="bg-[#f9fafb] dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 mb-6 shadow-sm dark:shadow-none create-post-form">
      <h2 className="text-xl font-semibold mb-2 text-[#111111] dark:text-gray-100">
        Create a Post
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Write something nice!</p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-sm font-medium mb-2 text-[#111111] dark:text-gray-300"
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
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-[#111111] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
          {title.length}/300
        </div>
      </div>

      <div className="mb-4">
        <label
          htmlFor="content"
          className="block text-sm font-medium mb-2 text-[#111111] dark:text-gray-300"
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
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-[#111111] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          required
        />
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
          {content.length}/10,000
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !title.trim() || !content.trim()}
        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Posting..." : "Post"}
      </button>
    </form>
  );
}

