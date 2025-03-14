import { getFormattedNumber } from "@/lib/utils";
import { BadgeCounts } from "@/types";
import Image from "next/image";

interface IStatsCardProps {
  imgUrl: string;
  value: number;
  title: string;
}

function StatsCard({ imgUrl, value, title }: IStatsCardProps) {
  return (
    <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-center gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
      <Image src={imgUrl} alt={title} width={40} height={50} />
      <div>
        <div className="flex flex-col items-center justify-center gap-3">
          <p className="paragraph-semibold text-dark200_light900">
            {getFormattedNumber(value)}
          </p>
          <p className="body-medium text-dark400_light700 line-clamp-1">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
}

interface Props {
  totalQuestions: number;
  totalAnswer: number;
  reputation: number;
  badgeCounts?: BadgeCounts;
}
function Stats({
  totalQuestions,
  totalAnswer,
  reputation,
  badgeCounts = {
    GOLD: 0,
    SILVER: 0,
    BRONZE: 0,
  },
}: Props) {
  return (
    <div className="mt-10">
      <h4 className="h3-semibold text-dark200_light900">
        Stats - [{reputation}]
      </h4>
      <div className="mt-5 grid grid-cols-1 gap-2 xs:grid-cols-2 md:grid-cols-4">
        <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-evenly gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
          <div className="flex flex-col items-center justify-center gap-3">
            <p className="paragraph-semibold text-dark200_light900">
              {totalQuestions}
            </p>
            <p className="body-medium text-dark200_light900">Questions</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-3">
            <p className="paragraph-semibold text-dark200_light900">
              {totalAnswer}
            </p>
            <p className="body-medium text-dark200_light900">Answers</p>
          </div>
        </div>

        <StatsCard
          imgUrl="/assets/icons/gold-medal.svg"
          value={badgeCounts.GOLD}
          title="Gold Badges"
        />
        <StatsCard
          imgUrl="/assets/icons/silver-medal.svg"
          value={badgeCounts.SILVER}
          title="Silver Badges"
        />
        <StatsCard
          imgUrl="/assets/icons/bronze-medal.svg"
          value={badgeCounts.BRONZE}
          title="Bronze Badges"
        />
      </div>
    </div>
  );
}

export default Stats;
