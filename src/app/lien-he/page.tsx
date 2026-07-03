import { Metadata } from "next";
import { Mail, MapPin, Phone, Clock, Send, ShieldCheck, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Liên Hệ | CÔNG TY CP GIẢI PHÁP CHIẾU SÁNG BẢO NGỌC",
  description: "Liên hệ với Bảo Ngọc LED để được tư vấn giải pháp chiếu sáng, báo giá dự án và hỗ trợ kỹ thuật tận tâm.",
};

export default async function ContactPage() {
  let hotline = "0936 668 583";
  let email = "contact@baongocled.com";
  let address = "Số 11, Phố Phùng Khắc Khoan, Phường Hai Bà Trưng, Thành phố Hà Nội";

  try {
    const docSnap = await getDoc(doc(db, "settings", "general"));
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.hotline) hotline = data.hotline;
      if (data.footer?.email) email = data.footer.email;
      if (data.footer?.address) address = data.footer.address;
    }
  } catch (error) {
    console.error("Error fetching contact info:", error);
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans selection:bg-primary/20">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] mix-blend-multiply opacity-60"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] mix-blend-multiply opacity-50"></div>
        </div>

        <div className="container relative z-10 max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-white/50 shadow-sm mb-6 text-primary font-semibold text-sm tracking-wide uppercase">
            <Building2 className="h-4 w-4" />
            Bảo Ngọc LED
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Liên Hệ Với <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Chúng Tôi</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            Chúng tôi luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của bạn. Từ tư vấn dự án lớn đến hỗ trợ kỹ thuật nhà thông minh.
          </p>
        </div>
      </section>

      <section className="container max-w-6xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Contact Information Cards */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Thông Tin Liên Hệ</h2>
            
            <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-8 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/20 transition-all duration-500"></div>
              
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-primary/30">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Trụ Sở Chính</h3>
              <p className="text-slate-600 font-medium">{address}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-8 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-500/30">
                  <Phone className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Hotline (Zalo)</h3>
                <p className="text-slate-600 font-medium text-lg">{hotline}</p>
              </div>

              <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-8 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-orange-500/30">
                  <Mail className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Email</h3>
                <p className="text-slate-600 font-medium break-all">{email}</p>
              </div>
            </div>

            <div className="bg-slate-900 rounded-[2rem] p-8 shadow-xl text-white relative overflow-hidden">
              <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-primary/30 rounded-full blur-3xl"></div>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <Clock className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Giờ Làm Việc</h3>
                  <p className="text-slate-300 text-sm">Hỗ trợ nhanh chóng</p>
                </div>
              </div>
              <ul className="space-y-2 mt-6">
                <li className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-300">Thứ 2 - Thứ 6:</span>
                  <span className="font-semibold">08:00 - 18:00</span>
                </li>
                <li className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-300">Thứ 7:</span>
                  <span className="font-semibold">08:00 - 12:00</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-300">Chủ Nhật:</span>
                  <span className="font-semibold text-primary-foreground">Nghỉ</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12 border border-white shadow-[0_20px_60px_rgb(0,0,0,0.05)] h-full">
              <div className="mb-8 border-b border-slate-100 pb-6">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Gửi Tin Nhắn</h2>
                <p className="text-slate-500 font-medium">Vui lòng điền thông tin, chuyên viên của chúng tôi sẽ liên hệ lại sớm nhất.</p>
              </div>

              <ContactForm />

              <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1 mt-4">
                <ShieldCheck className="h-3 w-3" /> Thông tin của bạn được bảo mật an toàn.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Map Section */}
      <section className="container max-w-6xl mx-auto px-4 mt-20 relative z-10">
        <div className="rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_rgb(0,0,0,0.05)] border border-slate-100 h-[400px] relative bg-slate-200">
          {/* Simple embed placeholder or actual iframe */}
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.3642398460613!2d105.8459461!3d21.0180429!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab8e7dc8cdbb%3A0xc6fbef1a8a29a008!2zMTEgUC4gUGjDuW5nIEto4bqvYyBLaG9hbiwgTmfDtSBUaMOsIE5o4bqtbSwgSGFpIELDoCBUcsawbmcsIEjDoCBO4buZaSwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 grayscale contrast-125 opacity-80 mix-blend-multiply hover:grayscale-0 hover:opacity-100 hover:mix-blend-normal transition-all duration-700"
          ></iframe>
        </div>
      </section>
    </div>
  );
}
