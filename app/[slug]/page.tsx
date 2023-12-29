import { allPages } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import { useMDXComponent } from 'next-contentlayer/hooks'

export async function generateStaticParams() {
    return allPages.map(page => ({
        slug: page.slug,
    })).filter(slug => slug)
}

export default function Page({ params }: { params: { slug: string } }) {
    console.log(allPages)
    const page = allPages.find(page => page.slug === params.slug)
    if (!page) notFound()

    const MDXContent = useMDXComponent(page.body.code)

    return <div className="card">
        <h1 className="text-3xl font-bold mb-2">{page.title}</h1>
        <div className="prose">
            <MDXContent />
        </div>
    </div>
}