import { getTopInteractedTags } from "@/lib/actions/tag.action";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";
import RenderTag from "../shared/RenderTag";

interface UserCardProps {
  user: {
    clerkId: string;
    _id: string;
    name: string;
    username: string;
    picture: string;
  };
}

export default async function UserCard({ user }: UserCardProps) {
  const interactedTags = await getTopInteractedTags({ userId: user._id });

  return (
    <Link
      href={`/profile/${user.clerkId}`}
      className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]"
    >
      <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8">
        <Image
          src={user.picture}
          alt={"user Profile picture"}
          width={100}
          height={100}
          className="rounded-full"
        />
        <div className="mt-4 text-center">
          <h3 className="h3-bold text-dark200_light900 line-clamp-1">
            {user.name}
          </h3>
          <p className="body-regular text-dark500_light500 mt-1">
            @{user.username}
          </p>
        </div>
        {interactedTags.length > 0 ? (
          <div className="mt-4 flex gap-2">
            {interactedTags?.map((tag: any) => (
              <RenderTag
                withoutLink={true}
                _id={tag._id}
                key={tag._id}
                name={tag.name}
              />
            ))}
          </div>
        ) : (
          <Badge className="subtle-medium background-light800_dark300 text-light400_light500 mt-4 rounded-md border-none px-4 py-2 uppercase">
            No tags yet
          </Badge>
        )}
      </article>
    </Link>
  );
}
