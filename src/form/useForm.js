import { useCallback, useRef } from 'react'
import { Map } from 'immutable'
import { Form } from './Form'
import { createReducer } from './reducer/createReducer'
import { getFieldState } from './reducer/getFieldState'
import { actions, fieldsKey } from './reducer/fieldReducer'
import { getInitialState } from './reducer/getInitialState'
import { resolveFieldData, resolveField, getFieldProps } from './resolveFieldData'
import { mergeFormValues } from './helpers/mergeFormValues'
import { getFieldValues } from './helpers/getFieldValues'
import { formStateResolvers } from './formStateResolvers'
import { setPropsAtPath } from './helpers/setPropsAtPath'

/**
 * @param  param0 { import("./useForm").IFormProps }
 */
export const useForm = ({ fields, submit, validate, options = {}, initialValues = Map() }) => {
  const [state, dispatch] = createReducer({ fields, initialValues, options })
  const fieldCache = useRef()

  let fieldData
  const lastPath = state.get('lastPath')

  const t0 = performance.now()
  if (!lastPath || lastPath.length === 0 || lastPath[0] === '') {
    fieldData = resolveFieldData(state, dispatch)
  } else {
    const path = [fieldsKey, ...lastPath]
    const props = resolveField(state.getIn(path), dispatch)
    fieldData = fieldCache.current
    setPropsAtPath(fieldData, props, lastPath)
  }
  if (options.logPerformance) {
    console.log('Perf:resolveFieldData', (performance.now() - t0))
  }

  fieldCache.current = fieldData

  const stateResolvers = formStateResolvers(state)

  const addField = field => {
    const fieldState = getFieldState(field, initialValues, options)
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
    let result = {
      isValid: true,
      errors: tryValidateForm(),
    }

    Object.entries(fieldData).forEach(([key, v]) => {
      if (result.errors[key]) {
        v.setValidationResult(result.errors[key])
        result.isValid = false
      } else {
        // only need to run field validation if there is already a form level issue with it.
        const fieldResult = v.validate()

        const hasError = Boolean(fieldResult)
        if (hasError) {
          if (typeof fieldResult === 'object') {
            result.errors = { ...result.errors, [key]: fieldResult }
          } else {
            result.errors[key] = fieldResult
          }
        }
        result.isValid = result.isValid && !hasError
      }
    })

    return result
  }

  const getValidationResult = () => {
    return tryValidateFormAndFields()
  }

  const trySubmitTheForm = (skipValidation = false) => {
    let canSkip = false
    let canSubmit
    if (typeof skipValidation === 'boolean') {
      canSkip = skipValidation
    }

    if (canSkip) {
      canSubmit = true
    } else {
      const result = tryValidateFormAndFields()
      canSubmit = result.isValid
    }

    if (canSubmit && submit) {
      submit(mergeFormValues(state, initialValues))
    }
  }

  const getValuesIfFormValid = () => {
    const result = tryValidateFormAndFields()

    if (result.isValid) {
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
      validate: getValidationResult,
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

