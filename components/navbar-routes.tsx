"use client";

import { UserButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

export const NavbarRoutes = () => {
  const pathname = usePathname();

  // constants that change content of nav bar based on their values
  const isTeacherPage = pathname?.startsWith("/teacher"); // for teacher mode
  const isPlayerPage = pathname?.includes("/chapter"); // individual course page - this means we will not
  // have normal sidebar, we will have sidebar with chapters of course

  return (
    <div className="flex gap-x-2 ml-auto">
      {isTeacherPage || isPlayerPage ? (
        <Link href="/">
          <Button size={"sm"} variant={"ghost"}>
            <LogOut className="h-4 w-4 mr-2" />
            Exit
          </Button>
        </Link>
      ) : (
        <Link href="/teacher/courses">
          <Button size={"sm"} variant={"ghost"}>
            Teacher mode
          </Button>
        </Link>
      )}
      <UserButton />
    </div>
  );
};
