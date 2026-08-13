import { PlainMessagePortRpc } from '@lvce-editor/rpc'
import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { handleNotificationsChangedAll } from '../HandleNotificationsChangedAll/HandleNotificationsChangedAll.ts'

export const handleExtensionManagementMessagePort = async (port: MessagePort): Promise<void> => {
  const rpc = await PlainMessagePortRpc.create({
    commandMap: { 'NotificationCenter.handleNotificationsChanged': handleNotificationsChangedAll },
    messagePort: port,
  })
  ExtensionManagementWorker.set(rpc)
}
