"use client";
import { formUrlQuery } from "@/lib/utils";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";

function Pagination({ pageNum, isNext,forItem }: { pageNum: number; isNext: boolean,forItem?:string  }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleNavigation = (direction: "prev" | "next") => {
    
    const nextPageNum = direction === "prev" ? pageNum - 1 : pageNum + 1;
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: forItem ? `pageFor${forItem}` : "page"  ,
      value: nextPageNum.toString(),
    });

    router.push(newUrl);
  };

  if (!isNext && pageNum === 1) return null;
  
  return (
    <div className="flex w-full items-center justify-center gap-2">
      <Button
        className="light-border-2 btn flex min-h-[36px] items-center justify-center border"
        disabled={pageNum === 1}
        onClick={() => handleNavigation("prev")}
      >
        <p className="body-medium text-dark200_light800">Prev</p>
      </Button>
      <div className="flex min-h-[36px] items-center justify-center rounded-md bg-primary-500 px-3.5">
        <p className="body-semibold text-light-900">{pageNum}</p>
      </div>
      <Button
        className="light-border-2 btn flex min-h-[36px] items-center justify-center border"
        disabled={!isNext}
        onClick={() => handleNavigation("next")}
      >
        <p className="body-medium text-dark200_light800">Next</p>
      </Button>
    </div>
  );
}

export default Pagination;
