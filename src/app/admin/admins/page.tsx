"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UserCog, Plus, Trash2, Mail, Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import { ROOT_ADMIN } from "../layout";

export default function AdminManagementPage() {
  const [emails, setEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const adminDoc = await getDoc(doc(db, "settings", "admins"));
      if (adminDoc.exists() && adminDoc.data().emails) {
        setEmails(adminDoc.data().emails);
      } else {
        // Init with root admin if empty
        setEmails([ROOT_ADMIN]);
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
      toast.error("Không thể tải danh sách Admin");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newEmail.includes("@")) {
      toast.error("Vui lòng nhập một email hợp lệ!");
      return;
    }

    const emailToAdd = newEmail.toLowerCase().trim();
    if (emails.includes(emailToAdd)) {
      toast.error("Email này đã là Admin rồi!");
      return;
    }

    setIsSaving(true);
    try {
      const newAdminList = [...emails, emailToAdd];
      await setDoc(doc(db, "settings", "admins"), { emails: newAdminList }, { merge: true });
      setEmails(newAdminList);
      setNewEmail("");
      toast.success(`Đã cấp quyền Admin cho ${emailToAdd}`);
    } catch (error) {
      console.error("Error adding admin:", error);
      toast.error("Thêm Admin thất bại");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveAdmin = async (emailToRemove: string) => {
    if (emailToRemove === ROOT_ADMIN) {
      toast.error("Không thể xóa tài khoản Quản trị tối cao!");
      return;
    }
    
    if (emailToRemove === user?.email) {
      toast.error("Bạn không thể tự xóa quyền của chính mình ở đây!");
      return;
    }

    if (!confirm(`Bạn có chắc muốn tước quyền Admin của ${emailToRemove}?`)) {
      return;
    }

    setIsSaving(true);
    try {
      const newAdminList = emails.filter(e => e !== emailToRemove);
      await setDoc(doc(db, "settings", "admins"), { emails: newAdminList }, { merge: true });
      setEmails(newAdminList);
      toast.success(`Đã tước quyền Admin của ${emailToRemove}`);
    } catch (error) {
      console.error("Error removing admin:", error);
      toast.error("Xóa Admin thất bại");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <UserCog className="h-8 w-8 text-[#4A238B]" />
          Quản lý Quản trị viên
        </h1>
        <p className="text-slate-500 mt-2">
          Thêm hoặc xóa các tài khoản email được phép truy cập vào trang Admin. Bất kỳ ai sở hữu email trong danh sách này đều có toàn quyền quản trị website.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
        <form onSubmit={handleAddAdmin} className="space-y-4 bg-slate-50 p-6 rounded-lg border">
          <div>
            <Label className="text-base font-bold text-slate-800">Thêm Quản trị viên mới</Label>
            <p className="text-sm text-slate-500 mb-3">Nhập email Google của người bạn muốn cấp quyền.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input 
                type="email" 
                placeholder="Ví dụ: nhanvien@gmail.com" 
                className="pl-10 h-12"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                disabled={isSaving}
              />
            </div>
            <Button type="submit" disabled={isSaving || !newEmail} className="h-12 bg-[#4A238B] hover:bg-[#381b6c] gap-2">
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
              Cấp quyền
            </Button>
          </div>
        </form>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            Danh sách Admin hiện tại ({emails.length})
          </h2>
          
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Tài khoản Email</th>
                  <th className="px-4 py-3 font-semibold w-32 text-center">Phân quyền</th>
                  <th className="px-4 py-3 font-semibold w-24 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {emails.map((email, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900 flex items-center gap-2">
                        {email}
                        {email === user?.email && (
                          <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">Bạn</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {email === ROOT_ADMIN ? (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded font-semibold whitespace-nowrap">
                          Tối cao (Root)
                        </span>
                      ) : (
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-semibold whitespace-nowrap">
                          Admin
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {email !== ROOT_ADMIN && email !== user?.email ? (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                          onClick={() => handleRemoveAdmin(email)}
                          disabled={isSaving}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      ) : (
                        <div className="w-8 h-8 inline-block" /> // Placeholder to keep alignment
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-start gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p><strong>Lưu ý:</strong> Tài khoản Tối cao (Root) được cấu hình để bảo vệ website của bạn, không thể bị xóa bởi bất kỳ ai.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
