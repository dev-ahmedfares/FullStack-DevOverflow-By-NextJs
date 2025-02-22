import Profile from "@/components/forms/Profile";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";


export const metadata: Metadata = {
  title: "Edit Profile | Dev Overflow",
  description: "Edit profile page of Dev Overflow",
};

async function EditProfile() {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const mongoUser = await getUserById({ id: userId });
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>
      <div className="mt-9">
        <Profile clerkId={userId} user={JSON.stringify(mongoUser)} />
      </div>
    </>
  );
}

export default EditProfile;
