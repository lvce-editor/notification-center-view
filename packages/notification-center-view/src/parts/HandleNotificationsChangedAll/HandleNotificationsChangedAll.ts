import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { Notification } from '../Notification/Notification.ts'
import * as NotificationCenterStates from '../NotificationCenterStates/NotificationCenterStates.ts'

export const handleNotificationsChangedAll = async (notifications: readonly Notification[]): Promise<void> => {
  for (const uid of NotificationCenterStates.getKeys()) {
    await RendererWorker.invoke('Viewlet.executeViewletCommand', uid, 'handleNotificationsChanged', notifications)
  }
}
