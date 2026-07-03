import { Metadata } from "next";
import { ReviewsClient } from "./reviews-client";

export const metadata: Metadata = {
  title: "Quản lý Đánh giá | Admin",
};

export default function AdminReviewsPage() {
  return <ReviewsClient />;
}
