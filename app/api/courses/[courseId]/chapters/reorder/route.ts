import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  {
    params,
  }: {
    params: {
      courseId: string;
    };
  }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    // check if the user is the course owner

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if(!course) return new NextResponse("Unauthorized to create the chapter", { status: 401 });

    const { list } = await req.json();

    for(const item of list) {
        await db.chapter.update({
            where: {
                id: item.id
            },
            data: {
                position: item.position
            }
        })
    }

    return NextResponse.json("Successfully reordered chapters", {
        status: 200
    });

  } catch (error) {
    console.log("[ERROR WHILE REORDERING] => ", error);
    return new NextResponse("Internal reordering server error", {
      status: 500,
    });
  }
}
