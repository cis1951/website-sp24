import { formattedAssessments, formattedHomework, AssignmentTable } from "@/app/assignments/page"

const threshold = 5 * 7 * 24 * 60 * 60 * 1000 // 3 weeks
const thresholdText = "3 weeks"

const upcoming = [...formattedHomework, ...formattedAssessments].filter(({ sortDate }) => {
    const remainingTime = sortDate.getTime() - new Date().getTime()
    return remainingTime >= 0 && remainingTime <= threshold
})

export function UpcomingAssignments() {
    if (!upcoming.length) return <div>
        There are no upcoming assignments in the next {thresholdText}.
    </div>

    return <>
        <div className="mb-4">There are {upcoming.length} {upcoming.length === 1 ? "assignment" : "assignments"} in the next {thresholdText}:</div>
        <AssignmentTable assignments={upcoming} />
    </>
}