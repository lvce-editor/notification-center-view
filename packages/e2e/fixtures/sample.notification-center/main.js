const currentUrl = new URL(import.meta.url)
const assetDir = currentUrl.pathname.startsWith('/remote/') ? '' : currentUrl.pathname.slice(0, currentUrl.pathname.indexOf('/packages/'))
const { WebWorkerRpcClient } = await import(`${assetDir}/js/lvce-editor-rpc.js`)

let rpc
rpc = await WebWorkerRpcClient.create({
  commandMap: {
    async 'ExtensionApi.executeCommand'(_commandId, type = 'info', message = 'Build complete') {
      await rpc.invoke('Extensions.showNotification', type, message)
    },
  },
})
