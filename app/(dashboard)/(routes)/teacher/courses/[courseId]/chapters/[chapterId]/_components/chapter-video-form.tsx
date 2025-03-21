"use client";

import * as z from "zod";

import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import MuxPlayer from "@mux/mux-player-react";
import { Chapter, MuxData } from "@prisma/client";
import axios from "axios";
import { Pencil, PlusCircle, Video, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ChapterVideoFormProps {
  initialData: Chapter & {
    muxData?: MuxData | null
  };
  courseId: string;
  chapterId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = z.object({
  videoUrl: z.string().min(1),
});

const ChapterVideoForm = ({ initialData, courseId, chapterId }: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const router = useRouter();

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, data);
      toast.success("Chapter Updated!");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter Video
        <Button variant={"ghost"} onClick={toggleEdit}>
          {isEditing && (
            <>
              <X className="h-4 w-4" />
              Cancel
            </>
          )}

          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4" />
              Add a video
            </>
          )}

          {!isEditing && initialData.videoUrl && (
            <>
              <>
                <Pencil className="h-4 w-4" />
                Edit video
              </>
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.videoUrl ? (
          <div className="flex justify-center items-center h-60 bg-slate-200 rounded-md">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative mt-2 aspect-video">
            <MuxPlayer
              playbackId={initialData.muxData?.playbackId || ""}
              autoPlay
            />
          </div>
        ))}

      {isEditing && (
        <div>
          <FileUpload
            endpoint={"chapterVideo"}
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />

          <div className="text-xs text-muted-foreground mt-4">
            Upload this chapter&apos;s video
          </div>
        </div>
      )}

      {initialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Videos can take a few moments to process. Refresh the page if video does not appear.
        </div>
      )}
    </div>
  );
};

export default ChapterVideoForm;
