import { ReactNode } from "react"

export type ProseProps = {
    children: ReactNode
}

export function Prose({ children }: ProseProps) {
    return <div className="prose prose-neutral dark:prose-invert max-w-none prose-h1:mb-4 prose-h2:mt-6 prose-h2:mb-2 prose-p:my-2 prose-pre:my-2 prose-pre:border prose-pre:border-transparent prose-pre:max-w-full prose-pre:dark:border-white/10 prose-blockquote:my-2 prose-ul:my-2">
        {children}
    </div>
}