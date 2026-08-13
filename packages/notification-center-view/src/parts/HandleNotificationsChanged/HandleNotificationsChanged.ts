import type { Notification } from '../Notification/Notification.ts'
import * as NotificationCenterStates from '../NotificationCenterStates/NotificationCenterStates.ts'

export const handleNotificationsChanged = async (notifications: readonly Notification[]): Promise<void> => {
  for (const uid of NotificationCenterStates.getKeys()) {
    const { newState, oldState } = NotificationCenterStates.get(uid)
    NotificationCenterStates.set(uid, oldState, { ...newState, notifications })
  }
}
