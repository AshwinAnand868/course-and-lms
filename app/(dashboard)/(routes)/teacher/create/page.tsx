"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// Form Schema
const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is Required.",
  }),
});

const CreatePage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });
  
  const router = useRouter();

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
        const response = await axios.post('/api/courses', values);
        router.push(`/teacher/courses/${response.data.id}`); // response.data is not part of our api - it is by axios
        toast.success("Course created");
    } catch {
        toast.error('Something went wrong!')
    }
  };

  return (
    // center the element when the width gets more than the specified width
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-3xl">Name your course</h1>
        <p>
          What would you like to name your course? Don&apos;t worry, you can
          change this later.
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Advanced Web Development'"
                      {...field} // field spread - onBlur, onChange...
                    />
                  </FormControl>
                  <FormDescription>
                    What will you teach in this course?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
                <Link href="/">
                    <Button
                        type="button"
                        variant="ghost"
                    >
                        Cancel
                    </Button>
                </Link>
                <Button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                >
                    Continue
                </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreatePage;
