import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: {
        params: {
            courseId: string
        }
    }
) {
    try {
        const { userId } = await auth();
        const { url } = await req.json();

        if(!userId) {
            return new NextResponse("Unauthorized", {
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
            return new NextResponse("Unauthorized", { status: 401 });
        }


        const attachment = await db.attachment.create({
            data: {
                url: url,
                name: url.split("/").pop(),
                courseId: params.courseId,
            }
        });

        return NextResponse.json(attachment, { status: 201});


    } catch (error) {
        console.log("COURSE ID ATTACHMENTS", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}