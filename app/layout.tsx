/* eslint-disable camelcase */
import {
  ClerkProvider,
  // SignInButton,
  // SignedIn,
  // SignedOut,
  // UserButton,
} from "@clerk/nextjs";
import "./globals.css";
import "../styles/prism.css";

import React, { Suspense } from "react";

import { Inter, Space_Grotesk } from "next/font/google";
import { Metadata } from "next";
import ThemeProvider from "@/context/ThemeProvider";
import { Spinner } from "@/components/shared/Spinner";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-spaceGrotesk",
});

export const metadata: Metadata = {
  title: "DevOverflow",
  description:
    "A community-driven platform for asking and answering questions about software development. Get help, share knowledge, and collaborate with developers from around the world. Explore topics in web development, mobile app development, game development, algorithms, data structures, and more.",
  icons: {
    icon: "../public/assets/images/site-logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        <ClerkProvider
          appearance={{
            elements: {
              formButtonPrimary: "primary-gradient ",
              footerActionLink: "primary-text-gradient hover:text-primary-500",
            },
          }}
        >
          <ThemeProvider>
            <Suspense
              fallback={
                <div className="background-light900_dark200 flex h-screen flex-col items-center justify-center">
                  <p className="text-dark100_light900 flex items-center justify-center gap-1">
                    <Spinner size={"small"} />
                    Loading...
                  </p>
                </div>
              }
            >
              {children}
            </Suspense>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
