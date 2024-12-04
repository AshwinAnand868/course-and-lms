import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params } : {
    params: {
        courseId: string
    } // must be in the 2nd parameter - needs to go after request always
}, ) {
    try{

        const {userId} = await auth();
        const courseId = params.courseId;
        const data = await req.json();

        if(!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const course = await db.course.update({
            data: {
                ...data,
            },
            where: {
                id: courseId
            }
        });

        return NextResponse.json(course);

    } catch(error) {
        console.log("[COURSE ID]", error);
        return new NextResponse("Internal Server Error", {status: 500})
    }
}