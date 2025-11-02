-- Create posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  upvotes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0
);

-- Create votes table (to track who voted and prevent duplicate votes)
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Index for faster queries
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_upvotes ON posts(upvotes DESC);
CREATE INDEX idx_votes_post_user ON votes(post_id, user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Allow anyone to read posts
CREATE POLICY "Anyone can read posts" ON posts
  FOR SELECT USING (true);

-- Allow authenticated users to create posts
CREATE POLICY "Authenticated users can create posts" ON posts
  FOR INSERT WITH CHECK (true);  -- We'll validate auth in API route

-- Allow anyone to read votes
CREATE POLICY "Anyone can read votes" ON votes
  FOR SELECT USING (true);

-- Allow authenticated users to create votes
CREATE POLICY "Authenticated users can vote" ON votes
  FOR INSERT WITH CHECK (true);  -- We'll validate auth in API route

-- Allow users to delete their own votes
CREATE POLICY "Users can delete their own votes" ON votes
  FOR DELETE USING (true);  -- We'll validate ownership in API route

