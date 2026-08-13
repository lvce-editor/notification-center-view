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

test('schedules an update for every open notification center instance', async () => {
  const invocations: readonly unknown[][] = []
  rpcState.disposable = RendererWorker.registerMockRpc({
    async 'Viewlet.executeViewletCommand'(...args: readonly unknown[]): Promise<void> {
      ;(invocations as unknown[][]).push(args as unknown[])
    },
  })
  create(1)
  create(2)
  const notifications = [{ extensionId: 'sample.extension', id: 1, message: 'Build complete', type: 'info' as const }]

  await handleNotificationsChangedAll(notifications)

  expect(invocations).toEqual([
    [1, 'handleNotificationsChanged', notifications],
    [2, 'handleNotificationsChanged', notifications],
  ])
})
