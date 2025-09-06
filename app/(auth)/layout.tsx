import type { Metadata } from "next";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "BinVu - Admin Auth",
  description: "Admin auth to manage BinVu's data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
