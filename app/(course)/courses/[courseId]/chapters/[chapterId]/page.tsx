/* eslint-disable @typescript-eslint/no-unused-vars */
import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import Preview from "@/components/preview";
import { Separator } from "@/components/ui/separator";
import { auth } from "@clerk/nextjs/server";
import { File } from "lucide-react";
import { redirect } from "next/navigation";
import CourseEnrollButton from "./_components/course-enroll-button";
import CourseProgressButton from "./_components/course-progress-button";
import { VideoPlayer } from "./_components/video-player";

const ChapterIdPage = async ({
  params,
}: {
  params: {
    courseId: string;
    chapterId: string;
  };
}) => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const {
    course,
    chapter,
    muxData,
    attachments,
    userProgress,
    purchase,
    nextChapter,
  } = await getChapter({
    courseId: params.courseId,
    userId,
    chapterId: params.chapterId,
  });

  if (!chapter || !course) {
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
        <div>
          <div className="p-4 flex flex-col md:flex-row justify-between items-center">
            <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
            {purchase ? (
              <CourseProgressButton
                chapterId={params.chapterId}
                courseId={params.courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
              />
            ) : (
              <CourseEnrollButton
                courseId={params.courseId}
                price={course.price!}
              />
            )}
          </div>
          <Separator/>
          <div>
            <Preview value={chapter.description!} />
          </div>
          {!!attachments.length && (
            <>
                <Separator />
                <div className="p-4">
                    {attachments.map((attachment) => (
                        <a
                            className="flex items-center p-3 w-full bg-sky-200 
                            border text-sky-700 rounded-md hover:underline"
                            href={attachment.url}
                            target="_blank"
                            key={attachment.id}
                        >
                            <File />
                            <p className="line-clamp-1 ">
                                {attachment.name}
                            </p>
                        </a>
                    ))}
                </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
