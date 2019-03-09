import { useFormField } from './useFormField'

export const useBooleanField = (state, dispatch, args = {}) => {
  const valueFromTarget = target => target.checked

  const result = useFormField(state, dispatch, { ...args, valueFromTarget })
  result.props.checked = result.props.value
  return result
}

export const defaultBooleanValue = false
