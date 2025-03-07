import JobCard from "@/components/cards/JopCard";
import JobsFilter from "@/components/shared/JobsFilter";
import Pagination from "@/components/shared/PaginationComp";
import {
  fetchCountries,
  fetchJobs,
  fetchLocation,
} from "@/lib/actions/jop.actions";
import { Job } from "@/types";

interface Props {
  searchParams: {
    q: string;
    location: string;
    page: string;
  };
}

const page = async ({ searchParams }: Props) => {
  const SearchParams = await searchParams;
  const countries = await fetchCountries();
  const userLocation = await fetchLocation();

  const jobs = await fetchJobs({
    query:
      `${SearchParams?.q}, ${SearchParams?.location}` ??
      `Software Engineer in ${userLocation}`,
    page: SearchParams.page ?? 1,
  });
  console.log(jobs);
  console.log(SearchParams.location);
  const page = parseInt(SearchParams.page ?? 1);

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Jobs</h1>

      <div className="flex">
        <JobsFilter countriesList={countries} />
      </div>

      <section className="light-border mb-9 mt-11 flex flex-col gap-9 border-b pb-9">
        {jobs?.length > 0 ? (
          jobs?.map((job: Job) => {
            if (job.job_title && job.job_title.toLowerCase() !== "undefined")
              return <JobCard key={job.id} job={job} />;

            return null;
          })
        ) : (
          <div className="paragraph-regular text-dark200_light800 w-full text-center">
            Oops! We couldn&apos;t find any jobs at the moment. Please try again
            later
          </div>
        )}
      </section>

      {jobs?.length > 0 && (
        <Pagination pageNum={page} isNext={jobs.length === 10} />
      )}
    </>
  );
};
export default page;
