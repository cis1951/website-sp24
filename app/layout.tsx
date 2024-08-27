import "@/styles/global.css"
import "prism-themes/themes/prism-atom-dark.css"
import { Menu, MenuContextProvider } from "./menu"
import { TimezoneNotice } from "@/components/TimezoneNotice"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
    title: {
        default: "CIS 1951 (Spring 2024)",
        template: "%s | CIS 1951 (Spring 2024)",
    },
    description: "An intro to iOS development course at the University of Pennsylvania.",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                <MenuContextProvider>
                    <div className="md:container mx-auto md:px-8 md:py-16 print:md:py-8">
                        <a className="block bg-gradient-to-br from-cyan-600 to-purple-600 text-center px-4 py-2 md:rounded-lg md:mb-8 font-bold text-sm sm:text-base" href="/~cis1951">
                            This website is for a previous semester and will not be updated. Click or tap on this banner to go to the current CIS 1951 website.
                        </a>
                        <h1 className="hidden md:block print:block">
                            <Link href="/" className="flex flex-row items-center gap-4">
                                <div className="md:text-8xl print:text-4xl w-fit font-bold text-transparent bg-clip-text bg-gradient-to-br from-cyan-600 to-purple-600 dark:from-cyan-500 dark:to-purple-500">CIS 1951</div>
                                <div className="inline-block font-bold text-xl px-4 py-1 align-middle rounded-lg bg-gradient-to-br from-cyan-600 to-purple-600 text-white">Spring 2024</div>
                            </Link>
                        </h1>
                        <div className="md:mt-8 md:flex flex-nowrap gap-4">
                            <div className="flex flex-col items-center bg-neutral-50 dark:bg-neutral-800 md:bg-transparent dark:md:bg-transparent pt-4 md:pt-0 print:hidden">
                                <h1 className="text-center mb-3 md:hidden text-3xl w-fit font-bold text-transparent bg-clip-text bg-gradient-to-br from-cyan-700 to-purple-700 dark:from-cyan-400 dark:to-purple-400">CIS 1951 <span className="font-light">• Spring 2024</span></h1>
                                <div className="px-4 md:px-0 w-full"><Menu /></div>
                                <div className="w-full rounded-t-2xl h-4 bg-white dark:bg-black mt-4 border-t border-neutral-200 dark:border-neutral-700 md:hidden" />
                            </div>
                            <div className="container mx-auto md:w-full md:basis-full p-4 pt-1 md:p-0 md:pt-0">
                                {children}
                                <div className="mt-4 md:mt-8 text-center opacity-40">
                                    <TimezoneNotice />
                                </div>
                            </div>
                        </div>
                    </div>
                </MenuContextProvider>
            </body>
        </html>
    )
}
    