import { actions } from '../reducer/fieldReducer'
/**
 * @param  fieldArgs { import("../useForm").IFormFieldArgs}
 * @returns {import("../useForm").IFormField}
 */
export const useFormField = (state, dispatch, fieldArgs = {}) => {
  const requiredMessage = fieldArgs.requiredMessage || 'Required'

  const tryValidate = (value, touched) => {
    let result
    if (value && fieldArgs.validate) {
      result = fieldArgs.validate(value, fieldArgs.name, state.get('getAllValues'))
    }

    if (!Boolean(result) && !fieldArgs.optional && touched && value === '') {
      result = requiredMessage
    }

    if (touched) {
      dispatch(actions.validationResult(fieldArgs.name, Boolean(result), result))
    }
    return !Boolean(result)
  }

  const setValue = v => {
    dispatch(actions.updateValue(fieldArgs.name, v))
    tryValidate(v, state.getIn(['current', 'touched']))
  }

  const onChange = ({ target }) => {
    const value = fieldArgs.valueFromTarget ? fieldArgs.valueFromTarget(target) : target.value
    const coercedValue = fieldArgs.normalize ? fieldArgs.normalize(value) : value
    setValue(coercedValue)
    tryValidate(coercedValue, true)
  }

  const onBlur = () => {
    dispatch(actions.touched(fieldArgs.name))
    tryValidate(state.getIn(['current', 'value']), true)
  }

  const setValidationResult = result => {
    dispatch(actions.validationResult(fieldArgs.name, true, result))
  }

  const validate = () => {
    return tryValidate(state.getIn(['current', 'value']), true)
  }

  return {
    props: {
      error: state.getIn(['current', 'error']),
      helperText: state.getIn(['current', 'helperText']),
      label: state.getIn(['initial', 'label']),
      value: state.getIn(['current', 'value']),
      // handlers
      onBlur,
      onChange,
    },
    setValidationResult,
    setValue,
    validate,
  }
}
