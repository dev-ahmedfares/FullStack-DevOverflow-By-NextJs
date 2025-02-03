import Image from "next/image";
import Link from "next/link";
import React from "react";
import { getQuestionById } from "@/lib/actions/question.action";
import { getFormattedNumber, getTimestamp } from "@/lib/utils";
import { URLProps } from "@/types";
import Answer from "@/components/forms/Answer";
import Metric from "@/components/shared/Metric";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTag from "@/components/shared/RenderTag";
import { auth } from "@clerk/nextjs/server";
import { getUserById } from "@/lib/actions/user.action";
import AllAnswers from "@/components/shared/AllAnswers";

async function Page({ params, searchParams }: URLProps) {
  const { userId: clerkId } = await auth();

  // TODO if user not sign in what must happen??
  let mongoUser;
  if (clerkId) {
    mongoUser = await getUserById({ id: clerkId });
  }

  const question = await getQuestionById({ questionId: params.id });

  return (
    <div>
      <div>
        <div className="flex flex-col-reverse justify-between sm:flex-row sm:items-center">
          <Link
            className="flex items-center gap-2"
            href={`/profile/${question.author.clerkId}`}
          >
            <Image
              src={question.author.picture}
              alt="user profile picture"
              width={22}
              height={22}
              className="rounded-full"
            />
            <p className="paragraph-semibold text-dark300_light700">
              {question.author.name}
            </p>
          </Link>
          <div className="text-dark300_light700 flex justify-end">VOTING</div>
        </div>

        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {question.title}
        </h2>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <Metric
          imgUrl="/assets/icons/clock.svg"
          alt="clock icon"
          value={` asked ${getTimestamp(question.createdAt)}`}
          title=" Votes"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={getFormattedNumber(question.answers.length)}
          title=" Answers"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="Eye"
          value={getFormattedNumber(question.views)}
          title=" Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>

      {/* Parsing code to show in Ui */}
      <ParseHTML data={question.content} />

      <div className="mt-8 flex flex-wrap">
        {question.tags.map((tag: any) => (
          <RenderTag
            key={tag._id}
            _id={tag._id}
            name={tag.name}
            showCount={false}
          />
        ))}
      </div>

      <div>
        <AllAnswers
          questionId={params.id}
          userId={JSON.stringify(mongoUser._id)}
        />
      </div>

      <div>
        <Answer
          authorId={JSON.stringify(mongoUser._id)}
          questionId={JSON.stringify(question._id)}
          question={question.content}
        />
      </div>
    </div>
  );
}

export default Page;
