import { afterEach, beforeEach, expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { create } from '../src/parts/Create/Create.ts'
import { handleNotificationsChangedAll } from '../src/parts/HandleNotificationsChangedAll/HandleNotificationsChangedAll.ts'
import * as NotificationCenterStates from '../src/parts/NotificationCenterStates/NotificationCenterStates.ts'

beforeEach(() => {
  NotificationCenterStates.clear()
})

const rpcState: { disposable: { [Symbol.dispose](): void } | undefined } = { disposable: undefined }

afterEach(() => {
  rpcState.disposable?.[Symbol.dispose]()
  rpcState.disposable = undefined
})

test('updates and renders every open notification center instance', async () => {
  const invocations: readonly unknown[][] = []
  rpcState.disposable = RendererWorker.registerMockRpc({
    async 'Viewlet.sendMultiple'(commands: readonly unknown[]): Promise<void> {
      ;(invocations as unknown[][]).push(commands as unknown[])
    },
  })
  create(1)
  create(2)
  const notifications = [{ extensionId: 'sample.extension', id: 1, message: 'Build complete', type: 'info' as const }]

  await handleNotificationsChangedAll(notifications)

  expect(NotificationCenterStates.get(1).newState.notifications).toEqual(notifications)
  expect(NotificationCenterStates.get(2).newState.notifications).toEqual(notifications)
  expect(invocations).toHaveLength(2)
  expect(invocations[0]).toEqual([expect.arrayContaining([expect.anything(), 1, expect.any(Array)])])
  expect(invocations[1]).toEqual([expect.arrayContaining([expect.anything(), 2, expect.any(Array)])])
})
