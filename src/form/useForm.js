import { useRef } from 'react'
import { Map } from 'immutable'
import { Form } from './Form'
import { createReducer } from './reducer/createReducer'
import { getFieldState } from './reducer/getFieldState'
import { actions, fieldsKey } from './reducer/fieldReducer'
import { getInitialState } from './reducer/getInitialState'
import { resolveFieldData, resolveField, getFieldProps } from './resolveFieldData'
import { mergeFormValues } from './helpers/mergeFormValues'
import { formStateResolvers } from './formStateResolvers'
import { setPropsAtPath } from './helpers/setPropsAtPath'
import { validateAll } from './validate/validateAll'
import { getHasError } from './validate/getHasError'

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

  const getValidationResult = () => {
    const errors = validateAll(state, fieldData, validate)
    dispatch(actions.validateAll(errors))
    return errors
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
      const errors = validateAll(state, fieldData, validate)
      canSubmit = !getHasError(errors)
      dispatch(actions.validateAll(errors))
    }

    if (canSubmit && submit) {
      submit(mergeFormValues(state, initialValues))
    }
  }

  const getValuesIfFormValid = () => {
    const errors = validateAll(state, fieldData, validate)

    if (!getHasError(errors)) {
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

  const fieldProps = getFieldProps(fieldData, state)

  return [
    { ...fieldProps },
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

