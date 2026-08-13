import { ViewletCommand } from '@lvce-editor/constants'
import { getNotificationCenterVirtualDom } from '../GetNotificationCenterVirtualDom/GetNotificationCenterVirtualDom.ts'
import * as NotificationCenterStates from '../NotificationCenterStates/NotificationCenterStates.ts'

export const render2 = (uid: number, diffResult: readonly number[]): readonly unknown[] => {
  const { scheduledState } = NotificationCenterStates.get(uid)
  NotificationCenterStates.set(uid, scheduledState, scheduledState)
  if (diffResult.length === 0) {
    return []
  }
  return [[ViewletCommand.SetDom2, uid, getNotificationCenterVirtualDom(scheduledState.notifications)]]
}
