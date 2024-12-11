import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

type TProps = {
  title: string;
  link: string;
  linkTitle: string;
  description: string;
};

export default function NoResult({
  title,
  link,
  linkTitle,
  description,
}: TProps) {
  return (
    <div className="mt-10 flex flex-col items-center justify-center gap-3">
      <Image
        src="/assets/images/light-illustration.png"
        alt="Not-Result-page"
        width={270}
        height={200}
        className="block object-contain dark:hidden"
      />
      <Image
        src="/assets/images/dark-illustration.png"
        alt="Not-Result-page"
        width={270}
        height={200}
        className="hidden object-contain dark:block"
      />
      <h2 className="h2-bold text-dark200_light900 mt-8 text-center">{title}</h2>
      <p className="body-regular text-dark500_light700 my-2 max-w-md text-center">
        {description}
      </p>
      <Link href={link}>
        <Button className="paragraph-medium mt-1 min-h-[46px] bg-primary-500 px-4 !text-light-900">
          {linkTitle}
        </Button>
      </Link>
    </div>
  );
}
