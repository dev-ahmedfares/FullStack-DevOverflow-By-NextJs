
import Image from "next/image";
import Link from "next/link";
import React from "react";
interface IProfileLink {
  imgUrl: string;
  title: string;
  href?: string;
}

function ProfileLink({ imgUrl, title, href }: IProfileLink) {
  return (
    <div className="flex-center gap-1">
      <Image src={imgUrl} alt="icon" width={20} height={20} />

      {href ? (
        <Link
          target="_blank"
          href={href}
          className="paragraph-medium text-blue-500"
        >
          <p>{title}</p>
        </Link>
      ) : (
        <p className="paragraph-medium text-dark400_light700">{title}</p>
      )}
    </div>
  );
}

export default ProfileLink;
