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

export const initState = state => {
  return state
}

const current = 'current'

export const fieldReducer = (state, { type, fieldName, payload }) => {
  const handlers = {
    [actionTypes.updateValue]: value =>
      state.setIn([fieldName, current, 'value'], value)
        .setIn([fieldName, current, 'pristine'], value == state.getIn([fieldName, 'initial', 'value'])),

    [actionTypes.touched]: () =>
      state.setIn([fieldName, current, 'touched'], true),

    [actionTypes.validationResult]: ({ error, helperText }) =>
      state.setIn([fieldName, current, 'error'], error)
        .setIn([fieldName, current, 'helperText'], helperText),

    [actionTypes.insertField]: fieldState =>
      state.set(fieldName, fieldState),

    [actionTypes.removeField]: () =>
      state.delete(fieldName),

    [actionTypes.reset]: state => state,
  }

  const handler = handlers[type]
  if (handler) {
    return handler(payload)
  }
  return state
}
