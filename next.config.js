const { withContentlayer } = require('next-contentlayer')

/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: "/~cis1951",
    output: "export",
    pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
    trailingSlash: true,
}

module.exports = withContentlayer(nextConfig)