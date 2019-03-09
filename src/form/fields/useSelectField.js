import { useFormField } from './useFormField'

export const useSelectField = (state, dispatch, args = {}) => {

  const fieldProps = useFormField(state, dispatch, args)
  fieldProps.props.options = args.options
  return fieldProps
}

export const defaultSelectValue = ''
