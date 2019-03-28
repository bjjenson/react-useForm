import { useFormField } from './useFormField'

export const useBooleanField = (state, dispatch, args = {}) => {
  const valueFromChange = event => event.target.checked

  const result = useFormField(state, dispatch, { ...args, valueFromChange })
  result.props.checked = result.props.value
  return result
}

export const defaultBooleanValue = false
