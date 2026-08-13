import { expect, test } from '@jest/globals'
import { handleNotificationsChanged } from '../src/parts/HandleNotificationsChanged/HandleNotificationsChanged.ts'

test('replaces notifications in the current view state', () => {
  const state = { notifications: [], uid: 1 }
  const notifications = [{ extensionId: 'sample.extension', id: 1, message: 'Build complete', type: 'info' as const }]

  const result = handleNotificationsChanged(state, notifications)

  expect(result).toEqual({ notifications, uid: 1 })
})
