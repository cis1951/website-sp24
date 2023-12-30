"use client"

import { useEffect, useState } from "react"
import locale from "date-fns/locale/en-US"
import { formatInTimeZone } from "date-fns-tz"
import { format } from "date-fns"

export type FormattedDateProps = {
    date: Date
    format: string
}

export const defaultTimezone = "America/New_York"

export function FormattedDate({ date, format: formatStr }: FormattedDateProps) {
    const [value, setValue] = useState(formatInTimeZone(date, defaultTimezone, formatStr, {
        locale,
    }))

    useEffect(() => {
        setValue(format(date, formatStr))
    }, [date, formatStr])

    return value
}