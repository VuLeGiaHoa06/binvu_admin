"use client";
import Image from "next/image";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

import { navLinks } from "@/lib/constant";
import { CircleUserRound } from "lucide-react";
import logo from "@/public/logo.png";

const LeftSideBar = () => {
  const { user } = useUser();
  const pathname = usePathname();
  return (
    <div className="h-screen flex flex-col w-[300px] left-0 top-0 sticky max-lg:hidden bg-blue-2 shadow-xl p-10 gap-12">
      <Link href={"/"}>
        <Image
          src={logo}
          alt="logo"
          width={200}
          height={200}
          className="w-[200px] h-[100px]  object-cover"
        />
      </Link>

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

      <Link href={"/sign-in"} className="flex gap-4 items-center">
        {user ? <UserButton /> : <CircleUserRound />}
        <span className="text-body-medium">Edit profile</span>
      </Link>
    </div>
  );
};

export default LeftSideBar;
