"use client"

import { useState } from "react"
import { ScheduleTable, getSchedule } from "./Schedule"

const threshold = 3 * 7 * 24 * 60 * 60 * 1000 // 3 weeks
const thresholdText = "3 weeks"

const schedule = getSchedule(null)

export function UpcomingAssignments() {
    const [now] = useState(new Date())
    const upcoming = schedule.filter(item => {
        const diff = item.date.getTime() - now.getTime()
        return diff >= 0 && diff < threshold
    })

    if (!upcoming.length) return <div>
        There are no upcoming assignments in the next {thresholdText}.
    </div>

    return <>
        <div className="mb-4">There are {upcoming.length} {upcoming.length === 1 ? "assignment" : "assignments"} in the next {thresholdText}:</div>
        <ScheduleTable items={upcoming} />
    </>
}