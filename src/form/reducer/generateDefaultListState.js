import { fromJS, Map } from 'immutable'
import { resolveInitialFieldValue } from './resolveInitialFieldValue'
import { resolveLabel } from './resolveLabel'
import { getFieldState } from './getFieldState'

/**
 *
 * @param field {import("..").IFormFieldArgs}
 * @param {*} initialValues
 * @param options {import("..").IFormOptions}
 */
export const generateDefaultListState = (field, initialValues, options = {}, parentPath = '') => {
  const applicablePath = parentPath ? `${parentPath}.${field.name}` : field.name
  const label = resolveLabel(field, options)
  const listValues = resolveInitialFieldValue(field.value, initialValues.getIn(field.name.split('.')), field.type)
  const items = getCurrentValues(field.fields, listValues, options, applicablePath)

  return fromJS({
    initial: {
      type: field.type,
      optional: field.optional || false,
      label,
    },
    current: {
      helperText: field.helperText || '',
      error: false,
      pristine: true,
      touched: false,
    },
    items,
  }).setIn(['initial', 'field'], field)
    .setIn(['initial', 'options'], options)
}

export const getCurrentValues = (fields = [], initialListValues, options, listField) => {
  return initialListValues.map((item, index) => {
    return getFields(fields, item, options, listField, index)
  })
}

export const getFields = (fields = [], value = Map(), options, listField, index = 0) => {

  return Map([['fields', fields.reduce((acc, field) => {
    return acc.set(field.name, getFieldState(field, value, options, listField))
      .setIn([field.name, 'initial', 'field'], {
        ...field,
        name: `${listField}.items.${index}.fields.${field.name}`,
      })
  }, Map())]])
}
