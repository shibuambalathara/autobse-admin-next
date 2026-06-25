export type BlogCategory =
  | "auction_tips"
  | "financing"
  | "industry_news"
  | "market_trends"
  | "regulations"
  | "success_stories"
  | "technology"
  | "vehicle_guides";

export interface Blog {
  id: string;
  blogNo?: number | null;
  title?: string | null;
  author?: string | null;
  description?: string | null;
  image?: string | null;
  category?: BlogCategory | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  createdById?: string | null;
  createdBy?: { id?: string | null; firstName?: string | null } | null;
}

export interface BlogsListResult {
  blogs: {
    blogCount?: number | null;
    deletedBlogCount?: number | null;
    blogs: Blog[];
  };
}

export interface DeletedBlogsResult {
  deletedBlogs: {
    deletedBlogCount?: number | null;
    blogs: Blog[];
  };
}

export interface SingleBlogResult {
  blog: Blog;
}

export interface CreateBlogInput {
  title: string;
  author: string;
  description: string;
  category: BlogCategory;
}

export interface UpdateBlogInput {
  title?: string;
  author?: string;
  description?: string;
  category?: BlogCategory;
}
