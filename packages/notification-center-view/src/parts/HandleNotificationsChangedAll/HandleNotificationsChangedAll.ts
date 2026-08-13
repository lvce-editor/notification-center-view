import type { Notification } from '../Notification/Notification.ts'
import { handleNotificationsChanged } from '../HandleNotificationsChanged/HandleNotificationsChanged.ts'
import * as NotificationCenterStates from '../NotificationCenterStates/NotificationCenterStates.ts'
import { renderOutOfBand } from '../RenderOutOfBand/RenderOutOfBand.ts'

export const handleNotificationsChangedAll = async (notifications: readonly Notification[]): Promise<void> => {
  for (const uid of NotificationCenterStates.getKeys()) {
    const { newState, oldState } = NotificationCenterStates.get(uid)
    const newerState = handleNotificationsChanged(newState, notifications)
    if (newState === newerState || oldState === newerState) {
      continue
    }
    NotificationCenterStates.set(uid, oldState, newerState)
    await renderOutOfBand(uid)
  }
}
