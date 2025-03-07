import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

function Loading() {
  return (
    <>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div>
          <div className="flex w-full flex-col items-start gap-4 lg:flex-row">
            <Skeleton className="size-36 min-w-36 rounded-full max-sm:mx-auto" />

            <div className="mt-3 max-sm:w-full">
              <div className="max-sm:flex-center max-sm:flex-col">
                <Skeleton className="h-6 w-52" />
                <Skeleton className="mt-4 h-6 w-32" />
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-start gap-5">
                <Skeleton className="h-7 w-52" />
                <Skeleton className="h-7 w-52" />
                <Skeleton className="h-7 w-52" />
              </div>
            </div>
          </div>

          <Skeleton className="mt-8 h-7 w-72" />
        </div>
      </div>

      <div className="mt-10">
        <Skeleton className="h-8 w-44" />

        <div className="mt-5 grid grid-cols-1 gap-2 xs:grid-cols-2 md:grid-cols-4">
          <Skeleton className="flex h-32 flex-wrap items-center justify-evenly gap-4 rounded-md p-6" />
          <Skeleton className="flex h-32 flex-wrap items-center justify-evenly gap-4 rounded-md p-6" />
          <Skeleton className="flex h-32 flex-wrap items-center justify-evenly gap-4 rounded-md p-6" />
          <Skeleton className="flex h-32 flex-wrap items-center justify-evenly gap-4 rounded-md p-6" />
        </div>
      </div>

      <div className="mt-10 flex flex-col">
        <Skeleton className="min-h-[42px] w-32 p-1" />
        <div className="mt-5 flex flex-wrap gap-3">
          {Array(5)
            .fill(0)
            .map((item, idx) => (
              <Skeleton
                key={idx}
                className="h-32 w-full rounded-[10px] p-9 sm:px-11"
              />
            ))}
        </div>
      </div>
    </>
  );
}

export default Loading;
