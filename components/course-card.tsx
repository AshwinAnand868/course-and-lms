import { formatPrice } from "@/lib/format";
import { BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { IconBadge } from "./icon-badge";

interface CourseCardProps {
  id: string;
  title: string;
  price: number;
  category: string;
  progress: number | null;
  chaptersLength: number;
  imageUrl: string;
}

const CourseCard = ({
  id,
  title,
  imageUrl,
  chaptersLength,
  price,
  category,
  progress,
}: CourseCardProps) => {
  return <Link href={`/courses/${id}`}>
    <div className="group hover:shadow-sm rounded-lg p-3 border overflow-hidden h-full transition">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
            <Image fill className="object-cover" src={imageUrl} alt={title} />
        </div>
        <div className="flex flex-col pt-2">
            <div className="text-lg md:text-base font-medium 
                group-hover:text-sky-700 transition line-clamp-2">
                {title}
            </div>
            <p className="text-xs text-muted-foreground">
                {category}
            </p>
            <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
                <div className="flex gap-x-1 text-slate-500 items-center">
                    <IconBadge size={"sm"} icon={BookOpen} />
                    <span>{chaptersLength} {chaptersLength == 1 ? "Chapter" : "Chapters"}</span>
                </div>
            </div>

            {progress !== null ? (
                <div>
                    TODO: Progress component
                </div>
            ): (
                <p className="text-md md:text-sm font-medium text-slate-700">
                    {formatPrice(price)}
                </p>
            )}
        </div>
    </div>
  </Link>;
};

export default CourseCard;
