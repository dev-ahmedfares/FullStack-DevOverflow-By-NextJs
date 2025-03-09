"use client";
import { downVoteAnswer, upVoteAnswer } from "@/lib/actions/answer.action";
import { viewsQuestion } from "@/lib/actions/interaction.action";
import {
  downVoteQuestion,
  upVoteQuestion,
} from "@/lib/actions/question.action";
import { toggleSaveQuestion } from "@/lib/actions/user.action";
import Image from "next/image";
import {  usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";


interface Props {
  type: "Question" | "Answer";
  itemId: string;
  userId?: string;
  upvotes: number;
  downvotes: number;
  hasUpVoted: boolean;
  hasDownVoted: boolean;
  hasSaved?: boolean;
}

function Votes({
  downvotes,
  hasDownVoted,
  hasUpVoted,
  itemId,
  type,
  upvotes,
  userId,
  hasSaved,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSave = async () => {
    if (!userId) return toast.info("Sign in to be able to contribute");

    await toggleSaveQuestion({
      path: pathname,
      questionId: JSON.parse(itemId),
      userId: JSON.parse(userId),
    });
  };

  const handleVote = async (action: string) => {
    if (!userId) return toast.info("Sign in to be able to contribute");

    if (type === "Question") {
      if (action === "upvote") {
        await upVoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasDownVoted,
          hasUpVoted,
          path: pathname,
        });
      } else {
        await downVoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasDownVoted,
          hasUpVoted,
          path: pathname,
        });
      }
    }

    if (type === "Answer") {
      if (action === "upvote") {
        await upVoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasDownVoted,
          hasUpVoted,
          path: pathname,
        });
      } else {
        await downVoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasDownVoted,
          hasUpVoted,
          path: pathname,
        });
      }
    }

    
  };

  // TODO and the end of project i guess this useEffect must be in question/[id] page not here
  // because problem of double increase that happen
  useEffect(() => {
    viewsQuestion({
      userId: userId ? JSON.parse(userId) : undefined,
      questionId: JSON.parse(itemId),
    });
  }, [pathname, router, userId, itemId]);

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5">
          <Image
            src={
              hasUpVoted
                ? "/assets/icons/upvoted.svg"
                : "/assets/icons/upvote.svg"
            }
            alt="upvote"
            height={18}
            width={18}
            className="cursor-pointer"
            onClick={() => handleVote("upvote")}
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">{upvotes}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Image
            src={
              hasDownVoted
                ? "/assets/icons/downvoted.svg"
                : "/assets/icons/downvote.svg"
            }
            alt="upvote"
            height={18}
            width={18}
            className="cursor-pointer"
            onClick={() => handleVote("downvote")}
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">{downvotes}</p>
          </div>
        </div>
      </div>
      {type === "Question" && (
        <Image
          alt="star"
          width={18}
          height={18}
          src={
            hasSaved
              ? "/assets/icons/star-filled.svg"
              : "/assets/icons/star-red.svg"
          }
          className="cursor-pointer"
          onClick={handleSave}
        />
      )}
    </div>
  );
}

export default Votes;
