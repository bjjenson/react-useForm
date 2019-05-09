import { Map } from 'immutable'
import { useReducer, useMemo } from 'react'
import { fieldReducer, initState, actions } from './fieldReducer'
import { getInitialState } from './getInitialState'

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



