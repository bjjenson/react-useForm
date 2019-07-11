import { generateDefaultListState } from './generateDefaultListState'
import { generateDefaultFieldState } from './generateDefaultFieldState'

export const getFieldState = (field, initialValues, options, parentPath = '') => {
  if (field.type === 'list') {
    return generateDefaultListState(field, initialValues, options, parentPath)
  }
  return generateDefaultFieldState(field, initialValues, options)
}
