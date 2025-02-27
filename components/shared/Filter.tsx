"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface Props {
  filters: { name: string; value: string }[];
  containerClasses?: string;
  otherClasses?: string;
}

export default function Filter({
  filters,
  containerClasses,
  otherClasses,
}: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paramsFilter = searchParams.get("filter");

  const handleUpdateParams = (value: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "filter",
      value,
    });

    router.push(newUrl, { scroll: false });
  };
  return (
    <div className={`relative ${containerClasses}`}>
      <Select onValueChange={handleUpdateParams} defaultValue={paramsFilter || ""}>
        <SelectTrigger
          className={`${otherClasses} body-regular background-light800_dark300 light-border text-dark500_light700 min-h-[56px] border px-4 py-2.5 focus:ring-0 focus:ring-offset-1`}
        >
          <SelectValue placeholder="Select Filter" />
        </SelectTrigger>
        <SelectContent className="text-dark500_light700 small-regular border-none bg-light-900 dark:bg-dark-300">
          <SelectGroup>
            {filters.map((filter) => (
              <SelectItem
                value={filter.value}
                key={filter.value}
                className="cursor-pointer focus:bg-light-800 dark:focus:bg-dark-400"
              >
                {filter.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
