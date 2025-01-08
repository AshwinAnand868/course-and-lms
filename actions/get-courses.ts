import { db } from "@/lib/db";
import { Category, Course } from "@prisma/client";
import { getProgress } from "./get-progress";

type CourseWithCategoryAndProgress = Course & {
    category: Category | null;
    chapters: {
        id: string
    }[];
    progress: number | null;
}

type GetCourses = {
    userId: string;
    title?: string;
    categoryId?: string;
}

export const getCourses = async ({
    userId,
    title,
    categoryId,
}: GetCourses): Promise<CourseWithCategoryAndProgress[]> => {

    try {
        const courses = await db.course.findMany({
            where: {
                isPublished: true,
                title: {
                    contains: title
                },
                categoryId,
            },
            include: {
                category: true,
                chapters: {
                    where: {
                        isPublished: true,
                    },
                    select: {
                        id: true
                    }
                },
                purchases: {
                    where: {
                        userId,
                    }
                }
            },
            orderBy: {
                createdAt: "desc",
            }
        });

        const coursesWithProgress: CourseWithCategoryAndProgress[] = await Promise.all(
            courses.map(async(course) => {
                if(course.purchases.length === 0) {
                    return {
                        ...course,
                        progress: null
                    }
                }

                const progressPercentage = await getProgress(userId, course.id);

                return {
                    ...course,
                    progress: progressPercentage
                };
            })
        );

        return coursesWithProgress;
    } catch (error) {
        console.log("Error in get courses action ", error);    
        return [];
    }
}