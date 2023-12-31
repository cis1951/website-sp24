"use client"

import { Card } from "@/components/Card"
import { ScheduleTable, getSchedule } from "@/components/Schedule"
import { useEffect, useState } from "react"
import sections from "@/sections"

export function SchedulePageContent() {
    const [section, setSection] = useState<string | null>(null)
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setSection(localStorage.getItem("cis1951.section.24sp"))
        setIsClient(true)
    }, [])

    const setSectionAndStore = (section: string) => {
        localStorage.setItem("cis1951.section.24sp", section)
        setSection(section)
    }

    if (!isClient) return null

    if (!section) {
        return <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="text-2xl font-bold">Please choose a section:</div>
            <div className="flex gap-4 text-xl">
                {sections.map(section => <button key={section} className="link" onClick={() => setSectionAndStore(section)}>{section}</button>)}
            </div>
            <div className="opacity-70">You can change this later.</div>
        </div>
    }

    const schedule = getSchedule(section)

    return <div>
        <Card margin>
            You're currently viewing the schedule for section <strong>{section}</strong>. <button className="link" onClick={() => {
                setSection(null)
            }}>Switch section...</button>
        </Card>
        <Card title={<h1>Schedule</h1>}>
            <ScheduleTable items={schedule} />
        </Card>
    </div>
}