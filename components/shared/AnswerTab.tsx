import { getUserAnswers } from "@/lib/actions/user.action";
import React from "react";
import AnswerCard from "../cards/AnswerCard";
import NoResult from "./NoResult";
import Pagination from "./PaginationComp";

interface Props {
  userId: string;
  clerkId?: string | null;
  searchProps?: { [key: string]: string | undefined };
}

async function AnswerTab({ userId, clerkId, searchProps }: Props) {
  const { userAnswers,isNext } = await getUserAnswers({
    userId,
    page: searchProps?.pageForAnswers ? +searchProps?.pageForAnswers : 1,
  });

  const pageNumber = searchProps?.pageForAnswers ? +searchProps?.pageForAnswers : 1;

  return (
    <>
      <>
        {userAnswers?.length > 0 ? (
          <>
            {userAnswers.map((item) => (
              <AnswerCard
                key={item._id}
                clerkId={clerkId}
                _id={item._id}
                question={item.question}
                author={item.author}
                upvotes={item.upvotes.length}
                createdAt={item.createdAt}
              />
            ))}

            <div className="mt-10">
              <Pagination forItem="Answers" pageNum={pageNumber} isNext={isNext} />
            </div>
          </>
        ) : (
          <NoResult
            title="There are no answer to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
              discussion. our query could be the next big thing others learn from. Get
              involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </>
    </>
  );
}

export default AnswerTab;
