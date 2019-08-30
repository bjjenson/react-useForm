import { List } from 'immutable'
import { syncListIndexes } from './syncListIndexes'

export const actionTypes = {
  insertField: 'insertField',
  removeField: 'removeField',
  addListItem: 'addListItem',
  removeListItem: 'removeListItem',
  reset: 'reset',
  touched: 'touched',
  updateValue: 'updateValue',
  validationResult: 'validationResult',
  addListener: 'addListener',
  removeListener: 'removeListener',
}

export const actions = {
  insertField: (fieldName, fieldState) => ({ type: actionTypes.insertField, fieldName, payload: fieldState }),
  removeField: fieldName => ({ type: actionTypes.removeField, fieldName }),
  addListItem: (fieldName, fieldState) => ({ type: actionTypes.addListItem, fieldName, payload: fieldState }),
  removeListItem: (fieldName, index) => ({ type: actionTypes.removeListItem, fieldName, payload: index }),
  reset: (state) => ({ type: actionTypes.reset, payload: state }),
  touched: (fieldName) => ({ type: actionTypes.touched, fieldName }),
  updateValue: (fieldName, value) => ({ type: actionTypes.updateValue, fieldName, payload: value }),
  validationResult: (fieldName, error, helperText) => ({ type: actionTypes.validationResult, fieldName, payload: { error, helperText } }),
  addListener: (fieldName, listener) => ({ type: actionTypes.addListener, fieldName, payload: listener }),
  removeListener: (fieldName, listener) => ({ type: actionTypes.removeListener, fieldName, payload: listener }),
}

export const removedFieldsKey = 'removedFields'
export const fieldsKey = 'fields'
export const listenersKey = 'listeners'

export const initState = state => {
  return state
}

const current = 'current'

export const fieldReducer = (state, { type, fieldName = '', payload }) => {
  const fieldPath = getFieldPath(fieldName)

  const handlers = {
    [actionTypes.updateValue]: value => {
      setTimeout(() => {
        const previous = state.getIn([fieldsKey, ...fieldPath, current, 'value'], '')
        state.getIn([listenersKey, fieldName], List()).forEach(listener => listener(value, previous))
      })

      return state.setIn([fieldsKey, ...fieldPath, current, 'value'], value)
        .setIn([fieldsKey, ...fieldPath, current, 'pristine'], value == state.getIn([fieldsKey, fieldName, 'initial', 'value']))
    },

    [actionTypes.touched]: () =>
      state.setIn([fieldsKey, ...fieldPath, current, 'touched'], true),

    [actionTypes.validationResult]: ({ error, helperText }) => {
      return state.setIn([fieldsKey, ...fieldPath, current, 'error'], error)
        .setIn([fieldsKey, ...fieldPath, current, 'helperText'],
          helperText || state.getIn([fieldsKey, ...fieldPath, 'initial', 'field']).helperText
        )
    },

    [actionTypes.insertField]: fieldState =>
      state.setIn([fieldsKey, ...fieldPath], fieldState)
        .deleteIn([removedFieldsKey, state.get(removedFieldsKey, List()).indexOf(fieldName)]),

    [actionTypes.removeField]: () =>
      state.deleteIn([fieldsKey, ...fieldPath])
        .set(removedFieldsKey, state.get(removedFieldsKey, List()).push(fieldName)),

    [actionTypes.addListItem]: itemState => {
      const path = [fieldsKey, ...fieldPath, 'items']
      return state.updateIn([...path], List(), prevState => prevState.push(itemState))
    },

    [actionTypes.removeListItem]: index =>
      syncListIndexes(
        state.deleteIn([fieldsKey, ...fieldPath, 'items', index]),
        fieldsKey,
        fieldPath,
      ),

    [actionTypes.addListener]: listener =>
      state.updateIn([listenersKey, fieldName], List(), listeners =>
        listeners.push(listener)
      ),

    [actionTypes.removeListener]: listener =>
      state.updateIn([listenersKey, fieldName], List(), listeners => {
        const index = listeners.indexOf(listener)
        return index > -1 ? listeners.delete(index) : listeners
      }),

    [actionTypes.reset]: state => state,
  }

  const handler = handlers[type]
  if (handler) {

    let lastPath = fieldPath
    if (!areArraysEqual(state.get('lastPath', []), lastPath)) {
      lastPath = []
    }

    const trackLastPath = type !== actionTypes.validationResult && type !== actionTypes.reset
    return handler(payload)
      .set('lastPath', trackLastPath ? lastPath : [])
  }
  return state
}

export const getFieldPath = fieldName => {
  let fieldPath = [fieldName]
  const match = fieldName.match(/.items.(\d)./)
  if (match) {
    const firstField = fieldName.substr(0, match.index)
    const rest = fieldName.substr(match.index + 1)
    fieldPath = [firstField, ...rest.split('.')]
  }
  return fieldPath
}

const areArraysEqual = (a, b) => {
  if (a.length !== b.length) return false

  let same = true
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) { same = false }
  }
  return same
}
