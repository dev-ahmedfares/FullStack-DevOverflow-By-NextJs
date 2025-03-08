import QuestionCard from "@/components/cards/QuestionCard";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/PaginationComp";
import LocalSearch from "@/components/shared/Search/LocalSearch";
import { getQuestionsByTagId } from "@/lib/actions/tag.action";
import { URLProps } from "@/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tag | DevOverflow",
  description: "Tag page of DevOverflow",
};

export default async function Page({ params, searchParams }: URLProps) {
  const { id } = await params;
  const SearchParams = await searchParams;
  const { tagTitle, questions, isNext } = await getQuestionsByTagId({
    tagId: id,
    searchQuery: SearchParams?.q,
    page: SearchParams?.page ? +SearchParams?.page : 1,
  });

  const pageNumber = SearchParams?.page ? +SearchParams?.page : 1;

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">{tagTitle}</h1>

      <div className="mt-11 flex flex-1 justify-between gap-4 max-sm:flex-col sm:items-center">
        <LocalSearch
          route={`/tags/${id}`}
          placeholder="Search for tags question"
          imgSrc="/assets/icons/search.svg"
          otherClasses="flex-1"
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
            title="There are no tags question to show"
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
