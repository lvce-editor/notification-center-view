import { beforeEach, expect, test } from '@jest/globals'
import { create } from '../src/parts/Create/Create.ts'
import { handleNotificationsChangedAll } from '../src/parts/HandleNotificationsChangedAll/HandleNotificationsChangedAll.ts'
import * as NotificationCenterStates from '../src/parts/NotificationCenterStates/NotificationCenterStates.ts'

beforeEach(() => {
  NotificationCenterStates.clear()
})

test('updates every open notification center instance', () => {
  create(1)
  create(2)
  const notifications = [{ extensionId: 'sample.extension', id: 1, message: 'Build complete', type: 'info' as const }]

  handleNotificationsChangedAll(notifications)

  expect(NotificationCenterStates.get(1).newState.notifications).toEqual(notifications)
  expect(NotificationCenterStates.get(2).newState.notifications).toEqual(notifications)
})
