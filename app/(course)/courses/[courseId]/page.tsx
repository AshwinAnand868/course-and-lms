import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface CourseViewPageProps {
    params: {
        courseId: string
    }
}

const CourseViewPage = async ({
    params
}: CourseViewPageProps) => {

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true
        },
        orderBy: {
          position: "asc"
        }
      }
    }
  });

  if(!course) {
    redirect("/");
  }

  return redirect(`/courses/${course.id}/chapters/${course.chapters[0].id}`);
}

export default CourseViewPage