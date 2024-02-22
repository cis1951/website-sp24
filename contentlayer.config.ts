import { defineDocumentType, defineNestedType, makeSource } from 'contentlayer/source-files'
import rehypePrism from '@mapbox/rehype-prism'
import sections from './sections.json'
import { readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

export const Page = defineDocumentType(() => ({
    name: 'Page',
    filePathPattern: `pages/**/*.mdx`,
    contentType: 'mdx',
    fields: {
        title: { type: 'string', required: true },
        activeMenuItem: { type: 'string', required: false },
        customLayout: { type: 'boolean', required: false },
    },
    computedFields: {
        slug: {
            type: 'string',
            resolve: page => {
                const path = page._raw.flattenedPath
                if (path === 'pages/index') return '/'
                return path.slice("pages/".length)
            },
        },
    },
}))

export const Homework = defineDocumentType(() => ({
    name: 'Homework',
    filePathPattern: `homework/**/*.mdx`,
    contentType: 'mdx',
    fields: {
        title: { type: 'string', required: true },
        isReleased: { type: 'boolean', required: true },
        releaseDate: { type: 'date', required: false },
        dueDate: { type: 'date', required: true },
        auxiliaryDates: {
            type: 'list',
            of: {
                type: 'nested',
                def: () => ({
                    fields: {
                        name: { type: 'string', required: true },
                        date: { type: 'date', required: true },
                    },
                }),
            },
            required: false,
        },
    },
    computedFields: {
        slug: { type: 'string', resolve: page => page._raw.flattenedPath.slice("homework/".length) },
        body: {
            type: 'mdx',
            resolve(page) {
                if (page.isReleased) return page.body
                return undefined
            },
        },
    },
}))

export const Assessment = defineDocumentType(() => ({
    name: 'Assessment',
    filePathPattern: `assessments/**/*.mdx`,
    contentType: 'mdx',
    fields: {
        title: { type: 'string', required: true },
        isReleased: { type: 'boolean', required: true },
        releaseDate: { type: 'date', required: false },
        assessmentDate: { type: 'date', required: true },
    },
    computedFields: {
        slug: { type: 'string', resolve: page => page._raw.flattenedPath.slice("assessments/".length) },
        body: {
            type: 'mdx',
            resolve(page) {
                if (page.isReleased) return page.body
                return undefined
            },
        },
    },
}))

const LectureDates = defineNestedType(() => {
    const fields = {}
    sections.forEach(section => {
        fields[section.id] = { type: 'date', required: false }
    })
    
    return {
        name: 'LectureDates',
        fields,
    }
})

export const Lecture = defineDocumentType(() => ({
    name: 'Lecture',
    filePathPattern: `lectures/*/data.yaml`,
    contentType: 'data',
    fields: {
        title: { type: 'string', required: true },
        dates: {
            type: 'nested',
            of: LectureDates,
            required: true,
        },
    },
    computedFields: {
        slug: { type: 'string', resolve: page => page._raw.sourceFileDir.slice("lectures/".length) },
        files: {
            type: 'list',
            resolve: page => {
                const contents = readdirSync(join(dirname(fileURLToPath(import.meta.url)), "../../../content", page._raw.sourceFileDir)).filter(file => file !== "data.yaml" && !file.startsWith("."))
                console.log(`Files for ${page._raw.sourceFileDir}: ${contents}`)
                return contents.toSorted((a, b) => {
                    // Sort anything that starts with "slides" first
                    if (a.startsWith("slides") && !b.startsWith("slides")) return -1
                    if (!a.startsWith("slides") && b.startsWith("slides")) return 1

                    // Then sort by name
                    return a.localeCompare(b)
                })
            },
        }
    },
}))

export default makeSource({
    contentDirPath: 'content',
    documentTypes: [Page, Homework, Assessment, Lecture],
    mdx: {
        rehypePlugins: [rehypePrism],
    },
})