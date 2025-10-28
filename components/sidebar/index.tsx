"use client";
import { Image } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { FaFileInvoice, FaHome } from "react-icons/fa";

import { useUser } from "@/contexts/userContext";

type SidbarItem = {
  name: string;
  href: string;
  icon?: React.ReactNode;
};

const SideBar = () => {
  const links: SidbarItem[] = [
    { name: "Home", href: "/admin", icon: <FaHome /> },
    { name: "Packages", href: "/admin/packages", icon: <FaFileInvoice /> },
    { name: "Addons", href: "/admin/addons", icon: <FaFileInvoice /> },
    { name: "Quotations", href: "/admin/quotations", icon: <FaFileInvoice /> },
    { name: "Gallery", href: "/admin/gallery", icon: <Image /> },
    // Add more links as needed
  ];
  // Get the first segment of the path
  const path = usePathname();

  const containerVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="hidden sm:flex sm:w-64 h-full bg-primary/85 min-h-screen text-white p-4 fixed flex-col justify-between">
      <div>
        {links.map((link, index) => (
          <div key={index}>
            <Link
              href={link.href}
              className={`${
                path === link.href ? " bg-secondary" : " bg-secondary/20"
              } p-4 hover:bg-secondary/50 cursor-pointer flex items-center space-x-3 rounded-md my-4 transition-all duration-300`}
            >
              <div className="text-2xl">{link.icon}</div>
              <h1 className="text-md font-semibold">{link.name}</h1>
            </Link>
          </div>
        ))}
      </div>

      <div></div>
    </div>
  );
};

export default SideBar;
