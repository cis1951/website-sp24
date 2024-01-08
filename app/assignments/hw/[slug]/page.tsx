import { notFound } from 'next/navigation'
import { useMDXComponent } from 'next-contentlayer/hooks'
import { mdxComponents } from '@/components/mdx'
import { Card } from '@/components/Card'
import { Prose } from '@/components/Prose'
import { Homework, allHomework } from 'contentlayer/generated'

export async function generateStaticParams() {
    if (!allHomework.length) return [{ slug: "dummy" }]

    return allHomework.map(page => ({
        slug: page.slug,
    }))
}

function HomeworkContent({ page }: { page: Homework }) {
    const MDXContent = useMDXComponent(page.body.code)
    return <MDXContent components={mdxComponents} />
}

export default function Homework({ params }: { params: { slug: string } }) {
    const page = allHomework.find(page => page.slug === params.slug)
    if (!page) notFound()

    const content = page.body ?
        <HomeworkContent page={page} /> :
        "This assignment hasn't been released yet."

    return <Card title={<h1>{page.title}</h1>}>
        <Prose>
            {content}
        </Prose>
    </Card>
}