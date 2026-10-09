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
const remoteUrl = getRemoteUrl(workerPath)
const remoteOccurrence = `\`${remoteUrl}\``
const productionOccurrence = '`${assetDir}/packages/notification-center-view/dist/notificationCenterWorkerMain.js`'
if (!content.includes(remoteOccurrence)) {
  throw new Error('notification center worker development URL not found')
}
await writeFile(rendererWorkerPath, content.replace(remoteOccurrence, productionOccurrence))

const indexPath = join(root, 'dist', 'index.html')
const indexContent = await readFile(indexPath, 'utf8')
const indexOccurrence = `"develop.notificationCenterViewWorkerPath": "${remoteUrl}"`
const indexReplacement = `"develop.notificationCenterViewWorkerPath": "/notification-center-view/${commitHash}/packages/notification-center-view/dist/notificationCenterWorkerMain.js"`
if (!indexContent.includes(indexOccurrence)) {
  throw new Error('notification center worker development configuration not found')
}
await writeFile(indexPath, indexContent.replace(indexOccurrence, indexReplacement))

const productionWorkerPath = join(root, 'dist', commitHash, 'packages', 'notification-center-view', 'dist', 'notificationCenterWorkerMain.js')
await mkdir(join(productionWorkerPath, '..'), { recursive: true })
await cp(workerPath, productionWorkerPath)
await cp(join(root, 'dist'), join(root, '.tmp', 'static'), { recursive: true })

const rpcPath = join(root, 'dist', commitHash, 'js', 'lvce-editor-rpc.js')
const staticRpcPath = join(root, '.tmp', 'static', 'js', 'lvce-editor-rpc.js')
await mkdir(join(staticRpcPath, '..'), { recursive: true })
await cp(rpcPath, staticRpcPath)
