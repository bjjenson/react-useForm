import { List } from 'immutable'

export const actionTypes = {
  insertField: 'insertField',
  removeField: 'removeField',
  reset: 'reset',
  touched: 'touched',
  updateValue: 'updateValue',
  validationResult: 'validationResult',
}

export const actions = {
  insertField: (fieldName, fieldState) => ({ type: actionTypes.insertField, fieldName, payload: fieldState }),
  removeField: fieldName => ({ type: actionTypes.removeField, fieldName }),
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

export const fieldReducer = (state, { type, fieldName, payload }) => {
  const handlers = {
    [actionTypes.updateValue]: value =>
      state.setIn([fieldsKey, fieldName, current, 'value'], value)
        .setIn([fieldsKey, fieldName, current, 'pristine'], value == state.getIn([fieldsKey, fieldName, 'initial', 'value'])),

    [actionTypes.touched]: () =>
      state.setIn([fieldsKey, fieldName, current, 'touched'], true),

    [actionTypes.validationResult]: ({ error, helperText }) =>
      state.setIn([fieldsKey, fieldName, current, 'error'], error)
        .setIn([fieldsKey, fieldName, current, 'helperText'], helperText),

    [actionTypes.insertField]: fieldState =>
      state.setIn([fieldsKey, fieldName], fieldState)
        .deleteIn([removedFieldsKey, state.get(removedFieldsKey, List()).indexOf(fieldName)]),

    [actionTypes.removeField]: () =>
      state.deleteIn([fieldsKey, fieldName])
        .set(removedFieldsKey, state.get(removedFieldsKey, List()).push(fieldName)),

    [actionTypes.reset]: state => state,
  }

  const handler = handlers[type]
  if (handler) {
    return handler(payload)
  }
  return state
}
