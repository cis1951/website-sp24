"use client"

import { useEffect, useState } from "react";

export function TimezoneNotice() {
    const [isUsingLocalTimezone, setUsingLocalTimezone] = useState(false)
    useEffect(() => {
        setUsingLocalTimezone(true)
    }, [])
    
    if (isUsingLocalTimezone) return "Dates and times are displayed in your local time zone."
    return "Dates and times are displayed in EST."
}