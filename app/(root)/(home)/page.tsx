import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilter from "@/components/Home/HomeFilter";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/PaginationComp";
import LocalSearch from "@/components/shared/Search/LocalSearch";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filter";
import { getQuestions } from "@/lib/actions/question.action";
import { SearchParamsProps } from "@/types";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: `Home | DevOverflow`,
  description: "Home page of DevOverflow",
};

export default async function Home({ searchParams }: SearchParamsProps) {
  const SearchParams = await searchParams;

  const { questions } = await getQuestions({
    searchQuery: SearchParams?.q,
    filter: SearchParams?.filter,
  });

  // TODO Recommendation
  return (
    <>
      <div className="flex flex-col-reverse justify-between sm:flex-row">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href="/ask-question" className="ms-auto">
          <Button className="primary-gradient min-h-[46px] !text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>

      <div className="mt-11 flex flex-1 justify-between gap-4 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/"
          placeholder="Search for questions"
          imgSrc="/assets/icons/search.svg"
          otherClasses="flex-1"
        />
        <Filter
          filters={HomePageFilters}
          containerClasses="hidden max-md:flex"
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <HomeFilter />

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
            title="There are no question to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
        discussion. our query could be the next big thing others learn from. Get
        involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>

      <div className="mt-10">
        <Pagination pageNum={1} isNext={false} />
      </div>
    </>
  );
}
