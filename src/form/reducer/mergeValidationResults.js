import { Map, List } from 'immutable'

const getError = (errors, key) => {
  const error = errors[key]

  if (typeof error === 'string') return error
  if (Array.isArray(error) && error.error) {
    return error.error
  }

  return ''
}

const updateItems = (list, errorObj) => {
  const errors = errorObj || {}

  return list.map((listItem, index) => {
    const error = Array.isArray(errors) ? errors[index] : errors
    return listItem.update('fields', Map(), fields => updateMap(fields, error))
  })
}

const updateMap = (fields, errorObj) => {
  const errors = errorObj || {}

  return fields.entrySeq().reduce((acc, [key, field]) => {
    const next = field.get('items') ?
      field.update('items', List(), items => updateItems(items, errors[key])) :
      field


    const error = getError(errors, key)

    return acc
      .mergeIn([key], next)
      .setIn([key, 'current', 'error'], Boolean(error))
      .setIn([key, 'current', 'helperText'], error)

  }, Map())

}

export const mergeValidationResults = (state, errors = {}) => {
  return state.update('fields', Map(), fields => updateMap(fields, errors))
}
