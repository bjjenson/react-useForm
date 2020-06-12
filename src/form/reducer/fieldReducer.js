import { List, Map } from 'immutable'
import { syncListIndexes } from './syncListIndexes'
import { mergeValidationResults } from './mergeValidationResults'
import { mergeFormValues } from '../helpers/mergeFormValues'

export const actionTypes = {
  insertField: 'insertField',
  removeField: 'removeField',
  addListItem: 'addListItem',
  removeListItem: 'removeListItem',
  updateListIndex: 'updateListIndex',
  reset: 'reset',
  touched: 'touched',
  updateValue: 'updateValue',
  validateAll: 'validateAll',
  validationResult: 'validationResult',
  addListener: 'addListener',
  removeListener: 'removeListener',
}

export const actions = {
  insertField: (fieldName, fieldState) => ({ type: actionTypes.insertField, fieldName, payload: fieldState }),
  removeField: fieldName => ({ type: actionTypes.removeField, fieldName }),
  addListItem: (fieldName, fieldState) => ({ type: actionTypes.addListItem, fieldName, payload: fieldState }),
  removeListItem: (fieldName, index) => ({ type: actionTypes.removeListItem, fieldName, payload: index }),
  updateListIndex: (fieldName, fromIndex, toIndex) => ({ type: actionTypes.updateListIndex, fieldName, payload: { fromIndex, toIndex } }),
  reset: (state) => ({ type: actionTypes.reset, payload: state }),
  touched: (fieldName) => ({ type: actionTypes.touched, fieldName }),
  updateValue: (fieldName, value) => ({ type: actionTypes.updateValue, fieldName, payload: value }),
  validateAll: (errors) => ({ type: actionTypes.validateAll, payload: errors }),
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
        state.getIn([listenersKey, fieldName], List()).forEach(listener => listener(value, previous, state.get('formTools').current))
      })

      const newState = state.setIn([fieldsKey, ...fieldPath, current, 'value'], value)
        .setIn([fieldsKey, ...fieldPath, current, 'pristine'], value == state.getIn([fieldsKey, fieldName, 'initial', 'value']))
      setTimeout(() => {
        const onFormChange = state.get('onFormChange')
        if (onFormChange && typeof (onFormChange) === 'function') {
          onFormChange(mergeFormValues(newState, Map()))
        }
      })

      return newState
    },

    [actionTypes.touched]: () =>
      state.setIn([fieldsKey, ...fieldPath, current, 'touched'], true),

    [actionTypes.validationResult]: ({ error, helperText }) => {
      return state.setIn([fieldsKey, ...fieldPath, current, 'error'], error)
        .setIn([fieldsKey, ...fieldPath, current, 'helperText'],
          helperText || state.getIn([fieldsKey, ...fieldPath, 'initial', 'field']).helperText
        )
    },

    [actionTypes.validateAll]: (errors) =>
      mergeValidationResults(state, errors, true),

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

    [actionTypes.updateListIndex]: ({ fromIndex, toIndex }) => {
      const path = [fieldsKey, ...fieldPath, 'items']
      const item = state.getIn([...path, fromIndex])
      return syncListIndexes(state.deleteIn([...path, fromIndex]).updateIn(path, items => items.insert(toIndex, item)), fieldsKey, fieldPath)
    },

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

export const getFieldPath = (fieldName, prev = []) => {
  let fieldPath = [fieldName]
  const match = fieldName.match(/.items.(\d)./)

  if (match) {
    const firstField = fieldName.substr(0, match.index)
    const rest = fieldName.match(/.items.\d.fields.(.*)$/)[1]

    if (rest.match(/.items.(\d)./)) {
      return getFieldPath(rest, [firstField, 'items', match[1], 'fields'])
    }

    fieldPath = [...prev, firstField, 'items', match[1], 'fields', rest]

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
