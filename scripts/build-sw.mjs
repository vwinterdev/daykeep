import { createHash } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'

const dist = new URL('../dist/', import.meta.url)
const read = (path) => readFile(new URL(path, dist))
const manifest = JSON.parse(await read('.vite/manifest.json'))
const shell = new Set(['/index.html', '/manifest.webmanifest', '/icons/journal.svg', '/icons/icon-192.png', '/icons/icon-512.png'])
const seen = new Set()

function addChunk(key) {
  if (seen.has(key)) return
  seen.add(key)
  const { file, css = [], assets = [], imports = [] } = manifest[key]
  for (const path of [file, ...css, ...assets]) shell.add(`/${path}`)
  for (const dependency of imports) addChunk(dependency)
}
addChunk('index.html')

// Lazy chunks are cached only if requested; installing never downloads Account or Supabase.
const staticFiles = new Set(shell)
for (const { file, css = [], assets = [] } of Object.values(manifest)) {
  for (const path of [file, ...css, ...assets]) staticFiles.add(`/${path}`)
}
const worker = await readFile(new URL('./sw.js', import.meta.url), 'utf8')
const hash = createHash('sha256').update(worker)
for (const path of staticFiles) hash.update(await read(path.slice(1)))
const version = hash.digest('hex').slice(0, 16)
await writeFile(new URL('sw.js', dist),
  `const CACHE = 'journal-${version}'\nconst SHELL = ${JSON.stringify([...shell])}\nconst STATIC = new Set(${JSON.stringify([...staticFiles])})\n${worker}`,
)
