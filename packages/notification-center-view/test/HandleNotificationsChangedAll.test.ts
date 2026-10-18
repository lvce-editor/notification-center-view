import { beforeEach, expect, test } from '@jest/globals'
import { createMockRpc } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { create } from '../src/parts/Create/Create.ts'
import { handleNotificationsChangedAll } from '../src/parts/HandleNotificationsChangedAll/HandleNotificationsChangedAll.ts'
import * as NotificationCenterStates from '../src/parts/NotificationCenterStates/NotificationCenterStates.ts'

beforeEach(() => {
  NotificationCenterStates.clear()
})

test('renders an update for every open notification center instance', async () => {
  const invocations: readonly unknown[][] = []
  RendererWorker.set(
    createMockRpc({
      commandMap: {
        async 'Viewlet.requestRender'(uid: number): Promise<void> {
          ;(invocations as unknown[][]).push([uid])
        },
      },
    }),
  )
  create(1)
  create(2)
  const notifications = [{ extensionId: 'sample.extension', id: 1, message: 'Build complete', type: 'info' as const }]

  await handleNotificationsChangedAll(notifications)

  expect(NotificationCenterStates.get(1).newState.notifications).toEqual(notifications)
  expect(NotificationCenterStates.get(2).newState.notifications).toEqual(notifications)
  expect(invocations).toEqual([[1], [2]])
})
