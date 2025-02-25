/* eslint-disable @typescript-eslint/no-unused-vars */
import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { VideoPlayer } from "./_components/video-player";

const ChapterIdPage = async ({
    params
}: {
    params: {
        courseId: string;
        chapterId: string;
    }
}) => {

    const {userId} = await auth();

    if(!userId) {
        return redirect("/");
    }

    const {
        course,
        chapter,
        muxData,
        attachments,
        userProgress,
        purchase,
        nextChapter
    } = await getChapter({
        courseId: params.courseId,
        userId,
        chapterId: params.chapterId
    });

    if(!chapter || !course) {
        return redirect("/");
    }

    // const isLocked = !chapter.isFree && !purchase;
    const isUnlocked = chapter.isFree || purchase;

    const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div>
        {userProgress?.isCompleted && (
            <Banner
                variant="success"
                label="You have finished this chapter already. Keep it up!"
            />
        )}

        {!isUnlocked && (
            <Banner
                variant="warning"
                label="Please purchase this course before accessing this chapter. Thank you."
            />
        )}

        <div className="flex flex-col mx-auto max-w-4xl pb-20">
            <div className="p-4">
                <VideoPlayer
                    chapterId={chapter.id}
                    courseId={params.courseId}
                    title={chapter.title}
                    nextChapterId={nextChapter?.id}
                    isLocked={!isUnlocked}
                    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                    playbackId={muxData?.playbackId!}
                    completeOnEnd={completeOnEnd}
                />
            </div>
        </div>
    </div>
  )
}

export default ChapterIdPage