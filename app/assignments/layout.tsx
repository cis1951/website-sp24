import { ReactNode } from "react"
import { MenuItemActivator } from "../menu"

export default function RootLayout({ children }: { children: ReactNode }) {
    return <>
        <MenuItemActivator item="assignments" />
        {children}
    </>
}
