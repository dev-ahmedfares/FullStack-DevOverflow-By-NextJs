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
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";


interface Props {
  filters: { name: string; value: string }[];
  containerClasses?: string;
  otherClasses?: string;
  jobFilter?: boolean;
}

export default function Filter({
  filters,
  containerClasses,
  otherClasses,
  jobFilter,
}: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchParamKey = jobFilter ? "location" : "filter";
  const paramsFilter = searchParams.get(searchParamKey);

  const handleUpdateParams = (value: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "filter",
      value: jobFilter ? value.toLowerCase() : value,
    });

    router.push(newUrl, { scroll: false });
  };
  return (
    <div className={`relative ${containerClasses}`}>
      <Select
        onValueChange={handleUpdateParams}
        defaultValue={paramsFilter || ""}
      >
        <SelectTrigger
          className={`${otherClasses} body-regular background-light800_dark300 light-border text-dark500_light700 min-h-[56px] border px-4 py-2.5 focus:ring-0 focus:ring-offset-1`}
        >
          <SelectValue
            placeholder={jobFilter ? "Select Location" : "Select a Filter"}
          />
        </SelectTrigger>
        <SelectContent className={`text-dark500_light700 small-regular border-none bg-light-900 dark:bg-dark-300 ${
            jobFilter && "max-h-48 overflow-y-auto"
          }`}>
          <SelectGroup>
            {filters.map((filter,idx) => (
              <SelectItem
                value={filter.value}
                key={filter.value + idx}
                className="cursor-pointer focus:bg-light-800 dark:focus:bg-dark-400"
              >
                 {jobFilter && (
                  <Image
                    src={`https://flagsapi.com/${filter.value}/flat/64.png`}
                    width={16}
                    height={16}
                    alt="flag"
                    className="mr-2 inline-flex rounded-lg"
                  />
                )}
                {filter.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
