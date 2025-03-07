import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      <div className="flex flex-col-reverse justify-between sm:flex-row">
        <h1 className="h1-bold text-dark100_light900">All Tags</h1>
      </div>

      <div className="mt-11 flex flex-1 justify-between gap-4 max-sm:flex-col sm:items-center">
        <Skeleton className="min-h-[56px] flex-1 sm:min-w-[170px]" />
        <Skeleton className="flex min-h-[56px] sm:min-w-[170px]" />
      </div>

      <div className="mt-12 flex flex-wrap gap-4">
        {Array(12)
          .fill(0)
          .map((item, idx) => (
            <Skeleton
              key={idx}
              className="flex h-28 w-full flex-col rounded-2xl px-8 py-10 sm:w-[260px]"
            />
          ))}
      </div>
    </>
  );
};
export default Loading;
