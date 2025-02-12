import { getUserAnswers } from "@/lib/actions/user.action";
import React from "react";
import AnswerCard from "../cards/AnswerCard";
import NoResult from "./NoResult";

interface Props {
  userId: string;
  clerkId: string;
  //   TODO add and use SearchProps
}

async function AnswerTab({ userId, clerkId }: Props) {
  const { totalAnswers, userAnswers } = await getUserAnswers({ userId });
  
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
            {/* <div className="mt-10"> */}
            {/* <Pagination pageNumber={pageNumber} isNext={isNextQuestion} /> */}
            {/* </div> */}
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
