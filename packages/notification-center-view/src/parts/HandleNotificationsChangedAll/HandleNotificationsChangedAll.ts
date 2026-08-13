import type { Notification } from '../Notification/Notification.ts'
import { handleNotificationsChanged } from '../HandleNotificationsChanged/HandleNotificationsChanged.ts'
import * as NotificationCenterStates from '../NotificationCenterStates/NotificationCenterStates.ts'

export const handleNotificationsChangedAll = (notifications: readonly Notification[]): void => {
  for (const uid of NotificationCenterStates.getKeys()) {
    const { newState, oldState } = NotificationCenterStates.get(uid)
    const newerState = handleNotificationsChanged(newState, notifications)
    if (newState === newerState || oldState === newerState) {
      continue
    }
    NotificationCenterStates.set(uid, oldState, newerState)
  }
}
