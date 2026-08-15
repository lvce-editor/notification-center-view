import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'notification-center.open-empty'

export const test: Test = async ({ expect, Locator }) => {
  const bell = Locator('.StatusBarItem[name="Notifications"]')
  await expect(bell).toBeVisible()
  await expect(bell).toHaveAttribute('aria-label', 'No Notifications')

  // eslint-disable-next-line e2e/no-direct-click -- verifies the rendered status bar control opens the notification center
  await bell.click()

  const notificationCenter = Locator('.NotificationCenter')
  await expect(notificationCenter).toBeVisible()
  await expect(notificationCenter).toHaveAttribute('role', 'dialog')
  await expect(notificationCenter).toHaveAttribute('aria-label', 'Notifications')
  await expect(notificationCenter.locator('.NotificationCenterTitle')).toHaveText('Notifications')
  await expect(notificationCenter.locator('.NotificationCenterEmpty')).toHaveText('No new notifications')

  // eslint-disable-next-line e2e/no-direct-click -- leaves the notification center closed for the reused page
  await bell.click()
  await expect(notificationCenter).toBeHidden()
}
