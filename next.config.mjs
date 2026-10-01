import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js'

/**
 * GitHub Pages serves the site from a project sub-path, so production builds carry it on every URL.
 * `next dev` runs at the root (http://localhost:3000/) for convenience.
 */
export default function config(phase) {
  const basePath = phase === PHASE_DEVELOPMENT_SERVER ? '' : '/fatma-elqady'

  /** @type {import('next').NextConfig} */
  return {
    output: 'export',
    basePath,
    assetPrefix: basePath ? `${basePath}/` : undefined,
    trailingSlash: true,
    images: {
      unoptimized: true,
    },
    env: {
      NEXT_PUBLIC_BASE_PATH: basePath,
    },
  }
}
