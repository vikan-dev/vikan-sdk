import { mkdir, rm, copyFile } from 'node:fs/promises'

await rm('dist', { recursive: true, force: true })
await mkdir('dist', { recursive: true })
const build = await Bun.build({
  entrypoints: ['src/index.ts', 'src/webhooks.ts', 'src/events.ts', 'src/agent.ts'],
  outdir: 'dist', target: 'node', format: 'esm', splitting: true,
  packages: 'external', sourcemap: 'none',
})
if (!build.success) throw new AggregateError(build.logs, 'Build failed')
await rm('types', { recursive: true, force: true })
const declarations = Bun.spawn(['bun', 'x', '--no-install', 'tsc', '-p', 'tsconfig.build.json'], { stdout: 'inherit', stderr: 'inherit' })
if (await declarations.exited !== 0) throw new Error('Declaration build failed')
await copyFile('src/generated/manifest.json', 'dist/contract-manifest.json')
await copyFile('src/generated/runtime.d.ts', 'types/generated/runtime.d.ts')
await copyFile('src/generated/agent-runtime.d.ts', 'types/generated/agent-runtime.d.ts')
await copyFile('src/generated/agent-manifest.json', 'dist/agent-contract-manifest.json')
console.log('Built ESM package and TypeScript declarations.')
