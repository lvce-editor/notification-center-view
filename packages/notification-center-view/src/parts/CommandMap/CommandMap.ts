import { create } from '../Create/Create.ts'
import { diff2 } from '../Diff2/Diff2.ts'
import { handleClick } from '../HandleClick/HandleClick.ts'
import { handleExtensionManagementMessagePort } from '../HandleExtensionManagementMessagePort/HandleExtensionManagementMessagePort.ts'
import { loadContent } from '../LoadContent/LoadContent.ts'
import * as NotificationCenterStates from '../NotificationCenterStates/NotificationCenterStates.ts'
import { render2 } from '../Render2/Render2.ts'
import { renderEventListeners } from '../RenderEventListeners/RenderEventListeners.ts'

export const commandMap = {
  'NotificationCenter.create': create,
  'NotificationCenter.diff2': diff2,
  'NotificationCenter.getCommandIds': NotificationCenterStates.getCommandIds,
  'NotificationCenter.handleClick': NotificationCenterStates.wrapCommand(handleClick),
  'NotificationCenter.handleExtensionManagementMessagePort': handleExtensionManagementMessagePort,
  'NotificationCenter.loadContent': NotificationCenterStates.wrapCommand(loadContent),
  'NotificationCenter.render2': render2,
  'NotificationCenter.renderEventListeners': renderEventListeners,
}
