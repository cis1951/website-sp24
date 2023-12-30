import { allHomework } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import { useMDXComponent } from 'next-contentlayer/hooks'
import { mdxComponents } from '@/components/mdx'
import { Card } from '@/components/Card'
import { Prose } from '@/components/Prose'

export async function generateStaticParams() {
    if (!allHomework.length) return [{ slug: "dummy" }]

    return allHomework.map(page => ({
        slug: page.slug,
    }))
}

export default function Homework({ params }: { params: { slug: string } }) {
    const page = allHomework.find(page => page.slug === params.slug)
    if (!page) notFound()

    const MDXContent = useMDXComponent(page.body.code)
    const content = <MDXContent components={mdxComponents} />

    return <Card title={<h1>{page.title}</h1>}>
        <Prose>
            {content}
        </Prose>
    </Card>
}