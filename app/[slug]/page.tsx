import { allPages } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import { useMDXComponent } from 'next-contentlayer/hooks'
import { mdxComponents } from '@/components/mdx'
import { Card } from '@/components/Card'
import { Prose } from '@/components/Prose'
import { MenuItemActivator } from '@/app/menu'

export async function generateStaticParams() {
    return allPages.map(page => ({
        slug: page.slug,
    })).filter(({ slug }) => slug)
}

export default function Page({ params }: { params: { slug: string } }) {
    const page = allPages.find(page => page.slug === params.slug)
    if (!page) notFound()

    const MDXContent = useMDXComponent(page.body.code)
    const content = <MDXContent components={mdxComponents} />
    
    if (page.customLayout) return <>
        <MenuItemActivator item={page.activeMenuItem ?? null} />
        {content}
    </>

    return <Card title={<h1>{page.title}</h1>}>
        <MenuItemActivator item={page.activeMenuItem ?? null} />
        <Prose>
            {content}
        </Prose>
    </Card>
}