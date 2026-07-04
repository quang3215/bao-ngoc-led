"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      if (email === "lmquang28@gmail.com") {
        toast.success("Đăng nhập Admin thành công!");
        router.push("/admin");
      } else {
        toast.error("Tài khoản này không có quyền Quản trị!");
        router.push("/admin"); // Layout will kick them out to / if they bypass this
      }
    } catch (error: any) {
      console.error("Admin Auth error:", error);
      let errorMsg = "Có lỗi xảy ra!";
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        errorMsg = "Email hoặc mật khẩu không chính xác.";
      }
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      if (user.email === "lmquang28@gmail.com") {
        toast.success("Đăng nhập Admin thành công!");
        router.push("/admin");
      } else {
        toast.error("Tài khoản này không có quyền Quản trị!");
        router.push("/admin"); 
      }
    } catch (error: any) {
      console.error("Admin Google Auth error:", error);
      toast.error("Đăng nhập bằng Google thất bại hoặc bị hủy.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden p-4">
      {/* Dark theme background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-[420px] relative z-10">
        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 p-8 sm:p-10 rounded-3xl shadow-2xl">
          
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700 shadow-inner">
              <ShieldCheck className="w-8 h-8 text-purple-400" />
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-2 text-white text-center">
            Admin Portal
          </h1>
          <p className="text-slate-400 mb-8 text-center text-sm">
            Khu vực dành riêng cho Quản trị viên
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">Email Quản trị</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <Input 
                  id="email" 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com" 
                  className="pl-10 h-12 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-600 focus:border-purple-500 focus:ring-purple-500/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">Mật khẩu</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="pl-10 h-12 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-600 focus:border-purple-500 focus:ring-purple-500/20"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] mt-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Đang xác thực...
                </>
              ) : (
                "Đăng nhập hệ thống"
              )}
            </Button>

            <div className="relative !my-6 flex items-center">
              <div className="flex-grow border-t border-slate-700/50"></div>
              <span className="flex-shrink-0 mx-4 text-slate-500 text-sm">Hoặc</span>
              <div className="flex-grow border-t border-slate-700/50"></div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full h-12 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border-slate-600 shadow-sm font-medium rounded-xl transition-all duration-300"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 mr-3" />
              Đăng nhập với Google
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <a href="/" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
              ← Quay lại cửa hàng
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
