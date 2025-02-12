import { getUserQuestions } from "@/lib/actions/user.action";
import QuestionCard from "../cards/QuestionCard";
import NoResult from "./NoResult";

interface Props {
  userId: string;
  clerkId: string;
  //   TODO add and use SearchProps
}

async function QuestionTab({ userId, clerkId }: Props) {
  const { userQuestions, totalQuestions } = await getUserQuestions({ userId });

  return (
    <>
      {userQuestions?.length > 0 ? (
        <>
          {userQuestions.map((item) => (
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
              clerkId={clerkId}
            />
          ))}

          {/* <div className="mt-10"> */}
          {/* <Pagination pageNumber={pageNumber} isNext={isNextQuestion} /> */}
          {/* </div> */}
        </>
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
    </>
  );
}

export default QuestionTab;
