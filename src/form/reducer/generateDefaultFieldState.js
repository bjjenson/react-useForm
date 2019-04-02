import { fromJS } from 'immutable'
import { resolveInitialFieldValue } from './resolveInitialFieldValue'
import { resolveLabel } from './resolveLabel'

/**
 *
 * @param field {import("..").IFormFieldArgs}
 * @param {*} initialValues
 * @param options {import("..").IFormOptions}
 */
export const generateDefaultFieldState = (field, initialValues, options) => {
  if (!field.name) throw new Error('name is required on field')

  const label = resolveLabel(field, options)
  const value = resolveInitialFieldValue(field.value, initialValues.getIn(field.name.split('.')), field.type)

  return fromJS({
    initial: {
      type: field.type || 'text',
      value,
      optional: field.optional || false,
      label,
    },
    current: {
      helperText: field.helperText || '',
      error: false,
      pristine: true,
      touched: false,
      value,
    },
  }).setIn(['initial', 'field'], field)
}
