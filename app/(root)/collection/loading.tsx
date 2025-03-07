import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      <div className="flex flex-col-reverse justify-between sm:flex-row">
        <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>
      </div>

      <div className="mt-11 flex flex-1 justify-between gap-4 max-sm:flex-col sm:items-center">
        <Skeleton className="min-h-[56px] flex-1 sm:min-w-[170px]" />
        <Skeleton className="flex min-h-[56px] sm:min-w-[170px]" />
      </div>

      <div className="mt-9 flex flex-col gap-6">
        {Array(5)
          .fill(0)
          .map((item, idx) => (
            <Skeleton
              key={idx}
              className="h-32 w-full rounded-[10px] p-9 sm:px-11"
            />
          ))}
      </div>
    </>
  );
};
export default Loading;
