import { MDXComponents } from "mdx/types";
import Link from "next/link";
import { Card } from "./Card";
import { Prose } from "./Prose";
import { StaffGrid } from "./StaffGrid";
import { UpcomingAssignments } from "./UpcomingAssignments";
import { FormattedDate } from "./FormattedDate";

export const mdxComponents: MDXComponents = {
    a: ({ href, ...props }) => {
        const prefix = "/~cis1951/"
        if (typeof href === "string") {
            return <Link href={href.startsWith(prefix) ? href.slice(prefix.length - 1) : href} legacyBehavior>
                <a {...props} />
            </Link>
        } else {
            return <a {...props} />
        }
    },
    Card: Card,
    FormattedDate: FormattedDate,
    Prose: Prose,
    StaffGrid: StaffGrid,
    UpcomingAssignments: UpcomingAssignments,
}