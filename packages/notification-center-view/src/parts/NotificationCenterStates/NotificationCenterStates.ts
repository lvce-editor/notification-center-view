import * as ViewletRegistry from '@lvce-editor/viewlet-registry'
import type { NotificationCenterState } from '../NotificationCenterState/NotificationCenterState.ts'

export const {
  clear,
  createDirectEventCommandMap,
  dispose,
  get,
  getCommandIds,
  getKeys,
  registerCommands,
  set,
  wrapAsyncCommand,
  wrapSerialCommand: wrapCommand,
} = ViewletRegistry.create<NotificationCenterState>()
