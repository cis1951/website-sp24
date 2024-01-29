import { ReactNode } from "react"

export type CardProps = {
    title?: ReactNode
    children: ReactNode
    margin?: boolean
}

export function Card({ title, children, margin = false }: CardProps) {
    let className = "rounded-xl p-4 bg-neutral-50 border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 print:p-0 print:border-0 print:bg-transparent"
    if (margin) className += " mb-4"

    return <div className={className}>
        {title && <div className="mb-4 w-fit text-3xl font-bold">
            {title}
            <div className="bg-gradient-to-r from-cyan-500 to-purple-500 h-1 mt-0.5" />
        </div>}
        {children}
    </div>
}