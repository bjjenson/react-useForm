import { Map } from 'immutable'
import { prepareNameForValidate } from '../fields/prepareNameForValidate'

const getListValues = items => {
  return items.map(item => {
    return item.get('fields').entrySeq().reduce((acc, [key, value]) => {
      return acc.set(key, value.getIn(['current', 'value']))
    }, Map())
  })
}

const validateItems = (items, getAllValues) => {
  return items.map(item => {
    return validateMap(item.get('fields'), getAllValues)
  }).toArray()
}

const validateMap = (fields, getAllValues) => {
  return fields.entrySeq().reduce((acc, [key, field]) => {
    const value = field.getIn(['current', 'value'])
    const optional = field.getIn(['initial', 'optional'], false)
    const { validate, requiredMessage, name } = field.getIn(['initial', 'field'], {})

    const items = field.get('items')
    if (items) {
      acc[key] = validateItems(items, getAllValues)
      if (!optional && items.size === 0) {
        acc[key].error = requiredMessage || 'Required'
      }

      if (validate) {
        const error = validate(getListValues(items), prepareNameForValidate(name), getAllValues)
        if (error) {
          acc[key].error = error
        }
      }


      return acc
    }

    if (validate) {
      const error = validate(value, prepareNameForValidate(name), getAllValues)
      if (error) {
        acc[key] = error
        return acc
      }
    }

    if (!optional && value !== false && !value) {
      acc[key] = requiredMessage || 'Required'
    }

    return acc
  }, {})
}

export const validateFields = (state, getAllValues) => {
  return validateMap(state.get('fields'), getAllValues)
}
