import { auth, signIn, signOut } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase-server";
import PostCard from "@/components/PostCard";
import CreatePostForm from "@/components/CreatePostForm";
import type { Post } from "@/types/board";

async function getPosts(sessionUserId?: string): Promise<Post[]> {
  const { data: posts, error } = await supabaseAdmin
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }

  // If user is logged in, check which posts they've voted on
  if (sessionUserId) {
    const { data: votes } = await supabaseAdmin
      .from("votes")
      .select("post_id")
      .eq("user_id", sessionUserId);

    const votedPostIds = new Set(votes?.map((v) => v.post_id) || []);

    return posts.map((post: Post) => ({
      ...post,
      user_voted: votedPostIds.has(post.id),
    }));
  }

  return posts as Post[];
}

export default async function Board() {
  const session = await auth();
  // Only consider it a valid session if it has a user with an id
  const isAuthenticated = session?.user?.id;
  const posts = await getPosts(isAuthenticated);

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 lg:px-10">
      <header className="mb-10 max-w-3xl">
        <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.12em] text-[var(--green)]">
          Board
        </p>
        <h1 className="font-serif-display text-5xl leading-none text-[var(--foreground)] sm:text-6xl">
          Public Posts
        </h1>
        <p className="mt-5 text-lg leading-8 text-[var(--muted)]">
          A small public board for notes and links. Public posts stay visible when signed out.
        </p>
      </header>

      {/* Sign in prompt for unauthenticated users */}
      {!isAuthenticated && (
        <div className="mb-8 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-6">
          <p className="mb-4 text-[var(--muted)] sm:mb-0">
            Sign in with GitHub to create posts and upvote.
          </p>
          <form
            action={async () => {
              "use server";
              await signIn("github");
            }}
          >
            <button
              type="submit"
              className="min-h-11 rounded-full bg-[var(--green-dark)] px-5 font-extrabold text-white transition hover:opacity-90 dark:bg-[#d9f0e9] dark:text-[#111816]"
            >
              Sign in with GitHub
            </button>
          </form>
        </div>
      )}

      {/* Create Post Form (only for authenticated users) */}
      {isAuthenticated && <CreatePostForm />}

      {/* Posts List */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] py-12 text-center text-[var(--muted)]">
            <p className="text-lg mb-2">No posts yet</p>
            <p className="text-sm">Be the first to post!</p>
          </div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>

      {/* Sign Out Button */}
      {isAuthenticated && (
        <div className="mt-12 border-t border-[var(--line)] pt-8">
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button
              type="submit"
              className="min-h-10 rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 font-bold text-[var(--foreground)] transition hover:bg-[var(--surface-muted)]"
            >
              Sign Out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
