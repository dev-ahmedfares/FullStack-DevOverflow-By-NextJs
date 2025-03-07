"use client"
import { useTheme } from "@/context/ThemeProvider";
import { Toaster } from "../ui/sonner";
// text-dark100_light900 border-light-700 bg-light-900 dark:border-dark-400 dark:bg-dark-300
function CustomToaster() {
  const { mode } = useTheme();
  return (
    <Toaster
      closeButton
      toastOptions={{
        classNames: {
          toast: `${mode === "dark" ? "!text-light-900 !bg-dark-300 !border-dark-400" : "!text-dark-100 !bg-light-900 !border-light-700"}`,
          closeButton: `${mode === "dark" ? "!text-light-900 !bg-dark-300 !border-dark-400" : "!text-dark-100 !bg-light-900 !border-light-700"}`,
        },
      }}
    />
  );
}

export default CustomToaster;
