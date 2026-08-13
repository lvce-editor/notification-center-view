import * as ViewletRegistry from '@lvce-editor/viewlet-registry'
import type { NotificationCenterState } from '../NotificationCenterState/NotificationCenterState.ts'

export const { clear, get, getCommandIds, getKeys, registerCommands, set, wrapCommand } = ViewletRegistry.create<NotificationCenterState>()
