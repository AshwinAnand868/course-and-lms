interface CourseViewPageProps {
    params: {
        courseId: string
    }
}

const CourseViewPage = ({
    params
}: CourseViewPageProps) => {
  return (
    <div>{params.courseId}</div>
  )
}

export default CourseViewPage