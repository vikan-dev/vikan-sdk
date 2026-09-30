import { mkdtemp, readFile, writeFile, mkdir, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { compile, type JSONSchema } from 'json-schema-to-typescript'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const check = process.argv.includes('--check')
const source = resolve(process.argv.slice(2).find(arg => arg !== '--check') ?? resolve(root, '../eztodo'))
const temporary = await mkdtemp(resolve(tmpdir(), 'vikan-sdk-contract-'))
try {
  const child = Bun.spawn(['bun', 'scripts/sdk/export.ts', temporary], { cwd: source, stdout: 'inherit', stderr: 'inherit' })
  if (await child.exited !== 0) throw new Error('Contract export failed; install dependencies in the source repository first.')
  const read = (name: string) => readFile(resolve(temporary, name), 'utf8')
  const manifest = JSON.parse(await read('manifest.json')) as { apiOperations: string[] }
  const options = { bannerComment: '// Generated from @vikan/contract. Do not edit.', unknownAny: true, ignoreMinAndMaxItems: true, additionalProperties: false }
  const operations = await compile(JSON.parse(await read('operations.schema.json')) as JSONSchema, 'Operations', options)
  const events = await compile(JSON.parse(await read('events.schema.json')) as JSONSchema, 'WebhookEvent', options)
  const problem = await compile(JSON.parse(await read('problem.schema.json')) as JSONSchema, 'ApiProblem', options)
  const kinds = `\nexport type ApiOperation = ${manifest.apiOperations.map(value => JSON.stringify(value)).join(' | ')};\n`
  const files = new Map([
    ['runtime.js', await read('runtime.js')],
    ['manifest.json', await read('manifest.json')],
    ['types.ts', operations + '\n' + events + '\n' + problem + kinds],
  ])
  const destination = resolve(root, 'src/generated')
  if (!check) await mkdir(destination, { recursive: true })
  for (const [name, content] of files) {
    const path = resolve(destination, name)
    if (check) {
      const current = await readFile(path, 'utf8')
      // A source commit may advance without changing the public contract.
      if (name === 'manifest.json') {
        if (JSON.parse(current).sha256 !== JSON.parse(content).sha256) throw new Error('Public contract changed. Run bun run sync:contract.')
      } else if (current !== content) throw new Error(`${name} is stale. Run bun run sync:contract.`)
    } else await writeFile(path, content)
  }
  console.log(check ? 'Public contract is current.' : 'Updated generated SDK contract and types.')
} finally {
  await rm(temporary, { recursive: true, force: true })
}
