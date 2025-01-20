import { 
  // SignedOut, SignInButton,
   SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Theme from "./Theme";
import GlobalSearch from "../Search/GlobalSearch";
import MobileSidebar from "./MobileSidebar";

export default function Navbar() {
  return (
    <nav className="flex-between fixed w-full background-light900_dark200 p-6 sm:px-12  shadow-light-300 dark:shadow-none z-50">
      <Link href={"/"} className="flex gap-1 items-center ">
        <Image
          src={"./assets/images/site-logo.svg"}
          width={23}
          height={23}
          alt="DevOverflow logo"
        />
        <p className="h2-bold font-spaceGrotesk text-dark-100 dark:text-light-900 max-sm:hidden">
          Dev<span className="text-primary-500">Overflow</span>
        </p>
      </Link>

      <GlobalSearch/>


      <div className="flex gap-3">
      <Theme/>

        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-8 w-8",
              },
              variables: {
                colorPrimary: "#ff7000",
              },
            }}
          />
        </SignedIn>

      <MobileSidebar/>
      
      </div>

    </nav>
  );
}
