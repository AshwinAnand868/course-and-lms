import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import Mux from "@mux/mux-node";
import { NextResponse } from "next/server";

const { video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

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
        console.log("[UPDTATED COURSE ERROR]", error);
        return new NextResponse("Internal Server Error", {status: 500})
    }
}

export async function DELETE(req: Request, { 
    params
}: {
    params: {
        courseId: string
    }
}) {

    try {
        const {userId} = await auth();
        const courseId = params.courseId;

        if(!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
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
            return new NextResponse("Not found", {
                status: 404
            });
        }

        // mux data needs to be deleted of each chapter in this
        // course before deletion of course itself
        // Also, the mux data in our datbase itself will be
        // deleted automatically when we delete the course
        // because of the onCascade property
        for(const chapter of course.chapters) {
            if(chapter.muxData?.assetId) {
                await video.assets.delete(chapter.muxData.assetId);
            }
        }

        const deletedCourse = await db.course.delete({
            where: {
                id: courseId
            }
        });

        return NextResponse.json(deletedCourse);

    } catch(error) {
        console.log("[DELETED COURSE ERROR]", error);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}