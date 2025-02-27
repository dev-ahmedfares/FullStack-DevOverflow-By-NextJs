"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Input } from "../../ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

interface Props {
  route: string;
  iconPosition?: string;
  imgSrc: string;
  placeholder: string;
  otherClasses: string;
}

export default function LocalSearch({
  route,
  iconPosition = "left",
  imgSrc,
  placeholder,
  otherClasses,
}: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const query = searchParams.get("q")
  const [search, setSearch] = useState(query || "");
  
  useEffect(() => {
    const debounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "q",
          value: search,
        });
        
        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ["q"],
          });

          router.push(newUrl, { scroll: false });
        }
      }
    }, 300);

    return ()=> clearTimeout(debounceFn)
  }, [search, router, pathname, searchParams, route]);

  return (
    <div
      className={`background-light800_darkgradient flex min-h-[56px] w-full flex-1 items-center gap-2 rounded-[10px] px-4 ${otherClasses} ${iconPosition === "right" && "flex-row-reverse"}`}
    >
      <Image
        src={imgSrc}
        alt="local search"
        width={24}
        height={24}
        className="cursor-pointer"
      />

      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        type="text"
        placeholder={placeholder}
        className="text-dark400_light700 paragraph-regular no-focus placeholder border-none bg-transparent shadow-none outline-none"
      />
    </div>
  );
}
