import { Assessment, allAssessments } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import { useMDXComponent } from 'next-contentlayer/hooks'
import { mdxComponents } from '@/components/mdx'
import { Card } from '@/components/Card'
import { Prose } from '@/components/Prose'

export async function generateStaticParams() {
    if (!allAssessments.length) return [{ slug: "dummy" }]

    return allAssessments.map(page => ({
        slug: page.slug,
    }))
}

function AssessmentContent({ page }: { page: Assessment }) {
    const MDXContent = useMDXComponent(page.body.code)
    return <MDXContent components={mdxComponents} />
}

export default function Assessment({ params }: { params: { slug: string } }) {
    const page = allAssessments.find(page => page.slug === params.slug)
    if (!page) notFound()

    const content = page.body ?
        <AssessmentContent page={page} /> :
        "This assignment hasn't been released yet."

    return <Card title={<h1>{page.title}</h1>}>
        <Prose>
            {content}
        </Prose>
    </Card>
}