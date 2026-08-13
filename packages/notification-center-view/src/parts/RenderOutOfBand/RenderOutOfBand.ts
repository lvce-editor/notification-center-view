import { RendererWorker } from '@lvce-editor/rpc-registry'
import { diff2 } from '../Diff2/Diff2.ts'
import { render2 } from '../Render2/Render2.ts'

export const renderOutOfBand = async (uid: number): Promise<void> => {
  const diffResult = diff2(uid)
  if (diffResult.length === 0) {
    return
  }
  const commands = render2(uid, diffResult)
  if (commands.length === 0) {
    return
  }
  await RendererWorker.invoke('Viewlet.sendMultiple', commands)
}
