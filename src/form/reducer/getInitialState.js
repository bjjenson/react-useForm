import { fromJS, Map, List } from 'immutable'
import { fieldsKey, listenersKey } from './fieldReducer'
import { generateDefaultListState } from './generateDefaultListState'
import { generateDefaultFieldState } from './generateDefaultFieldState'

/**
 * @param fields {Array<import("..").IFormFieldArgs>}
 */
export const getInitialState = (fields, initialValues = Map(), options = {}) => {
  const fieldMap = fields.reduce((acc, field) => {
    const result = acc.set(field.name, getFieldState(field, initialValues, options))

    return result
  }, Map())

  const listeners = getListeners(options.listeners)
  return fromJS({ [fieldsKey]: fieldMap }).merge(listeners)
}

const getFieldState = (field, initialValues, options) => {
  if (field.type === 'list') {
    return generateDefaultListState(field, initialValues, options)
  }
  return generateDefaultFieldState(field, initialValues, options)
}

const getListeners = (listeners = {}) => {
  return Object.entries(listeners).reduce((acc, [fieldName, value]) => {
    return acc.updateIn([listenersKey, fieldName], List(), current => {
      return Array.isArray(value) ? current.concat(value) : current.push(value)
    })
  }, Map())
}
