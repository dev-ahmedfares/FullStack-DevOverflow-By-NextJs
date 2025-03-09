import ProfileLink from "@/components/shared/ProfileLink";
import Stats from "@/components/shared/Stats";
import { Button } from "@/components/ui/button";
import { getUserInfo } from "@/lib/actions/user.action";
import { formatMonthYear } from "@/lib/utils";
import { URLProps } from "@/types";
import { SignedIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuestionTab from "@/components/shared/QuestionTab";
import AnswerTab from "@/components/shared/AnswerTab";
import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";

export const metadata:Metadata = {
  title:"Profile | DevOverflow",
  description:"Profile page of DevOverflow"
}

async function ProfileDetails({ params, searchParams }: URLProps) {
  const { id } = await params;
   const { userId:clerkId } = await auth();
  const SearchParams = await searchParams;
  const { userInfo, totalQuestions, totalAnswers, badgeCounts, reputation } =
    await getUserInfo({
      userId: id,
    });

  return (
    <>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="w-full">
          <div className="flex w-full flex-col items-start gap-4 max-sm:mx-auto lg:flex-row">
            <Image
              className="rounded-full max-sm:mx-auto"
              src={userInfo?.picture}
              alt="profile image"
              width={140}
              height={140}
            />

            <div className="mt-3 max-sm:w-full">
              <h2 className="h2-bold text-dark100_light900 max-sm:text-center">
                {userInfo?.name}
              </h2>
              <p className="paragraph-regular text-dark200_light800 max-sm:text-center">
                @{userInfo?.username}
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
                {userInfo?.portfolioWebsite && (
                  <ProfileLink
                    imgUrl={"/assets/icons/link.svg"}
                    title="Portfolio"
                    href={userInfo.portfolioWebsite}
                  />
                )}

                {userInfo?.portfolioWebsite && (
                  <ProfileLink
                    imgUrl={"/assets/icons/location.svg"}
                    title={userInfo.location}
                  />
                )}

                <ProfileLink
                  imgUrl={"/assets/icons/calendar.svg"}
                  title={`Joined ${formatMonthYear(userInfo.joinedAt)}`}
                />
              </div>
            </div>
          </div>

          {userInfo?.bio && (
            <p className="paragraph-regular text-dark400_light800 mt-8">
              {userInfo.bio}
            </p>
          )}
        </div>
        <div className="flex justify-end max-sm:mb-8 max-sm:w-full sm:mt-3">
          <SignedIn>
            {clerkId === userInfo?.clerkId && (
              <Link href="/profile/edit">
                <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-[175px] px-4 py-3">
                  Edit profile
                </Button>
              </Link>
            )}
          </SignedIn>
        </div>
      </div>

      <Stats
        badgeCounts={badgeCounts}
        reputation={reputation}
        totalAnswer={totalAnswers || 0}
        totalQuestions={totalQuestions || 0}
      />

      <div className="mt-10 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-1">
          <TabsList className="background-light800_dark400 min-h-[42px] p-1">
            <TabsTrigger className="tab" value="top-posts">
              Top Posts
            </TabsTrigger>
            <TabsTrigger className="tab" value="answers">
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent value="top-posts" className="mt-5 flex flex-col gap-5">
            <QuestionTab
              searchProps={SearchParams}
              userId={userInfo._id}
              clerkId={clerkId}
            />
          </TabsContent>
          <TabsContent value="answers" className="mt-0 flex flex-col gap-5">
            <AnswerTab
              searchProps={SearchParams}
              userId={userInfo._id}
              clerkId={clerkId}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

export default ProfileDetails;
