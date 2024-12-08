import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: {
      courseId: string;
      attachmentId: string;
    };
  }
) {
  try {
    const { userId } = await auth();

    // check whether user is authenticated
    if(!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    // check whether the current user is the owner of the course
    const course = await db.course.findUnique({
        where: {
            id: params.courseId,
            userId: userId
        }
    });

    if(!course)  { // user is not authorized to manage or manipulate this course
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const attachment = await db.attachment.delete({
        where: {
            courseId: params.courseId,
            id: params.attachmentId
        }
    });

    return NextResponse.json(attachment); // deleted attachment

  } catch (error) {
    console.log("ATTACHMENT_ID", error);
    return new NextResponse("Internal Error", { status: 500 })
  }
}
