import { Map } from 'immutable'

const validateItems = (items, getAllValues) => {
  return items.map(item => {
    return validateMap(item.get('fields'), getAllValues)
  })
}

const validateMap = (fields, getAllValues) => {
  return fields.entrySeq().reduce((acc, [key, field]) => {
    const value = field.getIn(['current', 'value'])
    const optional = field.getIn(['initial', 'optional'], false)
    const { validate, requiredMessage, name } = field.getIn(['initial', 'field'], {})

    const items = field.get('items')
    if (items) {
      return acc.set(key, validateItems(items), getAllValues)
    }

    if (validate) {
      const error = validate(value, name, getAllValues)
      if (error) {
        return acc.set(key, error)
      }
    }

    if (!optional && value !== false && !value) {
      return acc.set(key, requiredMessage || 'Required')
    }

    return acc
  }, Map()).toJS()
}

export const validateFields = (state) => {
  const getAllValues = state.get('getAllValues')
  return validateMap(state.get('fields'), getAllValues)
}
