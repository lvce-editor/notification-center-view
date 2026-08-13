import { PlainMessagePortRpc } from '@lvce-editor/rpc'
import { RendererProcess } from '@lvce-editor/rpc-registry'

export const handleMessagePort = async (port: MessagePort): Promise<void> => {
  const rpc = await PlainMessagePortRpc.create({
    commandMap: {},
    messagePort: port,
  })
  RendererProcess.set(rpc)
}
