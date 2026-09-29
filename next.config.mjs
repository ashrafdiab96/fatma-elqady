/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/fatma-elqady",
  assetPrefix: "/fatma-elqady/",
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath: "/fatma-elqady",
}

export default nextConfig
