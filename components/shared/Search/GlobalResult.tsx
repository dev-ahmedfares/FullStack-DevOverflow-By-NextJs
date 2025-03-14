"use client"
import { useEffect, useState } from "react";
import GlobalFilters from "./GlobalFilters";
import { ReloadIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { globalSearch } from "@/lib/actions/global.action";
import { toast } from "sonner";

function GlobalResult() {
  const searchParams = useSearchParams();
  // May make issus  show loading after no results second
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState([]);

  const global = searchParams.get("global");
  const type = searchParams.get("type");

  useEffect(() => {
    const fetchResult = async () => {
      setResult([]);
      setIsLoading(true);
      try {
        // ts-ignore
        const results = await globalSearch({
          query: global,
          type,
        });

        if (typeof results !== "string" && results?.error) {
          toast.error(results?.error);
        } else if (typeof results === "string") {
          setResult(JSON.parse(results));
        }

      } finally {
        setIsLoading(false);
      }
    };

    if (global) {
      fetchResult();
    }
  }, [global, type]);

  const renderLink = (type: string, id: string) => {
    switch (type) {
      case "question":
      case "answer":
        return `/question/${id}`;

      case "tag":
        return `/tags/${id}`;

      case "user":
        return `/profile/${id}`;

      default:
        return "/";
    }
  };

  return (
    <div className="absolute z-10 mt-3 w-full rounded-xl bg-light-800 py-5 shadow-sm dark:bg-dark-400">
      <div className="text-dark400_light900 paragraph-semibold px-5">
        <GlobalFilters />
      </div>
      <div className="my-5 h-px bg-light-700/50 dark:bg-dark-500/50"></div>
      <div className="space-y-5">
        <p className="text-dark400_light900 paragraph-semibold px-5">
          Top Match
        </p>
        {isLoading ? (
          <div className="flex-center flex-col px-5">
            <ReloadIcon className="my-2 animate-spin text-primary-500" />
            <p className="text-dark200_light800 body-regular">Loading...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {result.length > 0 ? (
              result.map((item: any, idx) => (
                <Link
                  className="flex w-full cursor-pointer items-start gap-3 px-5 py-2.5 hover:bg-light-700/50 dark:hover:bg-dark-500/50"
                  key={item.type + item.id + idx}
                  href={renderLink(item.type, item.id)}
                >
                  <Image
                    width={18}
                    height={18}
                    src="/assets/icons/tag.svg"
                    alt="tag"
                    className="invert-colors mt-1 object-contain"
                  />
                  <div className="flex flex-col">
                    <p className="body-medium text-dark200_light800 line-clamp-1">
                      {item.title}
                    </p>
                    <p className="text-light400_light500 small-medium mt-1 font-bold capitalize">
                      {item.type}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex-center flex-col px-5">
                <p className="text-dark200_light800 body-regular px-5 py-2.5">
                  Oops! No result found.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default GlobalResult;
