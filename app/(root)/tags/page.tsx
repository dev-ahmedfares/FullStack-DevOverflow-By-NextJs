import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearch from "@/components/shared/Search/LocalSearch";
import { TagFilters, UserFilters } from "@/constants/filter";
import { getAllTags } from "@/lib/actions/tag.action";
import { SearchParamsProps } from "@/types";
import Link from "next/link";

import React from "react";

export default async function Page({ searchParams }: SearchParamsProps) {
  const SearchParams = await searchParams;
  const { tags } = await getAllTags({
    searchQuery: SearchParams?.q,
    filter: SearchParams?.filter,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Tags</h1>
      <div className="mt-11 flex flex-1 justify-between gap-4 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/tags"
          iconPosition="left"
          placeholder="Search for tags"
          imgSrc="/assets/icons/search.svg"
          otherClasses="flex-1"
        />

        <Filter
          filters={TagFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />

      </div>
      <div className="mt-12 flex flex-wrap gap-4">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <Link
              href={`/tags/${tag._id}`}
              key={tag._id}
              className="shadow-light100_darknone"
            >
              <article className="background-light900_dark200 light-border flex w-full flex-col rounded-2xl border px-8 py-10 sm:w-[260px]">
                <div className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5">
                  <p className="paragraph-semibold text-dark300_light900">
                    {tag.name}
                  </p>
                </div>
                <p className="small-medium text-dark400_light500 mt-3.5">
                  <span className="body-semibold primary-text-gradient mr-2.5">
                    {tag.questions.length}+
                  </span>
                  Questions
                </p>
              </article>
            </Link>
          ))
        ) : (
          <div className="flex w-full justify-center">
            <NoResult
              title="No tags found"
              description="Looks like there are no tags found"
              link="/ask-question"
              linkTitle="Ask a question"
            />
          </div>
        )}
      </div>
    </>
  );
}
