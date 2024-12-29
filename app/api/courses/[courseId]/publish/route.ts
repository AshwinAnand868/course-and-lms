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
            },
            include: {
                chapters: {
                    include: {
                        muxData: true
                    }
                }
            }
        });

        if(!course) {
            return new NextResponse("Course not found", {
                status: 404
            });
        }

        const hasPublishedChapters = course.chapters.some(chapter => chapter.isPublished);

        if(!hasPublishedChapters || !course.title || !course.description || 
            !course.imageUrl || !course.price || !course.categoryId) {
            return new NextResponse("Missing required fields", {
                status: 400
            });
        }

        const updatedChapter = await db.course.update({
            where: {
                id: params.courseId
            },
            data: {
                isPublished: true
            }
        });

        return NextResponse.json(updatedChapter);

    } catch (error) {
        console.log("Error in course publition", error);
        return new NextResponse("Error in publishing the course", {
            status: 500
        });
    }
}