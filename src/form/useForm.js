import { Map } from 'immutable'
import { Form } from './Form'
import { createReducer, generateDefaultFieldState } from './reducer/createReducer'
import { actions } from './reducer/fieldReducer'
import {
  useBooleanField,
  useNumberField,
  useSelectField,
  useTextField,
} from './fields'

/**
 * @param  param0 { import("./useForm").IFormProps }
 */
export const useForm = ({ fields, submit, validate, options = {}, initialValues = Map() }) => {
  const [state, dispatch] = createReducer({ fields, initialValues, options })

  const fieldData = state.keySeq().reduce((acc, fieldName) => {
    const fieldState = state.get(fieldName)
      .set('getAllValues', () => getFieldValues(fieldData))

    const fieldType = state.getIn([fieldName, 'initial', 'type'])
    const field = state.getIn([fieldName, 'initial', 'field'])
    switch (fieldType) {
      case 'select':
        acc[fieldName] = useSelectField(fieldState, dispatch, field)
        break
      case 'boolean':
        acc[fieldName] = useBooleanField(fieldState, dispatch, field)
        break
      case 'number':
        acc[fieldName] = useNumberField(fieldState, dispatch, field)
        break
      case 'text':
      default:
        acc[fieldName] = useTextField(fieldState, dispatch, field)
        break
    }
    return acc
  }, {})

  const addField = field => {
    const fieldState = generateDefaultFieldState(field, initialValues, options)
    dispatch(actions.insertField(field.name, fieldState))
  }

  const removeField = fieldName => {
    dispatch(actions.removeField(fieldName))
  }

  const tryValidateForm = () => {
    if (validate) {
      const values = getFieldValues(fieldData)
      let results = {}
      let validators = validate
      if (!Array.isArray(validate)) { validators = [validate] }

      for (let v of validators) {
        results = {
          ...results,
          ...v(values),
        }
      }
      return results
    }

    return {}
  }

  const trySubmitForm = () => {
    let isFormValid = true
    const formResults = tryValidateForm()
    const values = Object.entries(fieldData).reduce((acc, [key, v]) => {
      if (formResults[key]) {
        v.setValidationResult({ error: true, helperText: formResults[key] })
        isFormValid = false
      }

      const isFieldValid = v.validate()
      isFormValid = isFormValid && isFieldValid

      return acc.set(key, v.props.value)
    }, initialValues)
    if (isFormValid) {
      submit(values)
    }
  }

  const setValue = (fieldName, value) => {
    fieldData[fieldName].setValue(value)
  }

  return [
    { ...getFieldProps(fieldData) },
    {
      setValue,
      submit: trySubmitForm,
      Form,
      addField,
      removeField,
    },
  ]
}

const getFieldValues = (fieldData) => {
  return Object.entries(fieldData).reduce((acc, [k, v]) => {
    acc[k] = v.props.value
    return acc
  }, {})
}

const getFieldProps = (fieldData) => {
  return Object.entries(fieldData).reduce((acc, [k, v]) => {
    acc[k] = v.props
    return acc
  }, {})
}
