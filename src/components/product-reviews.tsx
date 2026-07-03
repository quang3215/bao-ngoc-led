"use client";

import { useState, useEffect } from "react";
import { collection, query, where, orderBy, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Star, StarHalf, UserCircle2 } from "lucide-react";
import { toast } from "sonner";

interface Review {
  id: string;
  sku: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: any;
}

export function ProductReviews({ sku }: { sku: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state
  const [rating, setRating] = useState(5);
  const [userName, setUserName] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const q = query(
          collection(db, "reviews"),
          where("sku", "==", sku),
          // orderBy requires a composite index if used with where, 
          // to keep it simple without requiring user to create an index manually,
          // we'll fetch and sort in memory.
        );
        const snapshot = await getDocs(q);
        const fetched: Review[] = [];
        snapshot.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() } as Review);
        });
        
        // Sort descending by date
        fetched.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.()?.getTime() || new Date(a.createdAt).getTime() || 0;
          const dateB = b.createdAt?.toDate?.()?.getTime() || new Date(b.createdAt).getTime() || 0;
          return dateB - dateA;
        });

        setReviews(fetched);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchReviews();
  }, [sku]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !comment.trim()) {
      toast.error("Vui lòng điền đầy đủ tên và nội dung đánh giá");
      return;
    }

    setIsSubmitting(true);
    try {
      const newReview = {
        sku,
        userName: userName.trim(),
        rating,
        comment: comment.trim(),
        createdAt: new Date().toISOString(),
      };
      
      const docRef = await addDoc(collection(db, "reviews"), newReview);
      
      // Optimistic update
      setReviews([{ id: docRef.id, ...newReview }, ...reviews]);
      setUserName("");
      setComment("");
      setRating(5);
      toast.success("Cảm ơn bạn đã đánh giá sản phẩm!");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="py-12 border-t border-slate-100 mt-12">
      <h3 className="text-2xl font-bold mb-8 text-slate-900 tracking-tight">Đánh giá sản phẩm</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12">
        {/* Rating Summary */}
        <div className="bg-slate-50 rounded-2xl p-8 flex flex-col items-center justify-center text-center h-fit">
          <div className="text-5xl font-bold text-slate-900 mb-2">{averageRating || "5.0"}</div>
          <div className="flex text-yellow-400 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-5 h-5 fill-current" />
            ))}
          </div>
          <p className="text-slate-500 text-sm">{reviews.length} đánh giá</p>
        </div>

        {/* Review List & Form */}
        <div>
          {/* Write Review Form */}
          <form onSubmit={handleSubmit} className="mb-12 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h4 className="font-semibold text-lg mb-4">Gửi đánh giá của bạn</h4>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Đánh giá sao</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`focus:outline-none transition-colors ${rating >= star ? "text-yellow-400" : "text-slate-300"}`}
                  >
                    <Star className="w-8 h-8 fill-current" />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <input 
                  type="text" 
                  placeholder="Họ và tên của bạn *" 
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                />
              </div>
              <div>
                <textarea 
                  placeholder="Mời bạn chia sẻ thêm cảm nhận về sản phẩm..." 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
            </Button>
          </form>

          {/* Reviews List */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center text-slate-500 py-8">Đang tải đánh giá...</div>
            ) : reviews.length === 0 ? (
              <div className="text-center text-slate-500 py-8 bg-slate-50 rounded-2xl">
                Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="flex gap-4 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex-shrink-0">
                    <UserCircle2 className="w-10 h-10 text-slate-300" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-slate-900">{review.userName}</h5>
                      <span className="text-sm text-slate-400">
                        {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <div className="flex text-yellow-400 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`w-4 h-4 ${review.rating >= star ? "fill-current" : "text-slate-200 fill-current"}`} />
                      ))}
                    </div>
                    <p className="text-slate-600 leading-relaxed">{review.comment}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
