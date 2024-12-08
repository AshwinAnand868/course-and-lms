"use client";

import * as z from "zod";

import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Course } from "@prisma/client";
import axios from "axios";
import { ImageIcon, Pencil, PlusCircle, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Image is required",
  }),
});

const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const router = useRouter();

  // const { isValid, isSubmitting } = form.formState;

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, data);
      toast.success("Course Updated!");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Image
        <Button variant={"ghost"} onClick={toggleEdit}>
          {isEditing && (
            <>
              <X className="h-4 w-4" />
              Cancel
            </>
          )}

          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className="h-4 w-4" />
              Add an image
            </>
          )}

          {!isEditing && initialData.imageUrl && (
            <>
              <>
                <Pencil className="h-4 w-4" />
                Edit image
              </>
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.imageUrl ? (
          <div className="flex justify-center items-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative mt-2 aspect-video">
            {/* Images are absolute in nextjs */}
            <Image
              alt="Upload"
              fill
              className="object-cover rounded-md"
              src={initialData.imageUrl}
            />
          </div>
        ))}

      {isEditing && (
        <div>
          <FileUpload
            endpoint={"courseAttachment"}
            onChange={(url) => {
              if (url) {
                onSubmit({ imageUrl: url });
              }
            }}
          />

          <div className="text-xs text-muted-foreground mt-4">
            16:9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageForm;
