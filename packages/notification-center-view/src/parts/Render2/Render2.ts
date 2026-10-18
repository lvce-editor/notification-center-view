import { ViewletCommand } from '@lvce-editor/constants'
import * as Diff2 from '../Diff2/Diff2.ts'
import { getNotificationCenterVirtualDom } from '../GetNotificationCenterVirtualDom/GetNotificationCenterVirtualDom.ts'
import * as NotificationCenterStates from '../NotificationCenterStates/NotificationCenterStates.ts'
import { queueRender } from '../QueueRender/QueueRender.ts'

export const render2 = (uid: number, diffResult: readonly number[]): readonly any[] | Promise<readonly any[]> => {
  const pendingDiffs = [...new Set([...diffResult, ...Diff2.diff2(uid)])]
  const { oldState, scheduledState } = NotificationCenterStates.get(uid)
  if (pendingDiffs.length === 0) {
    return []
  }
  return queueRender(uid, [[ViewletCommand.SetDom2, uid, getNotificationCenterVirtualDom(scheduledState.notifications)]], oldState, scheduledState)
}
