"use client";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import GlobalResult from "./GlobalResult";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("global");
  const [search, setSearch] = useState(query || "");
  const pathname = usePathname();
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (
        searchContainerRef.current &&
        // @ts-ignore
        !searchContainerRef.current.contains(e.target)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };

    setIsOpen(false);

    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, [pathname]);

  useEffect(() => {
    const debounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "global",
          value: search,
        });

        router.push(newUrl, { scroll: false });
      } else {
        // may be add if (query)
        // if (query) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ["global", "type"],
          });

          router.push(newUrl, { scroll: false });
        
      }

      return () => clearTimeout(debounceFn);
    }, 300);
  }, [query, searchParams, pathname, search, router]);

  return (
    <div
      ref={searchContainerRef}
      className="relative w-full max-w-[600px] max-lg:hidden"
    >
      <div className="background-light800_darkgradient flex min-h-[56px] grow items-center rounded-xl px-4 focus-within:ring-1 focus-within:ring-light-700 focus-within:dark:ring-dark-400">
        <Image
          src="/assets/icons/search.svg"
          alt="search"
          width={20}
          height={20}
          className="cursor-pointer"
        />
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);

            if (!isOpen) {
              setIsOpen(true);
            }

            if (isOpen && e.target.value === "") {
              setIsOpen(false);
            }
          }}
          placeholder="Search globally..."
          className="text-dark400_light700 placeholder paragraph-regular no-focus border-none bg-transparent shadow-none outline-none"
        />
      </div>
      {isOpen && <GlobalResult />}
    </div>
  );
}
