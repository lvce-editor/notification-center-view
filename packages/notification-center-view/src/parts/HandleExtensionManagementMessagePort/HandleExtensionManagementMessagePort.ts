import { PlainMessagePortRpc } from '@lvce-editor/rpc'
import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { handleNotificationsChanged } from '../HandleNotificationsChanged/HandleNotificationsChanged.ts'

export const handleExtensionManagementMessagePort = async (port: MessagePort): Promise<void> => {
  const rpc = await PlainMessagePortRpc.create({
    commandMap: { 'NotificationCenter.handleNotificationsChanged': handleNotificationsChanged },
    messagePort: port,
  })
  ExtensionManagementWorker.set(rpc)
}
