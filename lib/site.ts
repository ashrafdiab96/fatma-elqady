/** The GitHub Pages sub-path (set in next.config.mjs). Next adds it to <Link>s automatically, but not to raw src/href strings. */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

/** Prefix a file in /public with the base path, e.g. asset('/signature.png'). */
export const asset = (path: string) => `${basePath}${path}`

export const email = 'fatmaelkady@gmail.com'
export const behance = 'https://www.behance.net/fatmaelkad8fc'
export const linkedin = 'https://www.linkedin.com/in/fatmaelqady/'
