import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'notification-center.extension-notifications'

export const test: Test = async ({ Command, expect, Extension, Locator }) => {
  const extensionId = 'sample.notification-center-e2e'
  const extensionUri = import.meta.resolve('../fixtures/sample.notification-center')
  await Extension.addWebExtension(extensionUri)
  await Extension.activateByEvent('onCommand:notificationCenter.showTestNotification', '', 2)

  const showNotification = async (type: 'error' | 'info' | 'warning', message: string): Promise<void> => {
    await Command.executeExtensionCommand('notificationCenter.showTestNotification', type, message)
  }

  await showNotification('info', 'Build complete')

  const bell = Locator('.StatusBarItem[name="Notifications"]')
  await expect(bell).toHaveAttribute('aria-label', '1 Notification')
  // eslint-disable-next-line e2e/no-direct-click -- verifies the rendered status bar control opens the notification center
  await bell.click()

  const notificationCenter = Locator('.NotificationCenter')
  const items = notificationCenter.locator('.NotificationCenterItem')
  const firstItem = items.first()
  const firstExtension = firstItem.locator('.NotificationCenterExtension')
  const firstMessage = firstItem.locator('.NotificationCenterMessage')
  const emptyMessage = notificationCenter.locator('.NotificationCenterEmpty')
  await expect(notificationCenter).toBeVisible()
  await expect(items).toHaveCount(1)
  await expect(firstItem).toHaveClass('NotificationCenterItem-info')
  await expect(firstExtension).toHaveText(extensionId)
  await expect(firstMessage).toHaveText('Build complete')

  await showNotification('warning', 'Tests passed')
  const secondItem = items.nth(1)
  const secondMessage = secondItem.locator('.NotificationCenterMessage')
  await expect(items).toHaveCount(2)
  await expect(secondItem).toHaveClass('NotificationCenterItem-warning')
  await expect(secondMessage).toHaveText('Tests passed')
  await expect(bell).toHaveAttribute('aria-label', '2 Notifications')

  // eslint-disable-next-line e2e/no-direct-click -- verifies the rendered dismiss button invokes the notification action
  await items.first().locator('[aria-label="Dismiss Notification"]').click()
  await expect(items).toHaveCount(1)
  await expect(firstMessage).toHaveText('Tests passed')

  // eslint-disable-next-line e2e/no-direct-click -- verifies the rendered clear button invokes the notification action
  await notificationCenter.locator('[aria-label="Clear All Notifications"]').click()
  await expect(emptyMessage).toHaveText('No new notifications')
  await expect(bell).toHaveAttribute('aria-label', 'No Notifications')

  await showNotification('error', 'Build failed')
  await expect(items).toHaveCount(1)
  await expect(firstItem).toHaveClass('NotificationCenterItem-error')

  // eslint-disable-next-line e2e/no-direct-click -- verifies the rendered hide button invokes the notification action
  await items.first().locator(`[aria-label="Hide notifications from ${extensionId}"]`).click()
  await expect(emptyMessage).toHaveText('No new notifications')
  await expect(bell).toHaveAttribute('aria-label', 'No Notifications')

  await showNotification('info', 'Ignored after hiding')
  await expect(items).toHaveCount(0)
  await expect(bell).toHaveAttribute('aria-label', 'No Notifications')

  await Command.execute('Viewlet.closeWidget', 'NotificationCenter')
  await expect(notificationCenter).toBeHidden()
}
