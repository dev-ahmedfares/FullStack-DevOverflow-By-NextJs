"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import { SignedOut } from "@clerk/nextjs";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileSidebar() {
  return (
        <Sheet>
    

      <SheetTrigger asChild>
        <Image
          src="/assets/icons/hamburger.svg"
          alt="hamburger"
          width={36}
          height={36}
          className="invert-colors cursor-pointer sm:hidden"
        />
      </SheetTrigger>
      
      <SheetContent
        side={"left"}
        className="h-dvh max-h-screen overflow-y-auto background-light900_dark200 border-none flex flex-col"
      >
        <SheetTitle className="mt-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={"./assets/images/site-logo.svg"}
              width={23}
              height={23}
              alt="DevOverflow"
            />
            <p className="h2-bold font-spaceGrotesk text-dark-100 dark:text-light-900">
              Dev<span className="text-primary-500">Overflow</span>
            </p>
          </Link>
        </SheetTitle>

        <div className="mt-8">
          <SheetClose asChild>
            <NavContent />
          </SheetClose>
        </div>
        <SignedOut>
          <div className="flex flex-col gap-4 mt-auto">
            <SheetClose asChild>
                <Link href="/sign-in">
                    <Button className="btn-secondary w-full rounded-lg px-4 py-3 min-h-[41px] small-medium shadow-none">
                        <span className="primary-text-gradient">Log In</span>
                    </Button>
                </Link>
            </SheetClose>
            <SheetClose asChild>
                <Link href="/sign-up">
                    <Button className="btn-tertiary light-border-2 text-dark400_light900 w-full rounded-lg px-4 py-3 min-h-[41px] small-medium shadow-none">
                        Sign Up         
                    </Button>
                </Link>
            </SheetClose>
          </div>
        </SignedOut>
      </SheetContent>
      
    </Sheet>
  );
}

const NavContent = () => {
  const pathname = usePathname();
  console.log(pathname);
  return (
    <section className="flex h-full flex-col gap-1">
      {sidebarLinks.map((link) => {
        const isActive =
          pathname === link.route ||
          (pathname.includes(link.route) && link.route.length > 1);
        return (
          <Link
            key={link.imgURL}
            href={link.route}
            className={`${isActive ? "primary-gradient rounded-lg text-light-900" : "text-dark300_light900"} flex items-center gap-4 bg-transparent p-4`}
          >
            <Image
              src={link.imgURL}
              alt={link.label}
              width={20}
              height={20}
              className={`${!isActive ? "invert-colors" : ""}`}
            />
            <p className={`${isActive ? "base-semibold" : "base-bold"}`}>
              {link.label}
            </p>
          </Link>
        );
      })}
    </section>
  );
};
