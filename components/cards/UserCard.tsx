import Image from "next/image";
import Link from "next/link";
import React from "react";

interface UserCardProps {
  user: {
    clerkId: string;
    _id: string;
    name: string;
    username: string;
    picture: string;
  };
}

export default function UserCard({ user }: UserCardProps) {
  return (
    <Link
      href={`/profile/${user.clerkId}`}
      className="shadow-light100_darknone w-full max-sm:min-w-full xs:w-[200px]"
    >
      <Image src={user.picture} alt={user.name} width={100} height={100} className="rounded-full"/>
      <h2>{user.name}</h2>
      <p>@{user.username}</p>
      
    </Link>
  );
}
