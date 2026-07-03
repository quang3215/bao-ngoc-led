"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, FileText, Loader2, Globe } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PageDoc {
  id: string; // which is the slug
  title: string;
  updatedAt?: any;
}

export default function AdminPagesList() {
  const [pages, setPages] = useState<PageDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPages = async () => {
    try {
      const snapshot = await getDocs(collection(db, "pages"));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PageDoc[];
      setPages(data);
    } catch (error) {
      console.error("Error fetching pages:", error);
      toast.error("Không thể tải danh sách trang");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "pages", id));
      setPages(pages.filter(p => p.id !== id));
      toast.success("Đã xóa trang thành công");
    } catch (error) {
      console.error("Error deleting page:", error);
      toast.error("Không thể xóa trang");
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Quản lý Trang nội dung</h1>
          <p className="text-muted-foreground text-sm mt-1">Tạo và chỉnh sửa các trang như Chính sách, Hướng dẫn, Điều khoản...</p>
        </div>
        <Link href="/admin/pages/new">
          <Button className="gap-2 bg-primary h-10 px-5 rounded-xl shadow-sm font-semibold">
            <Plus className="h-4 w-4" /> Thêm trang mới
          </Button>
        </Link>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        {pages.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p className="mb-4">Chưa có trang nội dung nào.</p>
            <Link href="/admin/pages/new">
              <Button variant="outline">
                Tạo trang đầu tiên
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-medium border-b">
                <tr>
                  <th className="px-6 py-4">Tiêu đề trang</th>
                  <th className="px-6 py-4">Đường dẫn (Slug)</th>
                  <th className="px-6 py-4">Cập nhật lần cuối</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pages.map((page) => (
                  <tr key={page.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {page.title}
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                      /trang/{page.id}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {page.updatedAt ? format(page.updatedAt.toDate(), 'dd/MM/yyyy HH:mm') : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild title="Xem trang">
                          <a href={`/trang/${page.id}`} target="_blank" rel="noopener noreferrer">
                            <Globe className="h-4 w-4 text-slate-500 hover:text-blue-600" />
                          </a>
                        </Button>
                        <Button variant="ghost" size="icon" asChild title="Chỉnh sửa">
                          <Link href={`/admin/pages/${page.id}`}>
                            <Edit className="h-4 w-4 text-slate-500 hover:text-green-600" />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              title="Xóa trang"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Xác nhận xoá trang</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn có chắc chắn muốn xóa trang này? Hành động này không thể hoàn tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(page.id)} className="bg-red-600 hover:bg-red-700">Xóa</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
