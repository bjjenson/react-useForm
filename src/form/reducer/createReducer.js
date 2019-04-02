import { fromJS, Map } from 'immutable'
import { useReducer, useMemo } from 'react'
import { fieldReducer, initState, actions, fieldsKey } from './fieldReducer'
import { generateDefaultListState } from './generateDefaultListState'
import { generateDefaultFieldState } from './generateDefaultFieldState'

export const createReducer = ({ fields, options = {}, initialValues = Map() }) => {
  const derivedState = getInitialState(fields, initialValues, options)
  const [state, dispatch] = useReducer(fieldReducer, derivedState, initState)

  const json = JSON.stringify(initialValues.toJS())
  useMemo(() => {
    setTimeout(() => {
      dispatch(actions.reset(derivedState))
    })
    return json
  }, [json])

  return [state, dispatch]
}

/**
 * @param fields {Array<import("..").IFormFieldArgs>}
 */
const getInitialState = (fields, initialValues, options) => {
  const fieldMap = fields.reduce((acc, field) => {
    const result = acc.set(field.name, getFieldState(field, initialValues, options))

    return result
  }, Map())

  return fromJS({ [fieldsKey]: fieldMap })
}

const getFieldState = (field, initialValues, options) => {
  if (field.type === 'list') {
    return generateDefaultListState(field, initialValues, options)
  }
  return generateDefaultFieldState(field, initialValues, options)
}

