import { Input } from "@/components/ui/input"
import Image from "next/image"


export default function GlobalSearch() {
  return (
    <div className="relative max-w-[600px] w-full max-lg:hidden">
        <div className="background-light800_darkgradient flex items-center min-h-[56px] grow px-4 rounded-xl focus-within:ring-1 focus-within:dark:ring-dark-400 focus-within:ring-light-700">
        <Image
            src="/assets/icons/search.svg"
            alt="search"
            width={20}
            height={20}
            className="cursor-pointer"
        />
        <Input
            placeholder="Search globally..."
         className="text-dark400_light700 placeholder paragraph-regular bg-transparent border-none outline-none shadow-none no-focus"/>
    </div>
    </div>

  )
}
