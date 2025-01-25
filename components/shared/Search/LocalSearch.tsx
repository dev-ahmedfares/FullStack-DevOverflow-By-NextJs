import Image from "next/image";
import React from "react";
import { Input } from "../../ui/input";

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
  return (
    <div className={`background-light800_darkgradient flex flex-1 min-h-[56px] w-full items-center gap-2 rounded-[10px] px-4 ${otherClasses} ${iconPosition === "right" && "flex-row-reverse"}`}>
      <Image
        src={imgSrc}
        alt="local search"
        width={24}
        height={24}
        className="cursor-pointer"
      />

      <Input
        type="text"
        placeholder={placeholder}
        className="text-dark400_light700 paragraph-regular no-focus placeholder border-none bg-transparent shadow-none outline-none"
      />
    </div>
  );
}
