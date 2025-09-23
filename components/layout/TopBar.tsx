"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import logo from "../../public/logo.png";

import { navLinks } from "@/lib/constant";

const TopBar = () => {
  const [dropdownMenu, setdropdownMenu] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="sticky top-0 z-20 w-full px-8 py-4 shadow-xl flex justify-between lg:hidden bg-blue-2">
      <Image
        className="object-contain cursor-pointer w-[150px] h-[100px]"
        src={logo}
        alt="logo"
        width={150}
        height={100}
        onClick={() => router.push("/")}
      />

      <div className="flex gap-4 max-md:hidden">
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

      <div className="flex gap-4 items-center relative">
        <Menu
          size={24}
          className="md:hidden cursor-pointer"
          onClick={() => setdropdownMenu((prev) => !prev)}
        />
        {dropdownMenu && (
          <div className="flex flex-col md:hidden gap-6 absolute top-[70px] right-[50px] bg-white p-6 text-grey-1 text-body-semibold rounded-lg shadow-xl">
            {navLinks.map((link) => (
              <Link
                href={link.url}
                className={`flex gap-4  items-center ${
                  pathname === link.url ? "text-blue-1" : ""
                }`}
                key={link.label}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        )}

        <UserButton />
      </div>
    </div>
  );
};

export default TopBar;
