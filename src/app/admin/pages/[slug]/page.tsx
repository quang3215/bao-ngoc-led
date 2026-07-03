"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { use } from "react";

export default function AdminPageEditor({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const isNew = resolvedParams.slug === "new";
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(!isNew);
  
  const [formData, setFormData] = useState({
    id: "", // slug
    title: "",
    content: "",
  });

  useEffect(() => {
    if (isNew) return;
    
    const fetchPage = async () => {
      try {
        const docRef = doc(db, "pages", resolvedParams.slug);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            id: docSnap.id,
            title: data.title || "",
            content: data.content || "",
          });
        } else {
          toast.error("Không tìm thấy trang");
          router.push("/admin/pages");
        }
      } catch (error) {
        console.error("Error fetching page:", error);
        toast.error("Lỗi khi tải trang");
      } finally {
        setIsFetching(false);
      }
    };
    fetchPage();
  }, [isNew, resolvedParams.slug, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.id.trim()) {
      toast.error("Vui lòng nhập Đường dẫn (Slug)");
      return;
    }
    
    // basic slug format validation (letters, numbers, hyphens)
    if (!/^[a-z0-9-]+$/.test(formData.id)) {
      toast.error("Slug chỉ được chứa chữ thường không dấu, số và dấu gạch ngang (-)");
      return;
    }

    setIsLoading(true);

    try {
      const docRef = doc(db, "pages", formData.id);
      
      // If creating new, check if slug already exists
      if (isNew) {
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          toast.error("Đường dẫn này đã tồn tại, vui lòng chọn tên khác!");
          setIsLoading(false);
          return;
        }
      }

      await setDoc(docRef, {
        title: formData.title,
        content: formData.content,
        updatedAt: serverTimestamp(),
      });

      toast.success(isNew ? "Đã tạo trang mới thành công!" : "Đã cập nhật trang!");
      router.push("/admin/pages");
    } catch (error) {
      console.error("Error saving page:", error);
      toast.error("Đã xảy ra lỗi khi lưu");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/pages">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{isNew ? "Thêm trang nội dung mới" : "Chỉnh sửa trang"}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề trang <span className="text-red-500">*</span></Label>
              <Input 
                id="title"
                placeholder="VD: Chính sách bảo hành"
                value={formData.title}
                onChange={(e) => {
                  const title = e.target.value;
                  // Auto generate slug if new
                  if (isNew) {
                    const slug = title
                      .toLowerCase()
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .replace(/đ/g, "d")
                      .replace(/[^a-z0-9 ]/g, "")
                      .replace(/\s+/g, "-");
                    setFormData({ ...formData, title, id: slug });
                  } else {
                    setFormData({ ...formData, title });
                  }
                }}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="id">Đường dẫn (Slug) <span className="text-red-500">*</span></Label>
              <Input 
                id="id"
                placeholder="vd: chinh-sach-bao-hanh"
                value={formData.id}
                onChange={(e) => setFormData({...formData, id: e.target.value.toLowerCase()})}
                disabled={!isNew}
                required
              />
              <p className="text-xs text-muted-foreground">Link sẽ có dạng: /trang/{formData.id || "..."}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Nội dung trang (Hỗ trợ HTML/Markdown) <span className="text-red-500">*</span></Label>
            <Textarea 
              id="content"
              className="min-h-[400px] font-mono text-sm leading-relaxed"
              placeholder="<h1>Tiêu đề</h1><p>Nội dung văn bản ở đây...</p>"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/pages")}>Hủy bỏ</Button>
          <Button type="submit" disabled={isLoading} className="gap-2 px-8">
            {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
            {isNew ? "Tạo trang" : "Lưu thay đổi"}
          </Button>
        </div>
      </form>
    </div>
  );
}
