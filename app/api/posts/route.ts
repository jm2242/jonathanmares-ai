import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { auth } from '@/auth';
import type { Post } from '@/types/board';

// GET /api/posts - List all posts sorted by most recent
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    // Fetch posts
    const { data: posts, error: postsError } = await supabaseAdmin
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (postsError) {
      console.error('Error fetching posts:', postsError);
      return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }

    // If user is logged in, check which posts they've voted on
    if (session?.user?.id) {
      const { data: votes } = await supabaseAdmin
        .from('votes')
        .select('post_id')
        .eq('user_id', session.user.id);

      const votedPostIds = new Set(votes?.map((v) => v.post_id) || []);

      // Add user_voted flag to posts
      const postsWithVotes = posts.map((post: Post) => ({
        ...post,
        user_voted: votedPostIds.has(post.id),
      }));

      return NextResponse.json(postsWithVotes);
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error in GET /api/posts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/posts - Create a new post
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content } = body;

    // Validation
    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    if (title.length > 300) {
      return NextResponse.json({ error: 'Title must be 300 characters or less' }, { status: 400 });
    }

    if (content.length > 10000) {
      return NextResponse.json({ error: 'Content must be 10,000 characters or less' }, { status: 400 });
    }

    // Sanitize content (basic - you may want to add more)
    const sanitizedTitle = title.trim();
    const sanitizedContent = content.trim();

    // Create post
    const { data: post, error } = await supabaseAdmin
      .from('posts')
      .insert({
        title: sanitizedTitle,
        content: sanitizedContent,
        author_id: session.user.id,
        author_name: session.user.username || session.user.name || 'Anonymous',
        author_avatar: session.user.image || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating post:', error);
      return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/posts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

