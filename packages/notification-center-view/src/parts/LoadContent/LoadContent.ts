import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import type { NotificationCenterState } from '../NotificationCenterState/NotificationCenterState.ts'

export const loadContent = async (state: NotificationCenterState): Promise<NotificationCenterState> => {
  const notifications = await ExtensionManagementWorker.invoke('Extensions.getNotifications')
  return { ...state, notifications }
}
