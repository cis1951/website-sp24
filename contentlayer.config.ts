import { defineDocumentType, defineNestedType, makeSource } from 'contentlayer/source-files'
import rehypePrism from '@mapbox/rehype-prism'
import sections from './sections.json'

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
    },
}))

const LectureDates = defineNestedType(() => {
    const fields = {}
    sections.forEach(section => {
        fields[section] = { type: 'date', required: false }
    })
    
    return {
        name: 'LectureDates',
        fields,
    }
})

export const Lecture = defineDocumentType(() => ({
    name: 'Lecture',
    filePathPattern: `lectures/**/*.mdx`,
    contentType: 'mdx',
    fields: {
        title: { type: 'string', required: true },
        dates: {
            type: 'nested',
            of: LectureDates,
            required: true,
        },
    },
    computedFields: {
        slug: { type: 'string', resolve: page => page._raw.flattenedPath.slice("lectures/".length) },
    },
}))

export default makeSource({
    contentDirPath: 'content',
    documentTypes: [Page, Homework, Assessment, Lecture],
    mdx: {
        rehypePlugins: [rehypePrism],
    },
})