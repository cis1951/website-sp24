import { allLectures } from "contentlayer/generated"
import { NextRequest } from "next/server"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { createReadStream } from "node:fs"
import { Readable } from "node:stream"

export async function generateStaticParams() {
    const params = allLectures.flatMap(lecture => {
        return lecture.files.map((filename: string) => ({
            slug: lecture.slug,
            filename,
        }))
    })

    if (!params.length) return [{ slug: "dummy", filename: "dummy" }]

    return params
}

const contentTypes = {
    txt: "text/plain",
    pdf: "application/pdf",
}

export async function GET(_request: NextRequest, { params }: { params: { slug: string, filename: string } }) {
    const lecture = allLectures.find(lecture => lecture.slug === params.slug)
    if (!lecture) return new Response("Not found", { status: 404 })

    // Ensure filename isn't a directory traversal attack
    if (params.filename.includes("/")) {
        return new Response("Woah woah woah! What are you trying to pull?", { status: 400 })
    }

    // Ensure filename exists in the lecture record
    if (!lecture.files.includes(params.filename)) {
        return new Response("Not found", { status: 404 })
    }

    const extension = params.filename.split(".").pop() ?? ""
    const contentType = contentTypes[extension] ?? "application/octet-stream"

    const path = join(dirname(fileURLToPath(import.meta.url)), "../../../../content/lectures", lecture.slug, params.filename)
    const stream = createReadStream(path)

    const response = new Response(Readable.toWeb(stream))
    response.headers.set("Content-Type", contentType)
    return response
}