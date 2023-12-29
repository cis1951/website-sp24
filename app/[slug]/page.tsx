import { allPages } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import { useMDXComponent } from 'next-contentlayer/hooks'
import { mdxComponents } from '@/components/mdx'

export async function generateStaticParams() {
    return allPages.map(page => ({
        slug: page.slug,
    })).filter(slug => slug)
}

export default function Page({ params }: { params: { slug: string } }) {
    const page = allPages.find(page => page.slug === params.slug)
    if (!page) notFound()

    const MDXContent = useMDXComponent(page.body.code)

    return <div className="card">
        <div className="mb-4 w-fit">
            <h1 className="text-3xl font-bold mb-0.5">{page.title}</h1>
            <div className="bg-gradient-to-r from-cyan-500 to-purple-500 h-1" />
        </div>
        <div className="prose prose-neutral dark:prose-invert max-w-none prose-h1:mb-4 prose-h2:mt-6 prose-h2:mb-2 prose-a:text-cyan-500 prose-a:dark:text-cyan-400 prose-p:my-2 prose-pre:my-2 prose-pre:border prose-pre:border-transparent prose-pre:dark:border-white/10 prose-blockquote:my-2">
            <MDXContent components={mdxComponents} />
        </div>
    </div>
}