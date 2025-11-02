"use client";

import { useEffect, useRef } from "react";

interface CommentsProps {
  slug: string;
  title: string;
}

export default function Comments({ slug, title }: CommentsProps) {
  const commentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!commentsRef.current) return;

    // Giscus configuration - values from environment variables
    const repo = process.env.NEXT_PUBLIC_GISCUS_REPO;
    const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
    const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY || "Announcements";
    const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

    // Check if Giscus is configured
    if (!repo || !repoId || !categoryId) {
      commentsRef.current.innerHTML = `
        <div class="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>Comments are not configured. Please set up Giscus environment variables.</p>
          <p class="text-sm mt-2">Create a .env.local file with your Giscus configuration.</p>
        </div>
      `;
      return;
    }

    // Function to get current theme
    const getCurrentTheme = () => {
      return document.documentElement.classList.contains("dark") ? "dark" : "light";
    };

    // Clear any existing content
    commentsRef.current.innerHTML = "";

    // Create script element
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", repo);
    script.setAttribute("data-repo-id", repoId);
    script.setAttribute("data-category", category);
    script.setAttribute("data-category-id", categoryId);
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", getCurrentTheme()); // Use current theme
    script.setAttribute("data-lang", "en");
    script.setAttribute("data-loading", "lazy");
    script.setAttribute("crossorigin", "anonymous");
    script.async = true;

    commentsRef.current.appendChild(script);

    // Cleanup function
    return () => {
      if (commentsRef.current) {
        commentsRef.current.innerHTML = "";
      }
    };
  }, [slug, title]);

  // Watch for dark mode changes and update Giscus theme
  useEffect(() => {
    const updateGiscusTheme = () => {
      const giscusFrame = document.querySelector<HTMLIFrameElement>("iframe.giscus-frame");
      if (giscusFrame?.contentWindow) {
        const isDark = document.documentElement.classList.contains("dark");
        const theme = isDark ? "dark" : "light";
        giscusFrame.contentWindow.postMessage(
          {
            giscus: {
              setConfig: {
                theme: theme,
              },
            },
          },
          "https://giscus.app"
        );
      }
    };

    // Watch for dark mode class changes
    const observer = new MutationObserver(updateGiscusTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Also listen to system theme changes (in case the toggle uses system preference)
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", updateGiscusTheme);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", updateGiscusTheme);
    };
  }, []);

  return (
    <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 comments-container">
      <h2 className="text-2xl font-semibold mb-6 text-[#111111] dark:text-gray-100">Comments</h2>
      <div ref={commentsRef} className="giscus" />
    </div>
  );
}
