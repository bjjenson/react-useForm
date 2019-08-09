import { Map } from 'immutable'
import { useReducer, useMemo } from 'react'
import { fieldReducer, actions } from './fieldReducer'
import { getInitialState } from './getInitialState'

export const createReducer = ({ fields, options = {}, initialValues = Map() }) => {
  const calcInitialState = () => {
    return getInitialState(fields, initialValues, options)
  }
  const [state, dispatch] = useReducer(fieldReducer, Map(), () => {
    return calcInitialState()
  })

  const json = JSON.stringify(initialValues.toJS())
  useMemo(() => {
    setTimeout(() => {
      dispatch(actions.reset(calcInitialState()))
    })
    return json
  }, [json])

  return [state, dispatch]
}
