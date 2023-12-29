import { MDXComponents } from "mdx/types";
import Link from "next/link";

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
}