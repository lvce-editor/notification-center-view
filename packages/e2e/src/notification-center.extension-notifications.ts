import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'notification-center.extension-notifications'

export const test: Test = async ({ Command, expect, Extension, Locator }) => {
  const extensionId = 'sample.notification-center-e2e'
  const extensionUri = import.meta.resolve('../fixtures/sample.notification-center')
  await Extension.addWebExtension(extensionUri)

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
  await expect(notificationCenter).toBeVisible()
  await expect(items).toHaveCount(1)
  await expect(items.first()).toHaveClass('NotificationCenterItem-info')
  await expect(items.first().locator('.NotificationCenterExtension')).toHaveText(extensionId)
  await expect(items.first().locator('.NotificationCenterMessage')).toHaveText('Build complete')

  await showNotification('warning', 'Tests passed')
  const secondItem = items.nth(1)
  await expect(items).toHaveCount(2)
  await expect(secondItem).toHaveClass('NotificationCenterItem-warning')
  await expect(secondItem.locator('.NotificationCenterMessage')).toHaveText('Tests passed')
  await expect(bell).toHaveAttribute('aria-label', '2 Notifications')

  // eslint-disable-next-line e2e/no-direct-click -- verifies the rendered dismiss button invokes the notification action
  await items.first().locator('[aria-label="Dismiss Notification"]').click()
  await expect(items).toHaveCount(1)
  await expect(notificationCenter).not.toContainText('Build complete')
  await expect(notificationCenter).toContainText('Tests passed')

  // eslint-disable-next-line e2e/no-direct-click -- verifies the rendered clear button invokes the notification action
  await notificationCenter.locator('[aria-label="Clear All Notifications"]').click()
  await expect(notificationCenter.locator('.NotificationCenterEmpty')).toHaveText('No new notifications')
  await expect(bell).toHaveAttribute('aria-label', 'No Notifications')

  await showNotification('error', 'Build failed')
  await expect(items).toHaveCount(1)
  await expect(items.first()).toHaveClass('NotificationCenterItem-error')

  // eslint-disable-next-line e2e/no-direct-click -- verifies the rendered hide button invokes the notification action
  await items.first().locator(`[aria-label="Hide notifications from ${extensionId}"]`).click()
  await expect(notificationCenter.locator('.NotificationCenterEmpty')).toHaveText('No new notifications')
  await expect(bell).toHaveAttribute('aria-label', 'No Notifications')

  await showNotification('info', 'Ignored after hiding')
  await expect(notificationCenter).not.toContainText('Ignored after hiding')
  await expect(bell).toHaveAttribute('aria-label', 'No Notifications')

  // eslint-disable-next-line e2e/no-direct-click -- leaves the notification center closed for the reused page
  await bell.click()
  await expect(notificationCenter).toBeHidden()
}
