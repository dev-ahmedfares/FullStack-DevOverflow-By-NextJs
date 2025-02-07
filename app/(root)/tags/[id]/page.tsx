import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilter from "@/components/Home/HomeFilter";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearch from "@/components/shared/Search/LocalSearch";
import { getQuestionsByTagId } from "@/lib/actions/tag.action";
import { URLProps } from "@/types";

export default async function Page({ params, searchQuery }: URLProps) {
  const { id } = await params;
    
  const { tagTitle,questions } = await getQuestionsByTagId({
    tagId: id,
    searchQuery: searchQuery?.q,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">{tagTitle}</h1>

      <div className="mt-11 flex flex-1 justify-between gap-4 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/"
          placeholder="Search for tags question"
          imgSrc="/assets/icons/search.svg"
          otherClasses="flex-1"
        />
      </div>

      <div className="mt-10 flex flex-col gap-6">
        {questions.length > 0 ? (
          questions.map((item) => (
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
    </>
  );
}
