import type { NotificationCenterState } from '../NotificationCenterState/NotificationCenterState.ts'
import * as NotificationCenterStates from '../NotificationCenterStates/NotificationCenterStates.ts'

export const create = (uid: number): void => {
  const state: NotificationCenterState = { notifications: [], uid }
  NotificationCenterStates.set(uid, state, state)
}
