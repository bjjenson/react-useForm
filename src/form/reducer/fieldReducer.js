import { List } from 'immutable'

export const actionTypes = {
  insertField: 'insertField',
  removeField: 'removeField',
  addListItem: 'addListItem',
  removeListItem: 'removeListItem',
  reset: 'reset',
  touched: 'touched',
  updateValue: 'updateValue',
  validationResult: 'validationResult',
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
}

export const removedFieldsKey = 'removedFields'
export const fieldsKey = 'fields'

export const initState = state => {
  return state
}

const current = 'current'

export const fieldReducer = (state, { type, fieldName = '', payload }) => {
  const fieldPath = getFieldPath(fieldName)

  const handlers = {
    [actionTypes.updateValue]: value =>
      state.setIn([fieldsKey, ...fieldPath, current, 'value'], value)
        .setIn([fieldsKey, ...fieldPath, current, 'pristine'], value == state.getIn([fieldsKey, fieldName, 'initial', 'value'])),

    [actionTypes.touched]: () =>
      state.setIn([fieldsKey, ...fieldPath, current, 'touched'], true),

    [actionTypes.validationResult]: ({ error, helperText }) =>
      state.setIn([fieldsKey, ...fieldPath, current, 'error'], error)
        .setIn([fieldsKey, ...fieldPath, current, 'helperText'], helperText),

    [actionTypes.insertField]: fieldState =>
      state.setIn([fieldsKey, ...fieldPath], fieldState)
        .deleteIn([removedFieldsKey, state.get(removedFieldsKey, List()).indexOf(fieldName)]),

    [actionTypes.removeField]: () =>
      state.deleteIn([fieldsKey, ...fieldPath])
        .set(removedFieldsKey, state.get(removedFieldsKey, List()).push(fieldName)),

    [actionTypes.addListItem]: itemState => {
      const path = [fieldsKey, ...fieldPath, 'items']
      return state.setIn([...path, state.getIn(path, List()).size], itemState)
    },

    [actionTypes.removeListItem]: index =>
      state.deleteIn([fieldsKey, ...fieldPath, 'items', index]),

    [actionTypes.reset]: state => state,
  }

  const handler = handlers[type]
  if (handler) {
    return handler(payload)
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
