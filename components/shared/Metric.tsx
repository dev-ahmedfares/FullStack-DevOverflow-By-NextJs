import Image from "next/image";
import Link from "next/link";

type TProps = {
  imgUrl: string;
  title: string;
  alt: string;
  value: number | string;
  textStyles: string;
  isAuthor?: boolean;
  href?: string;
}

export default function Metric({
  imgUrl,
  alt,
  title,
  value,
  textStyles,
  isAuthor,
  href,
}: TProps) {
  const metricContent = (
    <>
      <Image
        src={imgUrl}
        className={`object-contain ${isAuthor ? "rounded-full" : ""}`}
        width={16}
        height={16}
        alt={alt}
      />
      <p className={`${textStyles} line-clamp-1 flex items-center gap-1`}>
        {value}
        <span
          className={`${isAuthor ? "max-lg:hidden" : ""} small-regular line-clamp-1`}
        >
          {title}
        </span>
      </p>
    </>
  );

  if (href) {
    return <Link href={href} className="flex-center gap-1">{metricContent}</Link>;
  }
  return <div className="flex-center flex-wrap gap-1">{metricContent}</div>;
}
