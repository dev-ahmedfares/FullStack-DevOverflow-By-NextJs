import { getTimestamp, getFormattedNumber } from "@/lib/utils";
import Metric from "../shared/Metric";
import Link from "next/link";


interface Props {
  clerkId?: string | null;
  _id: string;
  question: {
    _id: string;
    title: string;
  };
  author: {
    _id: string;
    clerkId: string;
    name: string;
    picture: string;
  };
  upvotes: number;
  createdAt: Date;
}

function AnswerCard({
  clerkId,
  _id,
  question,
  author,
  upvotes,
  createdAt,
}: Props) {
  return (
    <div className="card-wrapper dark:dark-gradient rounded-[10px] p-9 sm:px-11">
      <div>
        <div>
          <span className="subtle-regular text-dark400_light700 mb-1 line-clamp-1 block lg:hidden">
            {getTimestamp(createdAt)}
          </span>
          <Link href={`/question/${question._id}/#${_id}`}>
            <h3 className="text-dark200_light900 sm:h3-semibold base-semibold line-clamp-1 flex-1">
              {question.title}
            </h3>
          </Link>
        </div>

        {/* TODO : if sign-in edit delete actions */}
      </div>

      <div className="flex-between mt-6 flex w-full flex-wrap items-center gap-3">
        <Metric
          href={`/profile/${author.clerkId}`}
          imgUrl={author.picture}
          alt="user"
          title={`- asked ${getTimestamp(createdAt)}`}
          value={author.name}
          isAuthor
          textStyles="body-medium text-dark400_light700"
        />

        <div className="flex items-center gap-2">
          <Metric
            imgUrl="/assets/icons/like.svg"
            alt="upvotes"
            value={getFormattedNumber(upvotes)}
            title="Votes"
            textStyles="small-medium text-dark400_light800"
          />

        
        </div>
      </div>
    </div>
  );
}

export default AnswerCard;
