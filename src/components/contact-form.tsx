"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      toast.error("Vui lòng điền các thông tin bắt buộc (*)");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "contacts"), {
        ...formData,
        status: "new",
        createdAt: serverTimestamp()
      });
      toast.success("Gửi yêu cầu thành công! Chúng tôi sẽ liên hệ lại sớm nhất.");
      setFormData({ name: "", phone: "", email: "", message: "" });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Họ và Tên <span className="text-red-500">*</span></label>
          <Input 
            required
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            placeholder="VD: Nguyễn Văn A" 
            className="h-12 bg-slate-50/50 border-slate-200 focus-visible:ring-primary/20 rounded-xl"
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Số Điện Thoại <span className="text-red-500">*</span></label>
          <Input 
            required
            value={formData.phone}
            onChange={e => setFormData({...formData, phone: e.target.value})}
            placeholder="VD: 0912 345 678" 
            className="h-12 bg-slate-50/50 border-slate-200 focus-visible:ring-primary/20 rounded-xl"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">Email</label>
        <Input 
          type="email" 
          value={formData.email}
          onChange={e => setFormData({...formData, email: e.target.value})}
          placeholder="VD: email@domain.com" 
          className="h-12 bg-slate-50/50 border-slate-200 focus-visible:ring-primary/20 rounded-xl"
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">Nội Dung Cần Hỗ Trợ <span className="text-red-500">*</span></label>
        <textarea 
          required
          value={formData.message}
          onChange={e => setFormData({...formData, message: e.target.value})}
          rows={5}
          placeholder="Bạn cần tư vấn giải pháp chiếu sáng, thiết kế dự án hay mua lẻ?" 
          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
          disabled={isSubmitting}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full h-14 text-base font-bold rounded-xl shadow-[0_8px_20px_rgba(var(--primary),0.2)] hover:-translate-y-1 transition-all duration-300">
        {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5" />} 
        {isSubmitting ? "Đang gửi..." : "Gửi Yêu Cầu"}
      </Button>
    </form>
  );
}
