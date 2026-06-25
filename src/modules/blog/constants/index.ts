import type { BlogCategory } from "@/modules/blog/types";

export const BLOGS_PAGE_SIZE = 10;

export const BLOG_CATEGORY_OPTIONS: {
  label: string;
  value: BlogCategory;
}[] = [
  { label: "Auction tips", value: "auction_tips" },
  { label: "Financing", value: "financing" },
  { label: "Industry news", value: "industry_news" },
  { label: "Market trends", value: "market_trends" },
  { label: "Regulations", value: "regulations" },
  { label: "Success stories", value: "success_stories" },
  { label: "Technology", value: "technology" },
  { label: "Vehicle guides", value: "vehicle_guides" },
];

export const BLOG_IMAGE_MAX_BYTES = 1 * 1024 * 1024;

export function formatBlogCategory(category?: string | null): string {
  if (!category) return "—";
  const match = BLOG_CATEGORY_OPTIONS.find((option) => option.value === category);
  if (match) return match.label;
  return category.replace(/_/g, " ");
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").trim();
}
