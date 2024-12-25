import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import Mux from "@mux/mux-node";
import { NextResponse } from "next/server";

const { video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

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
    const { isPublished, ...data } = await req.json();
    // separating isPublished because we will create a separate api route
    // to publish a chapter after checking all required things

    const updatedChapter = await db.chapter.update({
      data: {
        ...data,
      },
      where: {
        id: chapterId,
        courseId: courseId,
      },
    });

    if (data.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
        },
      });

      if (existingMuxData) {
        await video.assets.delete(existingMuxData.assetId);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }

      const asset = await video.assets.create({
        input: data.videoUrl,
        playback_policy: ["public"],
        test: false,
      });

      await db.muxData.create({
        data: {
          assetId: asset.id,
          chapterId: params.chapterId,
          playbackId: asset.playback_ids?.[0].id,
        },
      });
    }

    return NextResponse.json(updatedChapter);
  } catch (error) {
    console.log("[CHAPTER PATCH ERROR]", error);
    return new NextResponse("Internal server error while updating chapter", {
      status: 500,
    });
  }
}

export async function DELETE(
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

    // check whether user is authorized
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // check whether the current user is the owner of the course
    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    if (!course) {
      // user is not authorized to manage or manipulate this course
      return new NextResponse("Unauthorized to edit this course items", {
        status: 401,
      });
    }

    const chapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId
      }
    })
    
    if(!chapter) {
      return new NextResponse("Chapter not found", { status: 404 });
    }


    if(chapter.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
        },
      });

    // why this check because I am not using paid version
    // of mux and the test version automatically deletes the
    //  uploaded video after 24 hours
    const assets = await video.assets.list();

      if(existingMuxData) {
        if(assets.data.length > 0) {
          await video.assets.delete(existingMuxData.assetId);
        }

        await db.muxData.delete({
          where: {
            id: existingMuxData.id
          }
        })
      }
    }
    
    const deletedChapter = await db.chapter.delete({
      where: {
        id: params.chapterId,
      },
    });

    // now there is something else to check
    // if there is another published chapter in this course, then we can 
    // safely delete this chapter even if it was published. However, if
    // this was the only published chapter in the course, then we have to
    // unpublish the entire course

    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId: params.courseId
      }
    });

    // the deleted chapter was the only published chapter
    if(!publishedChaptersInCourse.length) {
      // update the course to be unpublished
      await db.course.update({
        where: {
          id: params.courseId
        },
        data: {
          isPublished: false
        }
      });
    }


    return NextResponse.json(deletedChapter);
  } catch {
    console.log("CHAPTER DELETION ERROR");
    return new NextResponse("Error occurred while deleting the chapter", {
      status: 500,
    });
  }
}
