"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CheckCircle, Clock, Trash2, MailOpen, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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

interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  status: "new" | "read";
  createdAt: any;
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchContacts = async () => {
    try {
      const q = query(collection(db, "contacts"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Contact[];
      setContacts(data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error("Không thể tải danh sách tin nhắn");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const markAsRead = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "new" ? "read" : "new";
    try {
      await updateDoc(doc(db, "contacts", id), { status: newStatus });
      setContacts(contacts.map(c => c.id === id ? { ...c, status: newStatus } : c));
      toast.success(newStatus === "read" ? "Đã đánh dấu là đã đọc" : "Đã đánh dấu là chưa đọc");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Có lỗi xảy ra");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "contacts", id));
      setContacts(contacts.filter(c => c.id !== id));
      toast.success("Đã xóa tin nhắn");
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error("Có lỗi xảy ra khi xóa");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tin Nhắn Khách Hàng</h1>
          <p className="text-slate-500 mt-1">Quản lý các yêu cầu liên hệ từ website</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {contacts.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Mail className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">Chưa có tin nhắn nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4">Khách hàng</th>
                  <th className="px-6 py-4">Liên hệ</th>
                  <th className="px-6 py-4 w-1/3">Nội dung</th>
                  <th className="px-6 py-4">Thời gian</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {contacts.map((contact) => (
                  <tr key={contact.id} className={`hover:bg-slate-50 transition-colors ${contact.status === 'new' ? 'bg-blue-50/30' : ''}`}>
                    <td className="px-6 py-4">
                      {contact.status === "new" ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <span className="w-2 h-2 mr-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                          Mới
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                          Đã xem
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{contact.name}</div>
                    </td>
                    <td className="px-6 py-4 space-y-1">
                      <div className="font-medium text-slate-700">{contact.phone}</div>
                      {contact.email && <div className="text-xs text-slate-500">{contact.email}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-600 line-clamp-2" title={contact.message}>{contact.message}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {contact.createdAt ? format(contact.createdAt.toDate(), "dd/MM/yyyy HH:mm", { locale: vi }) : "Vừa xong"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => markAsRead(contact.id, contact.status)}
                          title={contact.status === "new" ? "Đánh dấu đã đọc" : "Đánh dấu chưa đọc"}
                          className={contact.status === "new" ? "text-blue-600" : "text-slate-400"}
                        >
                          {contact.status === "new" ? <CheckCircle className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              title="Xóa"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Xác nhận xoá tin nhắn</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn có chắc muốn xóa tin nhắn này? Hành động này không thể hoàn tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(contact.id)} className="bg-red-600 hover:bg-red-700">Xóa</AlertDialogAction>
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
