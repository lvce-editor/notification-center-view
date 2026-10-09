import { cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { patchWaitingAssertions } from './patchWaitingAssertions.js'

const root = join(import.meta.dirname, '..', '..', '..')

const getRemoteUrl = (path) => {
  const url = pathToFileURL(path).toString().slice(8)
  return `/remote/${url}`
}

const workerPath = join(root, '.tmp', 'dist', 'dist', 'notificationCenterWorkerMain.js')
const serverRequire = createRequire(import.meta.resolve('@lvce-editor/server'))
const staticServerPackagePaths = new Set([
  fileURLToPath(import.meta.resolve('@lvce-editor/static-server/package.json')),
  serverRequire.resolve('@lvce-editor/static-server/package.json'),
])

// These notification fixtures exercise the built-in status bar control.
const enableNotificationFixtureSettings = async (path) => {
  const settings = JSON.parse(await readFile(path, 'utf8'))
  settings['statusBar.itemsVisible'] = true
  settings['statusBar.builtinNotificationsEnabled'] = true
  await writeFile(path, `${JSON.stringify(settings, null, 2)}\n`)
}

const sharedProcessPackagePath = serverRequire.resolve('@lvce-editor/shared-process/package.json')
await enableNotificationFixtureSettings(join(dirname(sharedProcessPackagePath), 'config', 'defaultSettings.json'))

for (const staticServerPackagePath of staticServerPackagePaths) {
  const serverStaticPath = join(dirname(staticServerPackagePath), 'static')
  const commitHashPattern = /^[a-z\d]{7}$/
  const commitHashes = await readdir(serverStaticPath)
  const commitHash = commitHashes.find((entry) => commitHashPattern.test(entry))

  if (!commitHash) {
    throw new Error('static server commit hash not found')
  }

  const rendererWorkerPath = join(serverStaticPath, commitHash, 'packages', 'renderer-worker', 'dist', 'rendererWorkerMain.js')
  const content = await readFile(rendererWorkerPath, 'utf8')
  const remoteUrl = getRemoteUrl(workerPath)
  const occurrence = '`${assetDir}/packages/renderer-worker/node_modules/@lvce-editor/about-view/dist/notificationCenterWorkerMain.js`'
  const replacement = `\`${remoteUrl}\``
  if (!content.includes(replacement)) {
    if (!content.includes(occurrence)) {
      throw new Error('notification center worker URL not found')
    }
    await writeFile(rendererWorkerPath, content.replace(occurrence, replacement))
  }

  const indexPath = join(serverStaticPath, 'index.html')
  const indexContent = await readFile(indexPath, 'utf8')
  const indexOccurrence = `"develop.notificationCenterViewWorkerPath": "/${commitHash}/packages/notification-center-view/dist/notificationCenterWorkerMain.js"`
  const indexReplacement = `"develop.notificationCenterViewWorkerPath": "${remoteUrl}"`
  if (!indexContent.includes(indexReplacement)) {
    if (!indexContent.includes(indexOccurrence)) {
      throw new Error('notification center worker configuration not found')
    }
    await writeFile(indexPath, indexContent.replace(indexOccurrence, indexReplacement))
  }

  await enableNotificationFixtureSettings(join(serverStaticPath, commitHash, 'config', 'defaultSettings.json'))

  const rpcPath = join(serverStaticPath, commitHash, 'js', 'lvce-editor-rpc.js')
  const rootRpcPath = join(serverStaticPath, 'js', 'lvce-editor-rpc.js')
  await mkdir(join(rootRpcPath, '..'), { recursive: true })
  await cp(rpcPath, rootRpcPath)

  const rendererProcessPath = join(serverStaticPath, commitHash, 'packages', 'renderer-process', 'dist', 'rendererProcessMain.js')
  const rendererProcessContent = await readFile(rendererProcessPath, 'utf8')
  const patchedRendererProcessContent = patchWaitingAssertions(rendererProcessContent)
  if (patchedRendererProcessContent !== rendererProcessContent) {
    await writeFile(rendererProcessPath, patchedRendererProcessContent)
  }
}
