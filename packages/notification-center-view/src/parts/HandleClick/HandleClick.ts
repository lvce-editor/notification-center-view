import type { AsyncCommandContext } from '@lvce-editor/viewlet-registry'
import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import type { NotificationCenterState } from '../NotificationCenterState/NotificationCenterState.ts'

export const handleClick = async (state: NotificationCenterState, name: string): Promise<NotificationCenterState> => {
  if (name === 'clear') {
    await ExtensionManagementWorker.invoke('Extensions.clearNotifications')
    return { ...state, notifications: [] }
  }
  if (name.startsWith('dismiss:')) {
    const id = Number(name.slice('dismiss:'.length))
    await ExtensionManagementWorker.invoke('Extensions.dismissNotification', id)
    return { ...state, notifications: state.notifications.filter((notification) => notification.id !== id) }
  }
  if (name.startsWith('hide:')) {
    const extensionId = name.slice('hide:'.length)
    await ExtensionManagementWorker.invoke('Extensions.hideNotificationsFromExtension', extensionId)
    return { ...state, notifications: state.notifications.filter((notification) => notification.extensionId !== extensionId) }
  }
  return state
}

// The extension worker awaits our notification callback. Keep this command off
// the serial queue; that callback supplies the authoritative updated state.
export const handleClickAsync = async (context: AsyncCommandContext<NotificationCenterState>, name: string): Promise<void> => {
  await handleClick(context.getState(), name)
}
