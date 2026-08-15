import { ViewletCommand } from '@lvce-editor/constants'
import { getNotificationCenterVirtualDom } from '../GetNotificationCenterVirtualDom/GetNotificationCenterVirtualDom.ts'
import * as NotificationCenterStates from '../NotificationCenterStates/NotificationCenterStates.ts'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'

export const renderCommands = (uid: number, diffResult: readonly number[]): readonly unknown[] => {
  const { scheduledState } = NotificationCenterStates.get(uid)
  NotificationCenterStates.set(uid, scheduledState, scheduledState)
  if (diffResult.length === 0) {
    return []
  }
  return [[ViewletCommand.SetDom2, uid, getNotificationCenterVirtualDom(scheduledState.notifications)]]
}

export const render2 = (uid: number, diffResult: readonly number[]): readonly unknown[] | Promise<readonly unknown[]> => {
  const commands = renderCommands(uid, diffResult)
  if (!RendererProcess.isConnected()) {
    return commands
  }
  return renderDirect(uid, commands)
}

const renderDirect = async (uid: number, commands: readonly unknown[]): Promise<readonly unknown[]> => {
  const transactionId = await RendererProcess.invoke('Viewlet.queueCommands', uid, commands)
  return [['Viewlet.commitPending', uid, transactionId]]
}
