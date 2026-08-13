import { WebWorkerRpcClient } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { commandMap } from '../CommandMap/CommandMap.ts'
import * as NotificationCenterStates from '../NotificationCenterStates/NotificationCenterStates.ts'

export const main = async (): Promise<void> => {
  NotificationCenterStates.registerCommands(commandMap)
  const rpc = await WebWorkerRpcClient.create({ commandMap })
  RendererWorker.set(rpc)
}
