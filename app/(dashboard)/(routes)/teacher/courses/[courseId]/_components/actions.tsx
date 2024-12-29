"use client";

import ConfirmModal from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ActionsProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
}

const Actions = ({
  disabled,
  courseId,
  isPublished,
}: ActionsProps) => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();
    const confettiStore = useConfettiStore();

    const onClick= async () => {
        try {
            setIsLoading(true);

            if(isPublished) {
                await axios.patch(`/api/courses/${courseId}/unpublish`);
                toast.success("Course succesfully unpublished.");
            } else {
                await axios.patch(`/api/courses/${courseId}/publish`);
                toast.success("Course succesfully published.");
                confettiStore.onOpen();
            }

            router.refresh();

        } catch {
            console.log("Error on PUBLISH/UNPUBLISH button click");
            toast.error("Something went wrong.")
        } finally {
            setIsLoading(false);
        }
    }

    const onDelete = async () => {

        try {
            setIsLoading(true);

            await axios.delete(`/api/courses/${courseId}`);

            toast.success("Course successfully deleted.")
            router.refresh();
            router.push(`/teacher/courses`);

        } catch(error) {
            console.log("ERROR DELETING THE COURSE ", error);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }

    }
    
  return (
    <div className="flex items-center gap-x-2">
      <Button
        variant={"outline"}
        disabled={disabled || isLoading}
        onClick={onClick}
        size={"sm"}
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size={"sm"} disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default Actions;
