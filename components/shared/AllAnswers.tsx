import { getAllAnswers } from "@/lib/actions/answer.action";
import React from "react";
import Filter from "./Filter";
import { AnswerFilters } from "@/constants/filter";
import Image from "next/image";
import Link from "next/link";
import ParseHTML from "./ParseHTML";
import { getTimestamp } from "@/lib/utils";
import Votes from "./Votes";

interface Props {
  questionId: string;
  userId: string;
}

async function AllAnswers({ questionId,userId }: Props) {
  const { answers } = await getAllAnswers({ questionId });

  

  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient flex gap-1">
          <span>{answers.length}</span>Answers
        </h3>
        <Filter filters={AnswerFilters} />
      </div>

      <div>
        {answers.map((answer) => (
          <article className="light-border border-b py-10" key={answer._id}>
            <div className="flex items-center justify-between">
              <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-between">
                <Link
                  href={`/profile/${answer.author.clerkId}`}
                  className="flex w-fit gap-2 max-sm:items-center"
                >
                  <Image
                    src={answer.author.picture}
                    alt="User Profile Picture"
                    width={22}
                    height={22}
                    className="rounded-full"
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <p className="body-semibold text-dark300_light700">
                      {answer.author.name}
                    </p>
                    <p className="small-regular text-light400_light500 mt-0.5 line-clamp-1">
                      <span className="ml-1 max-sm:hidden">&#x2022;</span>{" "}
                      answered {getTimestamp(answer.createdAt)}
                    </p>
                  </div>
                </Link>

                <div className="flex justify-end">
                  <Votes
                    type="Answer"
                    itemId={JSON.stringify(answer._id)}
                    userId={JSON.stringify(userId)}
                    hasDownVoted={answer.downvotes.includes(userId)}
                    hasUpVoted={answer.upvotes.includes(userId)}
                    upvotes={answer.upvotes.length}
                    downvotes={answer.downvotes.length}
                  />
                </div>
              </div>
            </div>
            <ParseHTML data={answer.content} />
          </article>
        ))}
      </div>
    </div>
  );
}

export default AllAnswers;
