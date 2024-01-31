"use client"

import { useState } from "react"
import { ScheduleTable, getSchedule } from "./Schedule"

const threshold = 32 * 24 * 60 * 60 * 1000 - 1 // 31 days
const thresholdText = "31 days"

const schedule = getSchedule(null)

export function UpcomingAssignments() {
    const [now] = useState(new Date())
    const upcoming = schedule.filter(item => {
        const diff = item.date.getTime() - now.getTime()
        return diff >= 0 && diff < threshold
    })

    if (!upcoming.length) return <div>
        No assignments are due in the next {thresholdText}.
    </div>

    return <>
        <div className="mb-4">{upcoming.length} {upcoming.length === 1 ? "assignment is" : "assignments are"} due in the next {thresholdText}:</div>
        <ScheduleTable items={upcoming} />
    </>
}
