"use client";

import { useState } from "react";
import Image from "next/image";
import type { Post } from "@/types/board";

interface PostCardProps {
  post: Post;
  onVote?: (postId: string) => void;
}

export default function PostCard({ post, onVote }: PostCardProps) {
  const [isVoting, setIsVoting] = useState(false);
  const [userVoted, setUserVoted] = useState(post.user_voted || false);
  const [upvotes, setUpvotes] = useState(post.upvotes);

  const handleVote = async () => {
    if (isVoting || userVoted) return;

    setIsVoting(true);
    try {
      const response = await fetch(`/api/posts/${post.id}/vote`, {
        method: "POST",
      });

      if (response.ok) {
        setUserVoted(true);
        setUpvotes((prev) => prev + 1);
        onVote?.(post.id);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to vote");
      }
    } catch (error) {
      console.error("Error voting:", error);
      alert("Failed to vote. Please try again.");
    } finally {
      setIsVoting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  return (
    <div className="flex gap-4 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4 shadow-sm transition hover:border-[#b7c3ba] dark:hover:border-[#53625d] board-post-card">
      {/* Upvote Section */}
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={handleVote}
          disabled={isVoting || userVoted}
          className={`rounded-full p-1 transition-colors hover:bg-[var(--surface-muted)] ${
            userVoted ? "text-[var(--gold)]" : "text-[var(--muted)] hover:text-[var(--gold)]"
          } ${isVoting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          aria-label="Upvote"
        >
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <span
          className={`text-sm font-semibold ${
            userVoted ? "text-[var(--gold)]" : "text-[var(--muted)]"
          }`}
        >
          {upvotes}
        </span>
      </div>

      {/* Post Content */}
      <div className="flex-1 min-w-0">
        <h3 className="mb-2 text-lg font-bold text-[var(--foreground)]">{post.title}</h3>
        <div className="mb-3 whitespace-pre-wrap break-words leading-7 text-[var(--foreground)] post-content">
          {post.content}
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
          {post.author_avatar && (
            <Image
              src={post.author_avatar}
              alt={post.author_name}
              width={20}
              height={20}
              className="rounded-full"
            />
          )}
          <span className="font-medium">{post.author_name}</span>
          <span>•</span>
          <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
        </div>
      </div>
    </div>
  );
}
