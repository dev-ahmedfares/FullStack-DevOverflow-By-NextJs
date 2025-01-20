"use client";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  // MenubarSeparator,
  // MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { themes } from "@/constants";
import { useTheme } from "@/context/ThemeProvider";
import Image from "next/image";

export default function Theme() {
  const { mode, setMode } = useTheme();
  return (
    <Menubar className="relative border-none bg-transparent shadow-none me-[-10px]">
      <MenubarMenu>
        <MenubarTrigger className="focus:bg-light-900 cursor-pointer data-[state=open]:bg-light-900 dark:focus:bg-dark-200 dark:data-[state=open]:bg-dark-200">
          {mode === "dark" ? (
            <Image
              src={"/assets/icons/moon.svg"}
              alt="moon"
              width={20}
              height={20}
              className="active-theme"
            />
          ) : (
            <Image
              src={"/assets/icons/sun.svg"}
              alt="sun"
              width={20}
              height={20}
              className="active-theme"
            />
          )}
        </MenubarTrigger>
        <MenubarContent className="absolute right-[-3rem] mt-3 min-w-[120px] py-2 rounded border bg-light-900 dark:border-dark-400 dark:bg-dark-300">
          {themes.map((item) => (
            <MenubarItem
              key={item.icon}
              className="flex cursor-pointer items-center gap-4 focus:bg-light-800 dark:focus:bg-dark-400"
              onClick={() => {
                setMode(item.value);

                if (item.value !== "system") {
                  localStorage.theme = item.value;
                } else {
                  localStorage.removeItem("theme");
                }
              }}
            >
              <Image
                src={item.icon}
                alt={item.label}
                width={16}
                height={16}
                className={item.value === mode ? "active-theme" : ""}
              />
              <p
                className={`body-semibold ${mode === item.value ? "text-primary-500" : "text-dark100_light900"}`}
              >
                {item.label}
              </p>
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
