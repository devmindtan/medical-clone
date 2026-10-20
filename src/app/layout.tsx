import type { Metadata } from "next";
import "./globals.css";
import "./inner-pages.css";

export const metadata: Metadata = {
  title: "Trang chủ - Thiết bị y tế",
  description: "MEDICAL cung cấp các giải pháp kỹ thuật hiện đại, hoàn chỉnh, chuyên sâu trong lĩnh vực y tế.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
    >
      <body>{children}</body>
    </html>
  );
}
