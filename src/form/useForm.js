import { useCallback, useRef } from 'react'
import { Map } from 'immutable'
import { Form } from './Form'
import { createReducer } from './reducer/createReducer'
import { generateDefaultFieldState } from './reducer/generateDefaultFieldState'
import { actions, fieldsKey } from './reducer/fieldReducer'
import { getInitialState } from './reducer/getInitialState'
import { resolveFieldData, getFieldValues, getFieldProps } from './resolveFieldData'
import { mergeFormValues } from './helpers/mergeFormValues'
import { formStateResolvers } from './formStateResolvers'

/**
 * @param  param0 { import("./useForm").IFormProps }
 */
export const useForm = ({ fields, submit, validate, options = {}, initialValues = Map() }) => {
  const [state, dispatch] = createReducer({ fields, initialValues, options })
  const fieldCache = useRef()

  let fieldData
  const lastField = state.get('lastField')

  if (!lastField) {
    fieldData = resolveFieldData(state, dispatch)
  } else {
    fieldData = fieldCache.current
    fieldData[lastField] = resolveFieldData(Map().setIn([fieldsKey, lastField], state.getIn([fieldsKey, lastField])), dispatch)[lastField]
  }

  fieldCache.current = fieldData

  const stateResolvers = formStateResolvers(state)

  const addField = field => {
    const fieldState = generateDefaultFieldState(field, initialValues, options)
    dispatch(actions.insertField(field.name, fieldState))
  }

  const removeField = fieldName => {
    dispatch(actions.removeField(fieldName))
  }

  const addFieldListener = (fieldName, listener) => {
    dispatch(actions.addListener(fieldName, listener))
  }

  const removeFieldListener = (fieldName, listener) => {
    dispatch(actions.removeListener(fieldName, listener))
  }

  const tryValidateForm = useCallback(() => {
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
  })

  const tryValidateFormAndFields = () => {
    let isFormValid = true
    const formResults = tryValidateForm()

    Object.entries(fieldData).forEach(([key, v]) => {
      if (formResults[key]) {
        v.setValidationResult(formResults[key])
        isFormValid = false
      } else {
        // only need to run field validation if there is already a form level issue with it.
        const isFieldValid = v.validate()
        isFormValid = isFormValid && isFieldValid
      }
    })

    return isFormValid
  }

  const trySubmitTheForm = () => {
    const canSubmit = tryValidateFormAndFields()
    if (canSubmit && submit) {
      submit(mergeFormValues(state, initialValues))
    }
  }

  const getValuesIfFormValid = () => {
    if (tryValidateFormAndFields()) {
      return mergeFormValues(state, initialValues)
    }
    return null
  }

  const resetForm = () => {
    const derivedInitialState = getInitialState(fields, initialValues, options)
    dispatch(actions.reset(derivedInitialState))
  }

  const setValue = (fieldName, value) => {
    fieldData[fieldName].setValue(value)
  }

  return [
    { ...getFieldProps(fieldData, state) },
    {
      setValue,
      getValuesIfFormValid,
      submit: trySubmitTheForm,
      reset: resetForm,
      Form,
      addField,
      removeField,
      addFieldListener,
      removeFieldListener,
      ...stateResolvers,
      getValues: () => mergeFormValues(state, initialValues),
    },
  ]
}

