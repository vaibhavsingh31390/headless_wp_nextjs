import type { Metadata } from "next";
import "@/styles/globals.css";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "A headless WordPress website",
  description: "This is a Next.js headless WordPress website.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`wp-body ${roboto.className}`}>{children}</body>
    </html>
  );
}
