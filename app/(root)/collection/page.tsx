import QuestionCard from "@/components/cards/QuestionCard";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/PaginationComp";
import LocalSearch from "@/components/shared/Search/LocalSearch";
import { QuestionFilters } from "@/constants/filter";
import { getSavedQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";



export default async function Collection({ searchParams }: SearchParamsProps) {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");
  
  const SearchParams = await searchParams;

  const { questions,isNext } = await getSavedQuestions({
    clerkId: userId,
    searchQuery: SearchParams?.q,
    filter: SearchParams?.filter,
    page:SearchParams?.page ? +SearchParams?.page : 1
  });
  
  const pageNumber = SearchParams?.page ? +SearchParams?.page : 1

  
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

      <div className="mt-11 flex flex-1 justify-between gap-4 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/collection"
          placeholder="Search for questions"
          imgSrc="/assets/icons/search.svg"
          otherClasses="flex-1"
        />
        <Filter
          filters={QuestionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <div className="mt-10 flex flex-col gap-6">
        {questions.length > 0 ? (
          questions.map((item:any) => (
            <QuestionCard
              key={item._id}
              _id={item._id}
              answers={item.answers}
              createdAt={item.createdAt}
              author={item.author}
              tags={item.tags}
              title={item.title}
              upvotes={item.upvotes}
              views={item.views}
            />
          ))
        ) : (
          <NoResult
            title="There are no question saved to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
        discussion. our query could be the next big thing others learn from. Get
        involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
      <div className="mt-10">
        <Pagination pageNum={pageNumber} isNext={isNext} />
      </div>
    </>
  );
}
