import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { auth } from '@/auth';

// POST /api/posts/[id]/vote - Upvote a post
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check if post exists
    const { data: post, error: postError } = await supabaseAdmin
      .from('posts')
      .select('id, upvotes')
      .eq('id', id)
      .single();

    if (postError || !post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Check if user already voted
    const { data: existingVote } = await supabaseAdmin
      .from('votes')
      .select('id')
      .eq('post_id', id)
      .eq('user_id', session.user.id)
      .single();

    if (existingVote) {
      return NextResponse.json({ error: 'You have already voted on this post' }, { status: 400 });
    }

    // Create vote and update post upvotes in a transaction
    const { error: voteError } = await supabaseAdmin
      .from('votes')
      .insert({
        post_id: id,
        user_id: session.user.id,
      });

    if (voteError) {
      console.error('Error creating vote:', voteError);
      return NextResponse.json({ error: 'Failed to vote' }, { status: 500 });
    }

    // Update post upvotes count
    const { error: updateError } = await supabaseAdmin
      .from('posts')
      .update({ upvotes: post.upvotes + 1 })
      .eq('id', id);

    if (updateError) {
      console.error('Error updating upvotes:', updateError);
      // Try to delete the vote we just created
      await supabaseAdmin.from('votes').delete().eq('post_id', id).eq('user_id', session.user.id);
      return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }

    return NextResponse.json({ success: true, upvotes: post.upvotes + 1 });
  } catch (error) {
    console.error('Error in POST /api/posts/[id]/vote:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

