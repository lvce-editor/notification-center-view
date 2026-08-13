import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { Notification } from '../Notification/Notification.ts'

const onClick = 1

const getNotificationDom = (notification: Notification): readonly VirtualDomNode[] => {
  return [
    { childCount: 3, className: `NotificationCenterItem NotificationCenterItem-${notification.type}`, type: VirtualDomElements.Article },
    { childCount: 2, className: 'NotificationCenterItemHeader', type: VirtualDomElements.Div },
    { childCount: 1, className: 'NotificationCenterExtension', type: VirtualDomElements.Span },
    text(notification.extensionId),
    {
      ariaLabel: 'Dismiss Notification',
      childCount: 1,
      className: 'NotificationCenterIconButton',
      name: `dismiss:${notification.id}`,
      onClick,
      type: VirtualDomElements.Button,
    },
    text('×'),
    { childCount: 1, className: 'NotificationCenterMessage', type: VirtualDomElements.Div },
    text(notification.message),
    {
      ariaLabel: `Hide notifications from ${notification.extensionId}`,
      childCount: 1,
      className: 'NotificationCenterHideButton',
      name: `hide:${notification.extensionId}`,
      onClick,
      type: VirtualDomElements.Button,
    },
    text(`Hide notifications from ${notification.extensionId}`),
  ]
}

export const getNotificationCenterVirtualDom = (notifications: readonly Notification[]): readonly VirtualDomNode[] => {
  const content =
    notifications.length === 0
      ? [{ childCount: 1, className: 'NotificationCenterEmpty', type: VirtualDomElements.Div }, text('No new notifications')]
      : notifications.flatMap(getNotificationDom)
  return [
    { ariaLabel: 'Notifications', childCount: 2, className: 'Viewlet NotificationCenter', role: 'dialog', type: VirtualDomElements.Div },
    { childCount: 2, className: 'NotificationCenterHeader', type: VirtualDomElements.Div },
    { childCount: 1, className: 'NotificationCenterTitle', type: VirtualDomElements.H2 },
    text('Notifications'),
    {
      ariaLabel: 'Clear All Notifications',
      childCount: 1,
      className: 'NotificationCenterClearButton',
      name: 'clear',
      onClick,
      type: VirtualDomElements.Button,
    },
    text('Clear All'),
    { childCount: content.length, className: 'NotificationCenterList', type: VirtualDomElements.Div },
    ...content,
  ]
}
