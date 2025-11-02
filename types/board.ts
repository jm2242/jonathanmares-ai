export interface Post {
  id: string;
  title: string;
  content: string;
  author_id: string;
  author_name: string;
  author_avatar: string | null;
  created_at: string;
  updated_at: string;
  upvotes: number;
  views: number;
  user_voted?: boolean; // Whether current user has voted
}

export interface Vote {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}

