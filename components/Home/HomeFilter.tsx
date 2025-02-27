"use client";
import { HomePageFilters } from "@/constants/filter";
import { Button } from "../ui/button";
import { useState } from "react";
import { formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

export default function HomeFilter() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("filter")
  const [active, setActive] = useState(query || "");

  const handleFilterClick = (value:string)=>{
    if (active === value) {
      setActive("")
      const newUrl = formUrlQuery({
        params:searchParams.toString(),
        key:"filter",
        value:null
      })

      router.push(newUrl,{scroll:false})
    }else {
      setActive(value)
      const newUrl = formUrlQuery({
        params:searchParams.toString(),
        key:"filter",
        value
      })

      router.push(newUrl,{scroll:false})
    }
  }
  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {HomePageFilters.map((item) => (
        <Button
          
          onClick={()=> handleFilterClick(item.value)}
          key={item.value}
          className={`${
            active === item.value
              ? "bg-primary-100 text-primary-500 dark:bg-dark-400"
              : "bg-light-800 text-light-500 dark:bg-dark-300 dark:text-light-500"
          } body-medium h-9 rounded-lg px-6 py-0 capitalize shadow-none`}
        >
          {item.name}
        </Button>
      ))}
    </div>
  );
}
