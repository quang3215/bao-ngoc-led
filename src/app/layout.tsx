import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StorefrontLayout } from "@/components/layout/storefront-layout";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["vietnamese", "latin"],
});

export const metadata: Metadata = {
  title: "Bảo Ngọc LED - Thiết bị chiếu sáng Rạng Đông",
  description: "Đại lý phân phối thiết bị chiếu sáng, nhà thông minh và vật tư điện Rạng Đông chính hãng với mức chiết khấu tốt nhất thị trường.",
  openGraph: {
    title: "Bảo Ngọc LED - Tổng kho thiết bị điện",
    description: "Đại lý phân phối thiết bị chiếu sáng, nhà thông minh và vật tư điện Rạng Đông chính hãng.",
    url: "https://baongocled.vn",
    siteName: "Bảo Ngọc LED",
    images: [
      {
        url: "https://baongocled.vn/logo.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
};

import { Toaster } from "@/components/ui/sonner";
import { GoogleAnalytics } from "@next/third-parties/google";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <StorefrontLayout>{children}</StorefrontLayout>
        <Toaster richColors position="top-right" />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
