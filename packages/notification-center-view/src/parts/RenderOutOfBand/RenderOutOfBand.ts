import { RendererProcess } from '@lvce-editor/rpc-registry'
import { diff2 } from '../Diff2/Diff2.ts'
import { renderCommands } from '../Render2/Render2.ts'

export const renderOutOfBand = async (uid: number): Promise<void> => {
  const diffResult = diff2(uid)
  if (diffResult.length === 0) {
    return
  }
  const commands = renderCommands(uid, diffResult)
  if (commands.length === 0) {
    return
  }
  await RendererProcess.invoke('Viewlet.sendMultiple', commands)
}
