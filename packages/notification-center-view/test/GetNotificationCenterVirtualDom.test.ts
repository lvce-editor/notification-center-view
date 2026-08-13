import { expect, test } from '@jest/globals'
import { getNotificationCenterVirtualDom } from '../src/parts/GetNotificationCenterVirtualDom/GetNotificationCenterVirtualDom.ts'

test('renders an empty notification center', () => {
  const dom = getNotificationCenterVirtualDom([])
  expect(dom.some((node) => node.text === 'No new notifications')).toBe(true)
})

test('renders extension notifications and controls', () => {
  const dom = getNotificationCenterVirtualDom([{ extensionId: 'sample.extension', id: 1, message: 'Build complete', type: 'info' }])
  expect(dom.some((node) => node.text === 'Build complete')).toBe(true)
  expect(dom.some((node) => node.name === 'dismiss:1')).toBe(true)
  expect(dom.some((node) => node.name === 'hide:sample.extension')).toBe(true)
})
