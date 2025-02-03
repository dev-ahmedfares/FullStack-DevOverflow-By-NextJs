import { getAllAnswers } from "@/lib/actions/answer.action";
import React from "react";
import Filter from "./Filter";
import { AnswerFilters } from "@/constants/filter";
import Image from "next/image";
import Link from "next/link";
import ParseHTML from "./ParseHTML";

interface Props {
  questionId: string;
  userId: string;
}

async function AllAnswers({ questionId }: Props) {
  const { answers } = await getAllAnswers({ questionId });

  console.log(answers);

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
              <div>
                <Link href={`/profile/${answer.author.clerkId}`}>
                  <Image
                    src={answer.author.picture}
                    alt="User Profile Picture"
                    width={22}
                    height={22}
                    className="rounded-full"
                  />
                  <div>
                    <p className="body-semibold text-dark300_light700">{answer.author.name}</p>
                  </div>
                </Link>
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
