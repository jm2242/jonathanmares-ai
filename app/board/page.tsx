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
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8 text-[#111111] dark:text-gray-100">Board</h1>

      {/* Sign in prompt for unauthenticated users */}
      {!isAuthenticated && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-blue-700 dark:text-blue-300 mb-3">
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
              className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
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
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p className="text-lg mb-2">No posts yet</p>
            <p className="text-sm">Be the first to post!</p>
          </div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>

      {/* Sign Out Button */}
      {isAuthenticated && (
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button
              type="submit"
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
