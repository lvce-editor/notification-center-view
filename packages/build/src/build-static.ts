import { cp, mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = join(import.meta.dirname, '..', '..', '..')
const sharedProcessUrl = import.meta.resolve('@lvce-editor/shared-process')
const sharedProcess = await import(sharedProcessUrl)

process.env.PATH_PREFIX = '/notification-center-view'
const { commitHash } = await sharedProcess.exportStatic({
  root,
  extensionPath: '',
  testPath: 'packages/e2e',
})

const rendererWorkerPath = join(root, 'dist', commitHash, 'packages', 'renderer-worker', 'dist', 'rendererWorkerMain.js')
const workerPath = join(root, '.tmp', 'dist', 'dist', 'notificationCenterWorkerMain.js')

const getRemoteUrl = (path: string): string => {
  const url = pathToFileURL(path).toString().slice(8)
  return `/remote/${url}`
}

const content = await readFile(rendererWorkerPath, 'utf8')
const remoteDeclaration = `const notificationCenterViewWorkerUrl = \`${getRemoteUrl(workerPath)}\`;`
const productionDeclaration =
  'const notificationCenterViewWorkerUrl = `${assetDir}/packages/notification-center-view/dist/notificationCenterWorkerMain.js`;'

if (!content.includes(remoteDeclaration)) {
  throw new Error('notification center worker development URL not found')
}

await writeFile(rendererWorkerPath, content.replace(remoteDeclaration, productionDeclaration))

const productionWorkerPath = join(root, 'dist', commitHash, 'packages', 'notification-center-view', 'dist', 'notificationCenterWorkerMain.js')
await mkdir(join(productionWorkerPath, '..'), { recursive: true })
await cp(workerPath, productionWorkerPath)
await cp(join(root, 'dist'), join(root, '.tmp', 'static'), { recursive: true })
