import type { Notification } from '../Notification/Notification.ts'
import type { NotificationCenterState } from '../NotificationCenterState/NotificationCenterState.ts'

export const handleNotificationsChanged = (state: NotificationCenterState, notifications: readonly Notification[]): NotificationCenterState => {
  return { ...state, notifications }
}
