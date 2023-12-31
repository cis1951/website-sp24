import { allHomework, allAssessments } from 'contentlayer/generated'
import { Card } from '@/components/Card'
import Link from 'next/link'
import { FormattedDate } from '@/components/FormattedDate'

type Assignment = {
    title: string
    href: string
    isReleased: boolean
    releaseDate?: Date
    dates: {
        name: string
        date: Date
        specifyTime: boolean
    }[]
    sortDate: Date
}

export const formattedHomework: Assignment[] = allHomework.map(hw => {
    const due = new Date(hw.dueDate)

    return {
        title: hw.title,
        href: `/assignments/hw/${hw.slug}`,
        isReleased: hw.isReleased,
        releaseDate: hw.releaseDate && new Date(hw.releaseDate),
        dates: [
            ...(hw.auxiliaryDates ?? []).map(aux => ({
                name: aux.name,
                date: new Date(aux.date),
                specifyTime: true,
            })),
            {
                name: "Due",
                date: due,
                specifyTime: true,
            }
        ],
        sortDate: new Date(hw.dueDate),
    }
})

export const formattedAssessments = allAssessments.map(a => {
    const date = new Date(a.assessmentDate)

    return {
        title: a.title,
        href: `/assignments/assessment/${a.slug}`,
        isReleased: a.isReleased,
        releaseDate: a.releaseDate && new Date(a.releaseDate),
        dates: [
            {
                name: "Scheduled",
                date,
                specifyTime: false,
            }
        ],
        sortDate: date,
    }
})

function AssignmentRow({ title, href, isReleased, releaseDate, dates }: Assignment) {
    let className = "border-b border-neutral-300 dark:border-neutral-600 py-2 last:pb-0 last:border-0 block lg:table-row w-full"
    if (!isReleased) {
        className += " opacity-50"
    }

    return <tr className={className}>
        <td className="lg:py-2 w-full block lg:table-cell">
            {isReleased ?
                <Link href={href} className="link font-bold">{title}</Link> :
                <span className="italic">{title}{releaseDate && <> (available <strong><FormattedDate date={releaseDate} format="M/d" /></strong>)</>}</span>}
        </td>
        <td className="lg:py-2 block lg:table-cell">
            {dates.map((item, index) => <div key={index}>
                {item.name} <strong><FormattedDate date={item.date} format={item.specifyTime ? "E, M/d @ h:mmaa" : "E, M/d"} /></strong>
            </div>)}
        </td>
    </tr>
}

export function AssignmentTable({ assignments: raw }: { assignments: Assignment[] }) {
    const data = raw.toSorted((a, b) => a.sortDate.getTime() - b.sortDate.getTime())

    return <table className="block lg:table w-full">
        <thead>
            <tr className="border-b-4 border-neutral-300 dark:border-neutral-600 sr-only lg:not-sr-only">
                <th className="text-left pb-2 w-full">Name</th>
                <th className="text-left pb-2 lg:min-w-64">Date</th>
            </tr>
        </thead>
        <tbody className="block lg:table-row-group">
            {data.map(assignment => <AssignmentRow {...assignment} key={assignment.href} />)}
        </tbody>
    </table>
}

export default function Assignments() {
    if (!allHomework.length && !allAssessments.length) {
        return <Card>
            There are currently no assignments for this class.
        </Card>
    }

    return <div>
        <div className="mb-4">Here you'll find all assignments for this class.</div>
        {allHomework.length > 0 && <Card title={<h2>Homework</h2>} margin={allAssessments.length > 0}>
            <AssignmentTable assignments={formattedHomework} />
        </Card>}
        {allAssessments.length > 0 && <Card title={<h2>Assessments</h2>}>
            <AssignmentTable assignments={formattedAssessments} />
        </Card>}
    </div>
}