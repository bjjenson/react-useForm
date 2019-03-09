import { useFormField } from './useFormField'

/**
 * @param  args { import("..").IFormFieldArgs}
 * @param  initial String
 */
export const useTextField = (state, dispatch, args = {}) => {
  return useFormField(state, dispatch, args)
}

export const defaultTextValue = ''
