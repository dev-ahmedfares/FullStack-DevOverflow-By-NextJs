import Link from "next/link";
import React from "react";
import { Badge } from "@/components/ui/badge";

interface Props {
  _id: string;
  name: string;
  totalQuestions?: number;
  showCount?: boolean;
  withoutLink?: boolean;
}

export default function RenderTag({
  _id,
  name,
  totalQuestions,
  showCount,
  withoutLink = false,
}: Props) {
  return (
    <>
      {withoutLink ? (
        <div
          
          className="flex items-center justify-between"
        >
          <Badge className="subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase">
            {name}
          </Badge>
          {showCount && (
            <p className="small-medium text-dark500_light700">
              {totalQuestions}
            </p>
          )}
        </div>
      ) : (
        <Link
          href={`/tags/${_id}`}
          className="flex items-center justify-between"
        >
          <Badge className="subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase">
            {name}
          </Badge>
          {showCount && (
            <p className="small-medium text-dark500_light700">
              {totalQuestions}
            </p>
          )}
        </Link>
      )}
    </>
  );
}
