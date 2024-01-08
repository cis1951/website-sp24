import { Card } from '@/components/Card'
import { AssignmentTable, formattedAssessments, formattedHomework } from '@/components/AssignmentTable'

export default function Assignments() {
    if (!formattedHomework.length && !formattedAssessments.length) {
        return <Card>
            There are currently no assignments for this class.
        </Card>
    }

    return <div>
        <div className="mb-4">Here you'll find all assignments for this class.</div>
        {formattedHomework.length > 0 && <Card title={<h2>Homework</h2>} margin={formattedAssessments.length > 0}>
            <AssignmentTable assignments={formattedHomework} />
        </Card>}
        {formattedAssessments.length > 0 && <Card title={<h2>Assessments</h2>}>
            <AssignmentTable assignments={formattedAssessments} />
        </Card>}
    </div>
}