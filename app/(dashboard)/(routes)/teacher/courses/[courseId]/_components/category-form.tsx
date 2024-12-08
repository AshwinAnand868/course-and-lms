"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { cn } from "@/lib/utils";
import { Course } from "@prisma/client";
import axios from "axios";
import { Pencil, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CategoryFormProps {
  initialData:Course;
  courseId: string;
  options: {
    label: string;
    value: string;
  }[];
}

const formSchema = z.object({
  categoryId: z.string().min(1),
});

const CategoryForm = ({ initialData, courseId, options }: CategoryFormProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: initialData?.categoryId || ""
    },
  });

  const { isValid, isSubmitting } = form.formState;

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
  
  // if there is already selected category for that course in the db
  const selectedOption = options.find((option) => option.value === initialData.categoryId);

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Category
        <Button variant={"ghost"} onClick={toggleEdit}>
          {isEditing ? (
            <>
              <X className="h-4 w-4" />
              Cancel
            </>
          ) : (
            <>
              <Pencil className="h-4 w-4" />
              Edit category
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
        <p className={cn("text-sm mt-2", !initialData.categoryId && "text-slate-500 italic")}>{selectedOption?.label || "No category"}</p>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox options={options} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting}>Save</Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default CategoryForm;
