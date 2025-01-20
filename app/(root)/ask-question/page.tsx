import Question from "@/components/forms/Question";
import { getUserById } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


export default async function AskQuestion() {
  
// const {id} = await currentUser();
  const id  = "clerk12345"
  if (!id) redirect('/sign-in');
  
  const mongoUser = await getUserById({id})
    
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a Question</h1>
      <div className="mt-9">
        <Question mongoUserId={JSON.stringify(mongoUser?._id)}/>
      </div>
    </div>
  )
}
