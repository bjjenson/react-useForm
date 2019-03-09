import { useFormField } from './useFormField'

export const useNumberField = (state, dispatch, args = {}) => {
  return useFormField(state, dispatch, args)
}

export const defaultNumberValue = 0
