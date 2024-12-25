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

    const courseId = params.courseId;

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

    const chapterId = params.chapterId;

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId: courseId,
      },
    });

    const muxData = await db.muxData.findUnique({
        where: {
            chapterId: params.chapterId
        }
    });

    // never trust user inputs as they can directly call the api
    if (!chapter || !muxData || !chapter.title || !chapter.description || !chapter.videoUrl) {
      return new NextResponse("Missing required fields", {
        status: 400,
      });
    }

    const updatedChapter = await db.chapter.update({
        where: {
            id: params.chapterId
        },
        data: {
            isPublished: true
        }
    });

    return NextResponse.json(updatedChapter);

  } catch (error) {
    console.log("Error occurred while publishing the chapter ", error);

    return new NextResponse("Error occurred while publishing the chapter", {
      status: 500,
    });
  }
}
