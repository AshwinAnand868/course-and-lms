import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, {params}: { 
    params: {
        courseId: string
    }
}) {
    try {
        
        const {userId} = await auth();

        if(!userId) {
            return new NextResponse("Unauthorized to create the chapter", { status: 401 });
        }

        // check if the user is the course owner

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            }
        });

        if(!course) return new NextResponse("Unauthorized to create the chapter", { status: 401 });


        // extract req data
        const { title } = await req.json();

        const lastChapter = await db.chapter.findFirst({
            where: {
                courseId: params.courseId,
            },
            orderBy: {
                position: "desc"
            }
        });

        const newChapPosition = lastChapter?.position ? lastChapter.position + 1 : 1;

        const chapter = await db.chapter.create({
            data: {
                title: title,
                position: newChapPosition,
                courseId: params.courseId,
            }
        });

        return NextResponse.json(chapter, {
            status: 201
        });
        
    } catch (error) {
        console.log("ERROR IN CHAPTERS CREATION", error);
        return new NextResponse("Internal server error in chapter creation", {
            status: 500
        })
    }
}