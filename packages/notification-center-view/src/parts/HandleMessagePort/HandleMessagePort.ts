import { PlainMessagePortRpc } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as NotificationCenterStates from '../NotificationCenterStates/NotificationCenterStates.ts'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'

export const handleMessagePort = async (port: MessagePort): Promise<void> => {
  const rpc = await PlainMessagePortRpc.create({
    commandMap: NotificationCenterStates.createDirectEventCommandMap((uid) => RendererWorker.invoke('Viewlet.requestRender', uid)),
    messagePort: port,
  })
  RendererProcess.set(rpc)
}
