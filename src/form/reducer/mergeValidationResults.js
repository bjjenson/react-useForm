import { Map, List } from 'immutable'

const getError = (errors, key) => {
  const error = errors[key]

  if (typeof error === 'string') return error
  if (Array.isArray(error) && error.error) {
    return error.error
  }

  return ''
}

const updateItems = (list, errorObj, force) => {
  const errors = errorObj || {}

  return list.map((listItem, index) => {
    const error = Array.isArray(errors) ? errors[index] : errors
    return listItem.update('fields', Map(), fields => updateMap(fields, error, force))
  })
}

const updateMap = (fields, errorObj, force) => {
  const errors = errorObj || {}

  return fields.entrySeq().reduce((acc, [key, field]) => {
    const next = field.get('items') ?
      field.update('items', List(), items => updateItems(items, errors[key], force)) :
      field


    const error = getError(errors, key)
    const touched = next.getIn(['current', 'touched'], force)

    if (touched) {
      return acc
        .mergeIn([key], next)
        .setIn([key, 'current', 'error'], Boolean(error))
        .setIn([key, 'current', 'helperText'], error)
    }

    return acc.mergeIn([key], next)
  }, Map())

}

export const mergeValidationResults = (state, errors = {}, force = false) => {
  return state.update('fields', Map(), fields => updateMap(fields, errors, force))
}
