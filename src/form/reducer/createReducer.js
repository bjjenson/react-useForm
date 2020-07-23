import { Map } from 'immutable'
import { useRef, useReducer, useMemo } from 'react'
import { fieldReducer, actions } from './fieldReducer'
import { getInitialState } from './getInitialState'

export const createReducer = ({ fields, options = {}, initialValues = Map(), formTools }) => {
  const calcInitialState = () => {
    return getInitialState(fields, initialValues, options, formTools)
  }
  const [state, dispatch] = useReducer(fieldReducer, Map(), () => {
    return calcInitialState()
  })
  const hashCodeRef = useRef()

  useMemo(() => {
    if(!hashCodeRef.current) {
      hashCodeRef.current = initialValues.hashCode()
      return
    }

    hashCodeRef.current = initialValues.hashCode()
    setTimeout(() => {
      dispatch(actions.reset(calcInitialState()))
      options.initialized && options.initialized({ initialValues, ...formTools.current })
    })
  }, [initialValues.hashCode()])

  return [state, dispatch]
}
