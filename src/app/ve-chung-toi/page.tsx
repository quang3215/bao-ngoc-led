import { Metadata } from "next";
import Image from "next/image";
import { Building2, Lightbulb, ShieldCheck, Target, Users, Zap, CheckCircle2, Factory, TrendingUp, Handshake, Medal, Shield, Clock, MapPin, Check, PhoneCall } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hồ Sơ Năng Lực | CÔNG TY CP GIẢI PHÁP CHIẾU SÁNG BẢO NGỌC",
  description: "Bảo Ngọc LED - Cung cấp giải pháp chiếu sáng toàn diện, thi công dự án lớn, Smart Home và phân phối bán lẻ thiết bị điện.",
};

export default function AboutPage() {
  const stats = [
    { value: "5+", label: "Năm kinh nghiệm", icon: Clock },
    { value: "1000+", label: "Dự án hoàn thành", icon: Building2 },
    { value: "50+", label: "Đối tác chiến lược", icon: Handshake },
    { value: "100%", label: "Sản phẩm chính hãng", icon: ShieldCheck },
  ];

  const projects = [
    {
      title: "Tòa nhà Văn phòng & Thương mại Hạng A",
      category: "Dự án Tòa nhà",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2940&auto=format&fit=crop",
      desc: "Cung cấp toàn bộ hệ thống chiếu sáng thông minh RalliSmart và thiết bị điện dân dụng."
    },
    {
      title: "Khu Đô Thị Sinh Thái Cao Cấp",
      category: "Dự án Khu đô thị",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2940&auto=format&fit=crop",
      desc: "Lắp đặt giải pháp chiếu sáng cảnh quan, đèn LED âm trần số lượng lớn."
    },
    {
      title: "Nhà Máy Sản Xuất Công Nghệ Cao",
      category: "Dự án Công nghiệp",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2940&auto=format&fit=crop",
      desc: "Cung cấp hệ thống đèn Highbay nhà xưởng, đảm bảo tiêu chuẩn ánh sáng khắt khe."
    }
  ];

  const partners = [
    { name: "Rạng Đông", type: "Đối Tác Vàng" },
    { name: "Panasonic", type: "Đối Tác Chiến Lược" },
    { name: "Sino", type: "Đại Lý Phân Phối" },
    { name: "Cadivi", type: "Đối Tác Cung Ứng" },
    { name: "Vingroup", type: "Khách Hàng Tiêu Biểu" },
    { name: "Coteccons", type: "Đối Tác Nhà Thầu" },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans selection:bg-primary/20">
      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-white border-b border-gray-100">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />

        <div className="container relative z-10 max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-xs sm:text-sm tracking-wide uppercase mb-6">
            <ShieldCheck className="h-4 w-4" />
            Hồ Sơ Năng Lực Điện Tử (E-Profile)
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
            CÔNG TY CỔ PHẦN GIẢI PHÁP <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              CHIẾU SÁNG BẢO NGỌC
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
            Tiên phong kiến tạo không gian ánh sáng hoàn mỹ. Chúng tôi tự hào là đối tác tin cậy cung cấp giải pháp chiếu sáng toàn diện, nhà thông minh (Smart Home) và thi công cho các dự án quy mô lớn trên toàn quốc.
          </p>

          {/* Quick Contact B2B */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/lien-he" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:-translate-y-1 transition-transform">
              <Building2 className="h-5 w-5" />
              Liên hệ hợp tác Dự án
            </Link>
            <a href="tel:0936668583" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 shadow-sm hover:border-primary/50 transition-colors">
              <PhoneCall className="h-5 w-5 text-primary" />
              Hotline: 0936 668 583
            </a>
          </div>
        </div>
      </section>

      {/* 2. Stats & Milestones */}
      <section className="relative z-20 -mt-8 mb-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-slate-100">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center px-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">{stat.value}</h3>
                  <p className="text-sm md:text-base font-semibold text-slate-500 uppercase tracking-wide">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Vision & Mission */}
      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-900 to-slate-900 rounded-[2rem] p-10 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
              <Target className="h-12 w-12 text-blue-400 mb-6" />
              <h3 className="text-3xl font-black mb-4">Tầm Nhìn</h3>
              <p className="text-slate-300 text-lg leading-relaxed font-medium">
                Trở thành nhà cung cấp và thi công giải pháp chiếu sáng số 1 tại Việt Nam, mang đến hệ sinh thái sản phẩm điện thông minh (Smart Home) chuẩn quốc tế, kiến tạo nên những công trình đẳng cấp và bền vững với thời gian.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-primary to-emerald-800 rounded-[2rem] p-10 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
              <TrendingUp className="h-12 w-12 text-white/80 mb-6" />
              <h3 className="text-3xl font-black mb-4">Sứ Mệnh</h3>
              <p className="text-white/90 text-lg leading-relaxed font-medium">
                Cung cấp hệ thống sản phẩm chất lượng cao, an toàn và tiết kiệm năng lượng. Luôn đặt lợi ích của Đối tác & Khách hàng lên hàng đầu bằng dịch vụ tận tâm, chuyên nghiệp và chính sách bảo hành uy tín nhất.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Competencies */}
      <section className="py-20 relative bg-white/50">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">Năng Lực Lõi</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg font-medium">Ba trụ cột phát triển tạo nên uy tín và vị thế vững chắc của Bảo Ngọc LED trên thị trường.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Project */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white p-8 shadow-[0_20px_40px_rgb(0,0,0,0.04)] hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                <Building2 className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Dự Án B2B & Công Trình</h3>
              <p className="text-slate-600 leading-relaxed mb-6 font-medium">
                Năng lực cung ứng vật tư khổng lồ cho các siêu dự án. Đội ngũ kỹ sư dày dạn kinh nghiệm hỗ trợ bóc tách khối lượng, tư vấn thiết kế và giám sát thi công chuẩn xác.
              </p>
              <ul className="space-y-3">
                {["Cung ứng vật tư số lượng lớn", "Chiết khấu cực cao cho dự án", "Hỗ trợ bản vẽ thiết kế chiếu sáng", "Ký kết HĐ rõ ràng, minh bạch"].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0" />
                    <span className="text-slate-700 text-sm font-semibold">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Smart Home */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white p-8 shadow-[0_20px_40px_rgb(0,0,0,0.04)] hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Giải Pháp Nhà Thông Minh</h3>
              <p className="text-slate-600 leading-relaxed mb-6 font-medium">
                Tích hợp hệ sinh thái RalliSmart hiện đại. Biến mọi ngôi nhà thành không gian sống chuẩn 4.0 với khả năng tự động hóa và điều khiển bằng giọng nói tiếng Việt.
              </p>
              <ul className="space-y-3">
                {["Lắp đặt công tắc cảm ứng, không pin", "Thiết lập kịch bản thông minh", "Kết nối ổn định bằng Bluetooth Mesh", "Chuyển giao công nghệ tận nhà"].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-slate-700 text-sm font-semibold">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Retail */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white p-8 shadow-[0_20px_40px_rgb(0,0,0,0.04)] hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                <Lightbulb className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Phân Phối Toàn Quốc</h3>
              <p className="text-slate-600 leading-relaxed mb-6 font-medium">
                Hệ thống đại lý và bán lẻ trực tuyến mạnh mẽ. Mang thiết bị điện dân dụng, công nghiệp chính hãng đến tận tay người tiêu dùng với mức giá tốt nhất thị trường.
              </p>
              <ul className="space-y-3">
                {["Hàng chính hãng Rạng Đông", "Kho hàng lớn, sẵn sàng giao ngay", "Chính sách đại lý hấp dẫn", "Hỗ trợ bảo hành nhanh chóng"].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span className="text-slate-700 text-sm font-semibold">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Featured Projects Gallery */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-black mb-4">Dự Án Tiêu Biểu</h2>
              <p className="text-slate-400 text-lg max-w-2xl">Bảo Ngọc LED vinh dự được lựa chọn là nhà cung cấp vật tư thiết bị điện và chiếu sáng cho hàng loạt công trình quy mô trên cả nước.</p>
            </div>
            <Link href="/lien-he" className="shrink-0 text-primary hover:text-white font-bold inline-flex items-center gap-2 transition-colors">
              Xem hồ sơ năng lực PDF <TrendingUp className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((project, idx) => (
              <div key={idx} className="group rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 hover:border-purple-400/50 transition-all hover:-translate-y-1 shadow-lg">
                <div className="relative h-60 w-full overflow-hidden">
                  <Image src={project.image} alt={project.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">{project.category}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold mb-2 group-hover:text-purple-300 transition-colors text-white">{project.title}</h4>
                  <p className="text-slate-300 text-sm leading-relaxed">{project.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Strategic Partners */}
      <section className="py-20 bg-white">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-4">Đối Tác Chiến Lược</h2>
          <p className="text-slate-600 mb-12 text-lg">Chúng tôi đồng hành cùng các thương hiệu sản xuất thiết bị điện hàng đầu và các tập đoàn xây dựng lớn.</p>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {partners.map((partner, idx) => (
              <div key={idx} className="px-6 py-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center min-w-[150px] hover:shadow-md transition-shadow">
                <div className="font-black text-xl text-slate-800 mb-1">{partner.name}</div>
                <div className="text-xs text-primary font-bold uppercase tracking-wide">{partner.type}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Quality Commitment */}
      <section className="py-16 bg-[#4A238B]/5">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-primary/10 flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/3 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
                <Medal className="h-32 w-32 text-primary relative z-10" />
              </div>
            </div>
            <div className="md:w-2/3">
              <h2 className="text-3xl font-black text-slate-900 mb-6">Cam Kết Của Chúng Tôi</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { title: "Chất lượng 100%", desc: "Sản phẩm chính hãng, đầy đủ CO/CQ cho dự án." },
                  { title: "Bảo hành siêu tốc", desc: "Đổi mới 1-1 theo tiêu chuẩn nhà sản xuất, hỗ trợ kỹ thuật 24/7." },
                  { title: "Tiến độ chuẩn xác", desc: "Năng lực kho bãi lớn, đảm bảo cấp hàng đúng tiến độ thi công." },
                  { title: "Giá thành tối ưu", desc: "Mức chiết khấu cao nhất, tiết kiệm chi phí tối đa cho chủ đầu tư." },
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-4">
                    <Shield className="h-8 w-8 text-primary shrink-0" />
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-slate-600 text-sm">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Information Grid (Legal) */}
      <section className="py-20 bg-slate-50">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-black text-slate-900 mb-8 text-center">Thông Tin Pháp Lý</h2>
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200">
            <ul className="space-y-6 divide-y divide-slate-100">
              <li className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 pt-0">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <Factory className="h-6 w-6 text-slate-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Tên Tiếng Việt</p>
                  <p className="text-slate-900 font-bold text-lg">CÔNG TY CỔ PHẦN GIẢI PHÁP CHIẾU SÁNG BẢO NGỌC</p>
                </div>
              </li>
              <li className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 pt-6">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <Building2 className="h-6 w-6 text-slate-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Tên Quốc Tế</p>
                  <p className="text-slate-900 font-semibold text-lg">BAO NGOC LIGHTING SOLUTION JOINT STOCK COMPANY</p>
                </div>
              </li>
              <li className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 pt-6">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-6 w-6 text-slate-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Mã Số Thuế</p>
                  <p className="text-slate-900 font-bold text-lg text-primary">0109102232</p>
                  <p className="text-sm text-slate-500 mt-1">Cấp bởi: Thuế cơ sở 3 thành phố Hà Nội</p>
                </div>
              </li>
              <li className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 pt-6">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <MapPin className="h-6 w-6 text-slate-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Trụ Sở Chính</p>
                  <p className="text-slate-900 font-medium">Số 11, Phố Phùng Khắc Khoan, Phường Hai Bà Trưng, Thành phố Hà Nội</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 9. CTA */}
      <section className="py-20">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] p-12 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
            
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 relative z-10">Bắt đầu dự án của bạn cùng Bảo Ngọc LED</h2>
            <p className="text-slate-300 text-lg md:text-xl mb-10 max-w-3xl mx-auto relative z-10">
              Đội ngũ kỹ sư của chúng tôi luôn sẵn sàng hỗ trợ tư vấn thiết kế và báo giá siêu chiết khấu cho công trình của bạn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Link href="/lien-he" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold bg-primary text-white rounded-xl shadow-[0_0_20px_rgba(var(--primary),0.4)] hover:shadow-[0_0_30px_rgba(var(--primary),0.6)] hover:-translate-y-1 transition-all">
                <Building2 className="h-5 w-5" /> Gửi yêu cầu báo giá
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
