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
  // const applicablePath = parentPath ? `${parentPath}.${field.name}` : field.name
  const label = resolveLabel(field, options)
  const listValues = resolveInitialFieldValue(field.value, initialValues.getIn(field.name.split('.')), field.type)
  const items = getCurrentValues(field.fields, listValues, options, field.name, parentPath)

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

export const getCurrentValues = (fields = [], initialListValues, options, fieldPath, parentPath) => {
  return initialListValues.map((item, index) => {
    return getFields(fields, item, options, fieldPath, index, parentPath)
  })
}

export const getFields = (fields = [], value = Map(), options, fieldPath, index = 0, parentPath = '') => {

  return Map([['fields', fields.reduce((acc, field) => {
    let pathName = `${fieldPath}.items.${index}.fields`
    if (parentPath) pathName = `${parentPath}.${pathName}`
    return acc.set(field.name, getFieldState(field, value, options, pathName))
      .setIn([field.name, 'initial', 'field'], {
        ...field,
        name: `${pathName}.${field.name}`,
      })
  }, Map())]])
}
