import { EventExpression } from '@lvce-editor/constants'

export const renderEventListeners = (): readonly unknown[] => {
  return [{ name: 1, params: ['handleClick', EventExpression.TargetName] }]
}
