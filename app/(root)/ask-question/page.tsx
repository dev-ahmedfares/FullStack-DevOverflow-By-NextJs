import Question from "@/components/forms/Question";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata:Metadata = {
  title:"Ask-question | DevOverflow",
  description:'Ask question page of DevOverflow'
}

export default async function AskQuestion() {
  const { userId } = await auth()

  if (!userId) redirect("/sign-in");

  const mongoUser = await getUserById({ id:userId });

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a Question</h1>
      <div className="mt-9">
        <Question mongoUserId={JSON.stringify(mongoUser?._id)} />
      </div>
    </div>
  );
}
