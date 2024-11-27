"use client"
import { sidebarLinks } from "@/constants";
import { SignedOut } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

export default function LeftSidebar() {
    const pathname = usePathname()
  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:min-w-[266px]">
      <div className="flex flex-1 flex-col gap-3">
      {sidebarLinks.map((link) => {
        const isActive =
          pathname === link.route ||
          (pathname.includes(link.route) && link.route.length > 1);

        // TODO profile hidden at not signed in

        return (
          <Link
            key={link.imgURL}
            href={link.route}
            className={`${isActive ? "primary-gradient rounded-lg text-light-900" : "text-dark300_light900"} flex items-center  gap-4 bg-transparent  p-4`}
          >
            <Image
              src={link.imgURL}
              alt={link.label}
              width={20}
              height={20}
              
              className={`${isActive ? "" : "invert-colors"} `}
            />
            <p className={`${isActive ? "base-semibold" : "base-bold"} max-lg:hidden`}>
              {link.label}
            </p>
          </Link>
        );
      })}
    </div>
    <SignedOut>
          <div className="flex flex-col gap-3">
            
              <Link href="/sign-in">
                <Button className="btn-secondary small-medium min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                <Image
                    src="/assets/icons/account.svg"
                    alt="sign up"
                    width={20}
                    height={20}
                    className="invert-colors lg:hidden"
                />
                    <span className="primary-text-gradient max-lg:hidden">Log In</span>
                </Button>
              </Link>
            
           
              <Link href="/sign-up">
                <Button className="btn-tertiary light-border-2 text-dark400_light900 small-medium min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                <Image
                    src="/assets/icons/sign-up.svg"
                    alt="sign up"
                    width={20}
                    height={20}
                    className="invert-colors lg:hidden"
                />
                <span className="max-lg:hidden">Sign Up</span>
                </Button>
              </Link>
            
          </div>
        </SignedOut>
    </section>
  );
}
