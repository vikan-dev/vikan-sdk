import { mkdtemp, readFile, writeFile, mkdir, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import { generateDtsBundle } from 'dts-bundle-generator'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const check = process.argv.includes('--check')
const source = resolve(process.argv.slice(2).find(arg => arg !== '--check') ?? resolve(root, '../eztodo'))
const temporary = await mkdtemp(resolve(tmpdir(), 'vikan-sdk-agent-'))
try {
  const child = Bun.spawn(['bun', 'scripts/sdk/export-agent.ts', temporary], { cwd: source, stdout: 'inherit', stderr: 'inherit' })
  if (await child.exited !== 0) throw new Error('Agent contract export failed; install source repository dependencies first.')
  // Generate native Zod declarations from the exact same export allowlist.
  // JSON Schema cannot preserve transforms, FormData, or schema.shape.
  const [declarations] = generateDtsBundle([{
    filePath: resolve(source, 'packages/contract/src/sdk-agent-runtime.ts'),
    libraries: { inlinedLibraries: ['@vikan/shared'], importedLibraries: ['zod'] },
    output: { noBanner: true, exportReferencedTypes: false },
  }], { preferredConfigPath: resolve(source, 'packages/contract/tsconfig.json') })
  if (!declarations) throw new Error('Agent declaration export was empty')
  if (/(?:from\s*|import\s*\()(['"])(?!zod\1)[^'"]+\1/.test(declarations)) {
    throw new Error('Agent declarations contain a dependency outside the public zod package')
  }
  const read = (name: string) => readFile(resolve(temporary, name), 'utf8')
  const runtime = await read('agent-runtime.js')
  if (/(?:from\s*|import\s*\()(['"])(?!zod\1)[^'"]+\1/.test(runtime)) {
    throw new Error('Agent runtime contains an unbundled private dependency')
  }
  const manifest = JSON.parse(await read('agent-manifest.json'))
  manifest.declarationsSha256 = createHash('sha256').update(declarations).digest('hex')
  const files = new Map([
    ['agent-runtime.js', runtime],
    ['agent-runtime.d.ts', '// Generated from @vikan/contract. Do not edit.\n' + declarations],
    ['agent-operations.ts', await read('agent-operations.ts')],
    ['agent-manifest.json', JSON.stringify(manifest, null, 2) + '\n'],
  ])
  const destination = resolve(root, 'src/generated')
  if (!check) await mkdir(destination, { recursive: true })
  for (const [name, content] of files) {
    const path = resolve(destination, name)
    if (check) {
      const current = await readFile(path, 'utf8')
      if (name === 'agent-manifest.json') {
        const previous = JSON.parse(current)
        if (previous.sha256 !== manifest.sha256 || previous.declarationsSha256 !== manifest.declarationsSha256) {
          throw new Error('Agent contract changed. Run bun run sync:agent.')
        }
      } else if (current !== content) throw new Error(`${name} is stale. Run bun run sync:agent.`)
    } else await writeFile(path, content)
  }
  console.log(check ? 'Agent contract is current.' : 'Updated generated device SDK contract and types.')
} finally {
  await rm(temporary, { recursive: true, force: true })
}
