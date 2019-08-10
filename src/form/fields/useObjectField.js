import { Map } from 'immutable'
import { useFormField } from './useFormField'

export const useObjectField = (state, dispatch, args = {}) => {
  if (args.valueFromChange === undefined) {
    args.valueFromChange = v => v
  }
  return useFormField(state, dispatch, args)
}

export const defaultObjectValue = Map()
