import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

function Loading() {
  return (
    <div>
      <div>
        <div className="flex flex-col-reverse justify-between max-sm:gap-2 sm:flex-row sm:items-center">
          <Skeleton className="flex h-8 w-40 items-center gap-2 sm:w-64" />

          <div className="flex justify-end">
            <Skeleton className="flex h-8 w-28 items-center gap-2 sm:w-52" />
          </div>
        </div>

        <Skeleton className="mt-6 h-8 w-full text-left" />
      </div>
      <div className="mt-4 flex items-center gap-4">
        <Skeleton className="h-6 w-2/3" />
      </div>

      <Skeleton className="mt-4 h-32 w-full" />

      <div className="mt-4 flex flex-wrap gap-3">
        {Array(4)
          .fill(0)
          .map((tag: any, idx) => (
            <Skeleton key={idx} className="h-6 w-24" />
          ))}
      </div>

      <div className="mt-11">
        <div className="flex flex-col-reverse justify-between max-sm:gap-2 sm:flex-row sm:items-center">
          <Skeleton className="flex h-8 w-40 items-center gap-2" />

          <div className="flex justify-end">
            <Skeleton className="flex h-8 w-36 items-center gap-2" />
          </div>
        </div>
        <div className="mt-4 flex flex-col-reverse justify-between max-sm:gap-2 sm:flex-row sm:items-center">
          <Skeleton className="flex h-8 w-60 items-center gap-2" />

          <div className="flex justify-end">
            <Skeleton className="flex h-8 w-28 items-center gap-2" />
          </div>
        </div>

        <Skeleton className="mt-4 h-32 w-full" />
      </div>
      <div>
        <div className="mt-4 flex flex-col-reverse justify-between max-sm:gap-2 sm:flex-row sm:items-center">
          <Skeleton className="flex h-8 w-60 items-center gap-2" />

          <div className="flex justify-end">
            <Skeleton className="flex h-8 w-28 items-center gap-2" />
          </div>
        </div>

        <Skeleton className="mt-4 h-32 w-full" />
      </div>

      {/* <div>
        <AllAnswers
          searchProps={SearchParams}
          questionId={id}
          userId={mongoUser._id}
        />
      </div> */}

      {/* <div>
        <Answer
          authorId={JSON.stringify(mongoUser._id)}
          questionId={JSON.stringify(question._id)}
          question={question.content}
        />
      </div> */}
    </div>
  );
}

export default Loading;
