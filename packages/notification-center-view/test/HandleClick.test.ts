import { afterEach, expect, test } from '@jest/globals'
import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { handleClick } from '../src/parts/HandleClick/HandleClick.ts'

const rpcState: { disposable: { [Symbol.dispose](): void } | undefined } = { disposable: undefined }

afterEach(() => {
  rpcState.disposable?.[Symbol.dispose]()
  rpcState.disposable = undefined
})

test('dismisses a notification', async () => {
  const invocations: readonly unknown[][] = []
  rpcState.disposable = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.dismissNotification'(id: number): Promise<void> {
      ;(invocations as unknown[][]).push([id])
    },
  })
  const state = { notifications: [{ extensionId: 'sample.extension', id: 1, message: 'Test', type: 'info' as const }], uid: 1 }

  const result = await handleClick(state, 'dismiss:1')

  expect(result.notifications).toEqual([])
  expect(invocations).toEqual([[1]])
})

test('clears all notifications', async () => {
  let invoked = false
  rpcState.disposable = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.clearNotifications'(): Promise<void> {
      invoked = true
    },
  })
  const state = { notifications: [{ extensionId: 'sample.extension', id: 1, message: 'Test', type: 'info' as const }], uid: 1 }

  const result = await handleClick(state, 'clear')

  expect(result.notifications).toEqual([])
  expect(invoked).toBe(true)
})

test('hides all notifications from an extension', async () => {
  const invocations: string[] = []
  rpcState.disposable = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.hideNotificationsFromExtension'(extensionId: string): Promise<void> {
      invocations.push(extensionId)
    },
  })
  const state = {
    notifications: [
      { extensionId: 'sample.extension', id: 1, message: 'First', type: 'info' as const },
      { extensionId: 'other.extension', id: 2, message: 'Second', type: 'warning' as const },
    ],
    uid: 1,
  }

  const result = await handleClick(state, 'hide:sample.extension')

  expect(result.notifications).toEqual([{ extensionId: 'other.extension', id: 2, message: 'Second', type: 'warning' }])
  expect(invocations).toEqual(['sample.extension'])
})
