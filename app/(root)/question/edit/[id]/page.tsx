import Question from "@/components/forms/Question";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { ParamsProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Question | DevOverflow",
  description: "Edit question page of DevOverflow",
};

async function EditQuestion({params}: ParamsProps) {
  const { id } = await params;
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");
  const mongoUser = await getUserById({ id: userId });

  const question = await getQuestionById({ questionId: id });
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>
      <div className="mt-9">
        <Question type="Edit" questionData={JSON.stringify(question)} mongoUserId={JSON.stringify(mongoUser._id)} />
      </div>
    </>
  );
}

export default EditQuestion;
