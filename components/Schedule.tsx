import { allAssessments, allHomework, allLectures } from "contentlayer/generated"
import { ReactNode } from "react"
import { FormattedDate } from "./FormattedDate"
import Link from "next/link"

export type LectureScheduleItemDetails = {
    type: "lecture"
    title: string
    body: typeof allLectures[0]["body"]
}

export type AssignmentScheduleItemDetails = {
    type: "assignment"
    title: string
    event?: string
    href: string
    isReleased: boolean
    releaseDate?: Date
}

export type ScheduleItem = {
    date: Date
} & (LectureScheduleItemDetails | AssignmentScheduleItemDetails)

export function getSchedule(section: string | null): ScheduleItem[] {
    const homework = allHomework.flatMap(hw => {
        const shared = {
            type: "assignment" as const,
            title: hw.title,
            href: `/assignments/hw/${hw.slug}`,
            isReleased: hw.isReleased,
            releaseDate: hw.releaseDate && new Date(hw.releaseDate),
        }

        return [
            {
                ...shared,
                event: "Due",
                date: new Date(hw.dueDate),
            },
            ...(hw.auxiliaryDates ?? []).map(aux => ({
                ...shared,
                event: aux.name,
                date: new Date(aux.date),
            })),    
        ]
    })

    const assessments = allAssessments.map(a => ({
        type: "assignment" as const,
        title: a.title,
        href: `/assignments/assessment/${a.slug}`,
        isReleased: a.isReleased,
        releaseDate: a.releaseDate && new Date(a.releaseDate),
        date: new Date(a.assessmentDate),
    }))

    const lectures = allLectures.map(l => ({
        type: "lecture" as const,
        title: l.title,
        body: l.body,
        date: l.dates[section] && new Date(l.dates[section]),
    })).filter(l => l.date)

    const schedule = [...homework, ...assessments, ...lectures]
    return schedule.toSorted((a, b) => a.date.getTime() - b.date.getTime())
}

export function ScheduleRow({ date, ...details }: ScheduleItem) {
    let content: ReactNode = null
    if (details.type === "lecture") {
        content = <>🧑‍🏫 {details.title}</>
    } else if (details.type === "assignment") {
        const title = details.isReleased ?
            <Link href={details.href} className="link font-bold">{details.title}</Link> :
            <span className="italic">{details.title}{details.releaseDate && <> (available <strong><FormattedDate date={details.releaseDate} format="M/d" /></strong>)</>}</span>
        content = <span className={details.isReleased ? "" : "opacity-60"}>📋 {title}<span className="italic">{details.event && ` - ${details.event}`} @ <FormattedDate date={date} format="h:mmaa" /></span></span>
    }

    return <tr className="border-b border-neutral-300 dark:border-neutral-600">
        <td className="text-left py-2 font-bold"><FormattedDate date={date} format="M/d" /></td>
        <td className="text-left py-2">{content}</td>
    </tr>
}

export function ScheduleTable({ items }: { items: ScheduleItem[] }) {
    return <table className="w-full">
        <thead>
            <tr className="border-b-4 border-neutral-300 dark:border-neutral-600">
                <th className="text-left pb-2 min-w-16">Date</th>
                <th className="text-left pb-2 w-full">Event</th>
            </tr>
        </thead>
        <tbody className="lg:table-row-group">
            {items.map((item, index) => <ScheduleRow {...item} key={index} />)}
        </tbody>
    </table>
}