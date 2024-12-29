import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: {
      chapterId: string;
      courseId: string;
    };
  }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("User not authorized", {
        status: 401,
      });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!course)
      return new NextResponse("Unauthorized to update this course's chapter", {
        status: 401,
      });

    const updatedChapter = await db.chapter.update({
        where: {
            id: params.chapterId,
            courseId: params.courseId,
        },
        data: {
            isPublished: false
        }
    });

    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        isPublished: true,
        courseId: params.courseId
      }
    });

    if(!publishedChaptersInCourse.length) {
      // unpublish the course as well

      await db.course.update({
        where: {
          id: params.courseId
        },
        data: {
          isPublished: false
        }
      })
    }

    return NextResponse.json(updatedChapter);

  } catch (error) {
    console.log("Error occurred while unpublishing the chapter ", error);

    return new NextResponse("Error occurred while unpublishing the chapter", {
      status: 500,
    });
  }
}
