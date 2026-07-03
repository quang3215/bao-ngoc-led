import Link from "next/link";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParamsResolved = await searchParams;
  const orderId = searchParamsResolved.id as string || "UNKNOWN";

  return (
    <div className="bg-slate-50 min-h-screen py-16 md:py-24 flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 text-center">
        
        <div className="flex justify-center mb-6">
          <div className="h-24 w-24 bg-green-50 rounded-full flex items-center justify-center relative">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20" />
            <CheckCircle2 className="h-12 w-12 text-green-500 relative z-10" />
          </div>
        </div>

        <h1 className="text-3xl font-black text-slate-900 mb-4">Đặt Hàng Thành Công!</h1>
        <p className="text-slate-600 text-lg leading-relaxed mb-6">
          Cảm ơn bạn đã tin tưởng và mua sắm tại Bảo Ngọc LED.<br/>
          Đơn hàng của bạn đã được ghi nhận và đang chờ xử lý.
        </p>

        <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left border border-slate-100 inline-block w-full max-w-sm">
          <div className="text-sm text-slate-500 mb-1">Mã đơn hàng của bạn:</div>
          <div className="text-xl font-mono font-bold text-primary tracking-wider uppercase">
            #{orderId.slice(0, 8)}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="h-14 px-8 font-bold text-base rounded-full shadow-lg shadow-primary/25">
            <Link href="/danh-muc/tat-ca">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Tiếp tục mua sắm
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-14 px-8 font-bold text-base rounded-full border-slate-200 text-slate-700 hover:bg-slate-50">
            <Link href="/">
              Về trang chủ <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

      </div>
    </div>
  );
}
