import * as NotificationCenterStates from '../NotificationCenterStates/NotificationCenterStates.ts'

export const diff2 = (uid: number): readonly number[] => {
  const { oldState, scheduledState } = NotificationCenterStates.get(uid)
  return oldState.notifications === scheduledState.notifications ? [] : [1]
}
