import UserCard from "@/components/cards/UserCard";
import Filter from "@/components/shared/Filter";
import Pagination from "@/components/shared/PaginationComp";
import LocalSearch from "@/components/shared/Search/LocalSearch";
import { UserFilters } from "@/constants/filter";
import { getAllUsers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import { Metadata } from "next";
import Link from "next/link";

export const metadata:Metadata = {
  title:"Community | DevOverflow",
  description:"Community page of DevOverflow"
}

export default async function Page({ searchParams }: SearchParamsProps) {
  const SearchParams = await searchParams;

  const { users,isNext } = await getAllUsers({
    searchQuery: SearchParams?.q,
    filter: SearchParams?.filter,
    page:SearchParams?.page ? +SearchParams?.page : 1
  });

  const pageNumber = SearchParams?.page ? +SearchParams?.page : 1;
 
  
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>

      <div className="mt-11 flex flex-1 justify-between gap-4 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/community"
          iconPosition="left"
          placeholder="Search for amazing minds"
          imgSrc="/assets/icons/search.svg"
          otherClasses="flex-1"
        />
        <Filter
          filters={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>
      <div className="mt-12 flex flex-wrap gap-4">
        {users && users?.length > 0 ? (
          users.map((user) => <UserCard key={user._id} user={user} />)
        ) : (
          <div className="mx-auto flex h-[200px] flex-col items-center justify-center">
            <p className="h2-bold text-dark100_light900">No user yet</p>
            <Link
              href="/sign-up"
              className="h3-semibold primary-text-gradient mt-4"
            >
              Join to be the first!
            </Link>
          </div>
        )}
      </div>
      <div className="mt-10">
        <Pagination pageNum={pageNumber} isNext={isNext} />
      </div>
    </>
  );
}
