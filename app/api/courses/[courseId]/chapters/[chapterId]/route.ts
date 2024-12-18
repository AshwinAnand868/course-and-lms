import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: {
      courseId: string;
      chapterId: string;
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

    if (!chapter) {
      return new NextResponse("Chapter not found", {
        status: 404,
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {isPublished, ...data} = await req.json(); // separating isPublished because there's gonna be a separate api route to publish a chapter after checking all required things
    

    const updatedChapter = await db.chapter.update({
      data: {
        ...data,
      },
      where: {
        id: chapterId,
        courseId: courseId
      },
    });

    // TODO: Handle video upload

    return NextResponse.json(updatedChapter);
  } catch (error) {
    console.log("[CHAPTER PATCH ERROR]", error);
    return new NextResponse("Internal server error while updating chapter", {
      status: 500,
    });
  }
}
