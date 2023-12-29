import { defineDocumentType, makeSource } from 'contentlayer/source-files'

export const Page = defineDocumentType(() => ({
    name: 'Page',
    filePathPattern: `pages/**/*.mdx`,
    contentType: 'mdx',
    fields: {
        title: { type: 'string', required: true },
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
    },
    computedFields: {
        slug: { type: 'string', resolve: page => page._raw.flattenedPath.slice("homework/".length) },
    },
}))

export const Lecture = defineDocumentType(() => ({
    name: 'Lecture',
    filePathPattern: `lectures/**/*.mdx`,
    contentType: 'mdx',
    fields: {
        title: { type: 'string', required: true },
    },
    computedFields: {
        slug: { type: 'string', resolve: page => page._raw.flattenedPath.slice("lectures/".length) },
    },
}))

export const Exam = defineDocumentType(() => ({
    name: 'Exam',
    filePathPattern: `exams/**/*.mdx`,
    contentType: 'mdx',
    fields: {
        title: { type: 'string', required: true },
    },
    computedFields: {
        slug: { type: 'string', resolve: page => page._raw.flattenedPath.slice("exams/".length) },
    },
}))

export default makeSource({
    contentDirPath: 'content',
    documentTypes: [Page, Homework, Lecture, Exam],
})