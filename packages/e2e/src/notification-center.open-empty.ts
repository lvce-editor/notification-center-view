import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'notification-center.open-empty'

const wait = async (milliseconds: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, milliseconds))
}

export const test: Test = async ({ Command, expect, Locator }) => {
  const bell = Locator('.StatusBarItem[name="Notifications"]')
  await expect(bell).toBeVisible()
  await expect(bell).toHaveAttribute('aria-label', 'No Notifications')

  // eslint-disable-next-line e2e/no-direct-click -- verifies the rendered status bar control opens the notification center
  await bell.click()
  await wait(2000)

  const notificationCenter = Locator('.NotificationCenter')
  await expect(notificationCenter).toBeVisible()
  await expect(notificationCenter).toHaveAttribute('role', 'dialog')
  await expect(notificationCenter).toHaveAttribute('aria-label', 'Notifications')
  await expect(notificationCenter.locator('.NotificationCenterTitle')).toHaveText('Notifications')
  await expect(notificationCenter.locator('.NotificationCenterEmpty')).toHaveText('No new notifications')

  await Command.execute('Viewlet.closeWidget', 'NotificationCenter')
  await expect(notificationCenter).toBeHidden()
}
