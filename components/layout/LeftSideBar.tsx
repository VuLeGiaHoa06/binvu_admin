"use client";
import Image from "next/image";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

import { navLinks } from "@/lib/constant";
import { CircleUserRound } from "lucide-react";

const LeftSideBar = () => {
  const { user } = useUser();
  const pathname = usePathname();
  return (
    <div className="h-screen flex flex-col w-[300px] left-0 top-0 sticky max-lg:hidden bg-blue-2 shadow-xl p-10 gap-16">
      <Image src={"/logo.png"} alt="logo" width={200} height={200} />

      <div className="flex flex-col gap-12">
        {navLinks.map((link) => (
          <Link
            href={link.url}
            className={`flex gap-4 text-body-medium items-center ${
              pathname === link.url ? "text-blue-1" : ""
            }`}
            key={link.label}
          >
            <span>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex gap-4 items-center">
        {user ? (
          <UserButton />
        ) : (
          <Link href={"/sign-in"}>
            <CircleUserRound />
          </Link>
        )}
        <span className="text-body-medium">Edit profile</span>
      </div>
    </div>
  );
};

export default LeftSideBar;
