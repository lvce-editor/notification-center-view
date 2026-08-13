import type { Notification } from '../Notification/Notification.ts'

export interface NotificationCenterState {
  readonly notifications: readonly Notification[]
  readonly uid: number
}
