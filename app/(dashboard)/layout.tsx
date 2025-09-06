import type { Metadata } from "next";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";

import { LeftSideBar, TopBar } from "@/components/layout";
import ToasterProvider from "@/lib/ToasterProvider";

export const metadata: Metadata = {
  title: "BinVu - Admin",
  description: "Admin dashboard to manage BinVu's data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <ToasterProvider />
          <div className="flex max-lg:flex-col text-grey-1">
            <LeftSideBar />
            <TopBar />
            <div className="flex-1">{children}</div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
