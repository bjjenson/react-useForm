import { fromJS, Map } from 'immutable'
import { fieldsKey } from './fieldReducer'
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

  return fromJS({ [fieldsKey]: fieldMap })
}

const getFieldState = (field, initialValues, options) => {
  if (field.type === 'list') {
    return generateDefaultListState(field, initialValues, options)
  }
  return generateDefaultFieldState(field, initialValues, options)
}

