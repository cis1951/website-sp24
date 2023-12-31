import { Card } from "@/components/Card";
import { MenuItemActivator } from "../menu";
import { SchedulePageContent } from "./content";

export default function SchedulePage() {
    return <>
        <MenuItemActivator item="schedule" />
        <SchedulePageContent />
        <noscript>
            <Card>You need to enable JavaScript to view the schedule.</Card>
        </noscript>
    </>
}