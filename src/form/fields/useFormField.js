import { actions } from '../reducer/fieldReducer'
/**
 * @param  fieldArgs { import("../useForm").IFormFieldArgs}
 * @returns {import("../useForm").IFormField}
 */
export const useFormField = (state, dispatch, fieldArgs = {}) => {
  const requiredMessage = fieldArgs.requiredMessage || 'Required'

  const validate = (value, touched = false) => {
    let result

    if (value !== '' && value !== undefined && fieldArgs.validate) {
      result = fieldArgs.validate(value, fieldArgs.name, state.get('getAllValues'))
    }

    if (!Boolean(result) && !fieldArgs.optional && touched && value === '') {
      result = requiredMessage
    }

    if (touched || (!Boolean(result) && state.getIn(['current', 'helperText']))) {
      dispatch(actions.validationResult(fieldArgs.name, Boolean(result), result))
    }
    return result
  }

  const setValue = v => {
    dispatch(actions.updateValue(fieldArgs.name, v))
    validate(v, state.getIn(['current', 'touched']))
  }

  const onChange = event => {
    const value = fieldArgs.valueFromChange ? fieldArgs.valueFromChange(event) : event.target.value
    const coercedValue = fieldArgs.normalize ? fieldArgs.normalize(value) : value
    setValue(coercedValue)
    validate(coercedValue, state.getIn(['current', 'touched']))
  }

  const onBlur = () => {
    dispatch(actions.touched(fieldArgs.name))
    validate(state.getIn(['current', 'value']), true)
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
    meta: {
      touched: state.getIn(['current', 'touched']),
      pristine: state.getIn(['current', 'pristine']),
    },
    setValue,
  }
}
