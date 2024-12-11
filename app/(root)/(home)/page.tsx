import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilter from "@/components/Home/HomeFilter";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearch from "@/components/shared/Search/LocalSearch";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filter";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: `Home | DevOverflow`,
  description: "Home page of DevOverflow",
};

// TODO

const resultQuestions = [
  {
    _id: "1",
    title: "How to implement a custom hook in React?",
    tags: [
      { _id: "1", name: "React" },
      { _id: "2", name: "Hooks" },
    ],
    author: {
      _id: "101",
      clerkId: "clerk101",
      name: "Jane Doe",
      picture: "/assets/icons/account.svg",
    },
    upvotes: 150,
    views: 1000,
    answers: [
      { _id: "201", text: "You can use `useState` or `useEffect` to build a custom hook." },
      { _id: "202", text: "Here's an example of a custom hook for fetching data." },
    ],
    createdAt: new Date("2024-12-01T10:00:00"),
    clerkId: "clerk101",
  },
  {
    _id: "2",
    title: "What's the difference between let, const, and var in JavaScript?",
    tags: [
      { _id: "3", name: "JavaScript" },
      { _id: "4", name: "Variables" },
    ],
    author: {
      _id: "102",
      clerkId: "clerk102",
      name: "John Smith",
      picture: "/assets/icons/account.svg",
    },
    upvotes: 200,
    views: 1500,
    answers: [
      { _id: "203", text: "`const` is for constants, `let` is block-scoped, and `var` is function-scoped." },
    ],
    createdAt: new Date("2024-12-02T11:30:00"),
    clerkId: "clerk102",
  },
  {
    _id: "3",
    title: "How to style components using Tailwind CSS?",
    tags: [
      { _id: "5", name: "CSS" },
      { _id: "6", name: "TailwindCSS" },
    ],
    author: {
      _id: "103",
      clerkId: "clerk103",
      name: "Alice Johnson",
      picture: "/assets/icons/account.svg",
    },
    upvotes: 300,
    views: 2000,
    answers: [
      { _id: "204", text: "Use utility classes in Tailwind to style your components inline." },
    ],
    createdAt: new Date("2024-12-03T14:00:00"),
    clerkId: "clerk103",
  },
];

export default function Home() {
  
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
          placeholder="Search questions..."
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
        {resultQuestions.length > 0 ? (
          resultQuestions.map((item) => (
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
    </>
  );
}
