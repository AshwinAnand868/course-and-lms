import { Category, Course } from "@prisma/client";
import CourseCard from "./course-card";

type CourseWithProgressAndCategory = Course & {
  category: Category | null;
  chapters: {
    id: string;
  }[];
  progress: number | null;
};

interface CoursesListProps {
  items: CourseWithProgressAndCategory[];
}

const CoursesList = ({ items }: CoursesListProps) => {
  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
        {items.map((item) => (
            // The course or item is always published, so it will have every required property
            // and hence exclamation marks for some fields here. 
          <CourseCard
            key={item.id}
            id={item.id}
            title={item.title}
            price={item.price!}
            chaptersLength={item.chapters.length}
            imageUrl={item.imageUrl!}
            progress={item.progress}
            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
            category={item?.category?.name!}
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center text-muted-foreground text-sm mt-10">
            No courses found
        </div>
      )}
    </div>
  );
};

export default CoursesList;
