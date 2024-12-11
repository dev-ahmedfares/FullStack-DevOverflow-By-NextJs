import Link from "next/link";
import RenderTag from "../shared/RenderTag";
import { getFormattedNumber, getTimestamp } from "@/lib/utils";
import Metric from "../shared/Metric";

type TProps = {
  _id: string;
  title: string;
  tags: { _id: string; name: string }[];
  author: {
    _id: string;
    clerkId: string;
    name: string;
    picture: string;
  };
  upvotes: number;
  views: number;
  answers: Array<Object>;
  createdAt: Date;
  clerkId?: string | null;
};

export default function QuestionCard({
  _id,
  answers,
  author,
  createdAt,
  tags,
  title,
  upvotes,
  views,
}: TProps) {
  return (
    <div className="card-wrapper dark:dark-gradient rounded-[10px] p-9 sm:px-11">
      
      <div>
        <div>
          <span className="subtle-regular line-clamp-1 text-dark400_light700 block lg:hidden mb-1">
            {getTimestamp(createdAt)}
          </span>
          <Link href={`/question/${_id}`}>
            <h3 className="text-dark200_light900 sm:h3-semibold base-semibold line-clamp-1 flex-1">{title}</h3>
          </Link>
        </div>

        {/* TODO : if sign-in edit delete actions */}
      </div>


      <div className="flex flex-wrap gap-2 mt-3.5">
        {tags.map((item) => (
          <RenderTag _id={item._id} key={item._id} name={item.name} />
        ))}
      </div>

        <div className="flex items-center flex-between mt-6 w-full flex-wrap gap-3">
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

          <Metric
            imgUrl="/assets/icons/message.svg"
            alt="message"
            value={getFormattedNumber(answers.length)}
            title="Answers"
            textStyles="small-medium text-dark400_light800"
          />

          <Metric
            imgUrl="/assets/icons/eye.svg"
            alt="views"
            value={getFormattedNumber(views)}
            title="Views"
            textStyles="small-medium text-dark400_light800"
          />
          </div>
        </div>

    </div>
  );
}
