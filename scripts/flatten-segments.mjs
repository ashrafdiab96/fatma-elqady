// Next's static export writes per-segment prefetch data as nested folders
// (work/<slug>/__next.work/$d$slug/__PAGE__.txt), while the client router requests
// the dot-joined file name (work/<slug>/__next.work.$d$slug.__PAGE__.txt).
// GitHub Pages has no rewrites, so write a flat copy beside each nested file.
import fs from 'node:fs'
import path from 'node:path'

const out = path.resolve('out')
let copied = 0

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (!entry.isDirectory()) continue
    if (entry.name.startsWith('__next.')) flatten(full, dir)
    else walk(full)
  }
}

function flatten(segmentDir, pageDir) {
  for (const entry of fs.readdirSync(segmentDir, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile()) continue
    const file = path.join(entry.parentPath, entry.name)
    const flat = path.join(pageDir, path.relative(pageDir, file).split(path.sep).join('.'))
    if (!fs.existsSync(flat)) { fs.copyFileSync(file, flat); copied += 1 }
  }
}

walk(out)
console.log(`flatten-segments: wrote ${copied} prefetch file(s)`)
