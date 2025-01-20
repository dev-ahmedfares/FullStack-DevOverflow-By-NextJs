"use client";
import { HomePageFilters } from "@/constants/filter";
import { Button } from "../ui/button";
import { useState } from "react";

export default function HomeFilter() {
  const [active, setActive] = useState("");
  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {HomePageFilters.map((item) => (
        <Button
          // TODO Fix this
          onClick={()=> setActive("")}
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
