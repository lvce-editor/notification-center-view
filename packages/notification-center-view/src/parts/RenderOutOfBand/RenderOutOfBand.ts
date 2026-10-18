import { RendererWorker } from '@lvce-editor/rpc-registry'

export const renderOutOfBand = async (uid: number): Promise<void> => {
  await RendererWorker.invoke('Viewlet.requestRender', uid)
}
