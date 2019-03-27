import { useFormField } from './useFormField'

/**
 * @param  args { import("../useForm").IFormFieldArgs}
 */
export const useTextField = (state, dispatch, args = {}) => {
  return useFormField(state, dispatch, args)
}

export const defaultTextValue = ''
