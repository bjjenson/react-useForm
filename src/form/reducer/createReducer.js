import { Map } from 'immutable'
import { useReducer, useMemo } from 'react'
import { fieldReducer, actions } from './fieldReducer'
import { getInitialState } from './getInitialState'

export const createReducer = ({ fields, options = {}, initialValues = Map(), formTools }) => {
  const calcInitialState = () => {
    return getInitialState(fields, initialValues, options, formTools)
  }
  const [state, dispatch] = useReducer(fieldReducer, Map(), () => {
    return calcInitialState()
  })

  useMemo(() => {
    setTimeout(() => {
      dispatch(actions.reset(calcInitialState()))
    })
  }, [initialValues.hashCode()])

  return [state, dispatch]
}
