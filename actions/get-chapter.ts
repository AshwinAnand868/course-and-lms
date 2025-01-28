import { db } from "@/lib/db";
import { Attachment, Chapter } from "@prisma/client";

interface GetChapterProps {
    courseId: string;
    userId: string;
    chapterId: string;
}

export const getChapter = async ({
    courseId,
    userId,
    chapterId,
}: GetChapterProps) => {
    try {

        const purchase = await db.purchase.findUnique({
            where: {
                courseId_userId: {
                    userId,
                    courseId,
                }
            }
        });

        const course = await db.course.findUnique({
            where: {
                isPublished: true,
                id: courseId
            },
            select: {
                price: true
            }
        });

        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                isPublished: true
            }
        });

        if(!chapter || !course) {
            throw new Error("Chapter or course not found");
        }

        let muxData = null;
        let attachments: Attachment[] = [];
        let nextChapter: Chapter | null = null;

        if(purchase) {
            attachments = await db.attachment.findMany({
                where: {
                    courseId: courseId
                }
            });
        }

        if(chapter.isFree || purchase) {
            muxData = await db.muxData.findUnique({
                where: {
                    chapterId: chapterId
                }
            });

            nextChapter = await db.chapter.findFirst({
                where: {
                    courseId: courseId,
                    isPublished: true,
                    position: {
                        gt: chapter.position,
                    }
                },
                orderBy: {
                    position: "asc"
                }
            });
        }

        const userProgress = await db.userProgress.findUnique({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId
                }
            }
        });

        return {
            chapter,
            nextChapter,
            userProgress,
            course,
            purchase,
            attachments,
            muxData
        };

    } catch(error) {
        console.log("Error in Get Chapter action ", error);
        return {
            chapter: null,
            course: null,
            attachments: [],
            muxData: null,
            nextChapter: null,
            userProgress: null,
            purchase:null
        };
    }
}