"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ReactNode, createContext, useContext, useEffect, useState } from "react"

export type MenuItemProps = {
    id: string
    title: string
    icon: string
    href: string
}

export const menuItems: MenuItemProps[] = [
    {
        id: "home",
        title: "Home",
        icon: "🏠",
        href: "/",
    },
    {
        id: "syllabus",
        title: "Syllabus",
        icon: "📄",
        href: "/syllabus",
    },
    {
        id: "schedule",
        title: "Schedule",
        icon: "📅",
        href: "/schedule",
    },
    {
        id: "assignments",
        title: "Assignments",
        icon: "📋",
        href: "/assignments",
    },
    {
        id: "codestyle",
        title: "Style Guide",
        icon: "💅",
        href: "/codestyle",
    },
    {
        id: "resources",
        title: "Resources",
        icon: "🧑‍💻",
        href: "/resources",
    },
    {
        id: "github",
        title: "GitHub",
        icon: "☁️",
        href: "https://github.com/cis1951",
    },
    {
        id: "ed",
        title: "Ed Discussion",
        icon: "💬",
        href: "https://edstem.org/us/courses/54318/discussion/",
    },
]

export type MenuCoordinator = {
    activeItem: string | null
    setActiveItem: (id: string | null) => void
}

const MenuContext = createContext<MenuCoordinator | null>(null)

export function MenuContextProvider({ children }: { children: ReactNode }) {
    const pathname = usePathname()
    const [activeState, setActiveState] = useState<string | null>(null)

    return <MenuContext.Provider value={{
        activeItem: activeState,
        setActiveItem(item) {
            setActiveState(item)
        }
    }}>
        {children}
    </MenuContext.Provider>
}

export function useMenuContext(): MenuCoordinator {
    const context = useContext(MenuContext)
    if (!context) throw new Error("useMenuContext must be called inside a MenuContextProvider")
    
    return context
}

export type MenuItemActivatorProps = {
    item: string | null
}

export function MenuItemActivator({ item }: MenuItemActivatorProps) {
    const context = useMenuContext()
    useEffect(() => {
        context.setActiveItem(item)
    }, [])

    return null
}

function MenuItem({ id, title, icon, href }: MenuItemProps) {
    const context = useMenuContext()
    const isActive = id === context.activeItem

    let className = "block px-3 py-2 rounded-xl group relative bg-opacity-0"
    if (isActive) {
        className += " bg-gradient-to-br from-cyan-600 to-purple-600 text-white"
    } else {
        className += " transition-[background-color] active:bg-neutral-200 dark:active:bg-neutral-700 md:dark:active:bg-neutral-800"
    }

    let containerClassName = "flex gap-3 transition-[margin-left] justify-center text-center md:text-left"
    if (!isActive) containerClassName += " md:group-hover:ml-1"

    return <Link className={className} href={href}>
        <div className={containerClassName}>
            <div className="w-4">{icon}</div>
            <div className="md:grow line-clamp-1 overflow-hidden overflow-ellipsis">{title}</div>
            <div className="opacity-40 hidden sm:block">→</div>
        </div>
        <div className="absolute pointer-events-none inset-0 rounded-xl border border-black/30 dark:border-white/30 opacity-0 group-hover:opacity-100" />
    </Link>
}

export function Menu() {
    return <div className="w-full md:w-64 grid grid-cols-2 md:flex flex-col gap-0.5 md:gap-1">
        {menuItems.map(item => <MenuItem key={item.id} {...item} />)}
    </div>
}