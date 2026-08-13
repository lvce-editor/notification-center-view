import { build } from 'esbuild'
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const root = join(import.meta.dirname, '..', '..', '..')
const dist = join(root, '.tmp', 'dist')

const getVersion = (): string => {
  const version = process.env.RG_VERSION || process.env.GIT_TAG || '0.0.0-dev'
  return version.startsWith('v') ? version.slice(1) : version
}

await rm(dist, { force: true, recursive: true })
await mkdir(join(dist, 'dist'), { recursive: true })
await build({
  bundle: true,
  entryPoints: [join(root, 'packages', 'notification-center-view', 'src', 'notificationCenterWorkerMain.ts')],
  external: ['electron', 'node:buffer', 'node:worker_threads'],
  format: 'esm',
  outfile: join(dist, 'dist', 'notificationCenterWorkerMain.js'),
  platform: 'browser',
})

const packageJsonPath = join(root, 'packages', 'notification-center-view', 'package.json')
const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'))
delete packageJson.devDependencies
delete packageJson.jest
delete packageJson.scripts
packageJson.main = 'dist/notificationCenterWorkerMain.js'
packageJson.version = getVersion()
await writeFile(join(dist, 'package.json'), `${JSON.stringify(packageJson, null, 2)}\n`)
await cp(join(root, 'README.md'), join(dist, 'README.md'))
await cp(join(root, 'LICENSE'), join(dist, 'LICENSE'))
