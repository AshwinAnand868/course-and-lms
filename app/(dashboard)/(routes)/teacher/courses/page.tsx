import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { columns } from "./_components/columns"
import { DataTable } from "./_components/data-table"

// async function getData(): Promise<Payment[]> {
//   // Fetch data from your API here.
//   return [
//     {
//       id: "728ed52f",
//       amount: 100,
//       status: "pending",
//       email: "m@example.com",
//     },
//     // ...
//   ]
// }


const CoursesPage = async () => {

  const { userId } = await auth();

  if(!userId) {
    return redirect("/");
  }

  const courses = await db.course.findMany({
    where: {
      userId: userId
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <div className="p-6">
      <DataTable columns={columns} data={courses} />
    </div>
  )
}

export default CoursesPage