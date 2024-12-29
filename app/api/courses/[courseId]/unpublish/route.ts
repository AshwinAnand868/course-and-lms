import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, {
    params
}: {
    params: {
        courseId: string
    }
}) {
    try {
        const { userId } = await auth();

        if(!userId) {
            return new NextResponse("Unauthorized user", {
                status: 401
            });
        }

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            }
        });

        if(!course) {
            return new NextResponse("Course not found", {
                status: 404
            });
        }

        const updatedChapter = await db.course.update({
            where: {
                id: params.courseId,
                userId
            },
            data: {
                isPublished: false
            }
        });

        return NextResponse.json(updatedChapter);

    } catch (error) {
        console.log("Error in course unpublition", error);
        return new NextResponse("Error in unpublishing the course", {
            status: 500
        });
    }
}