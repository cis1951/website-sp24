import { allAssessments, allHomework } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import { useMDXComponent } from 'next-contentlayer/hooks'
import { mdxComponents } from '@/components/mdx'
import { Card } from '@/components/Card'
import { Prose } from '@/components/Prose'
import { MenuItemActivator } from '@/app/menu'

export async function generateStaticParams() {
    return allAssessments.map(page => ({
        slug: page.slug,
    })).filter(slug => slug)
}

export default function Assessment({ params }: { params: { slug: string } }) {
    const page = allAssessments.find(page => page.slug === params.slug)
    if (!page) notFound()

    const MDXContent = useMDXComponent(page.body.code)
    const content = <MDXContent components={mdxComponents} />

    return <Card title={<h1>{page.title}</h1>}>
        <Prose>
            {content}
        </Prose>
    </Card>
}