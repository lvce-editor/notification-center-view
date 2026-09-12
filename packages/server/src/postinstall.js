import { cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { patchWaitingAssertions } from './patchWaitingAssertions.js'

const root = join(import.meta.dirname, '..', '..', '..')

const getRemoteUrl = (path) => {
  const url = pathToFileURL(path).toString().slice(8)
  return `/remote/${url}`
}

const workerPath = join(root, '.tmp', 'dist', 'dist', 'notificationCenterWorkerMain.js')
const staticServerPackagePath = fileURLToPath(import.meta.resolve('@lvce-editor/static-server/package.json'))
const serverStaticPath = join(dirname(staticServerPackagePath), 'static')
const commitHashPattern = /^[a-z\d]{7}$/
const commitHashes = await readdir(serverStaticPath)
const commitHash = commitHashes.find((entry) => commitHashPattern.test(entry))

if (!commitHash) {
  throw new Error('static server commit hash not found')
}

const rendererWorkerPath = join(serverStaticPath, commitHash, 'packages', 'renderer-worker', 'dist', 'rendererWorkerMain.js')
const content = await readFile(rendererWorkerPath, 'utf8')
const declarationPrefix = 'const notificationCenterViewWorkerUrl = '

if (!content.includes(`// ${declarationPrefix}`)) {
  const declaration = content.split('\n').find((line) => line.startsWith(declarationPrefix))
  if (!declaration) {
    throw new Error('notification center worker URL not found')
  }
  const replacement = `// ${declaration}\nconst notificationCenterViewWorkerUrl = \`${getRemoteUrl(workerPath)}\`;`
  await writeFile(rendererWorkerPath, content.replace(declaration, replacement))
}

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
