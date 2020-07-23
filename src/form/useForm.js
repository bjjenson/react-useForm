import { useRef, useEffect } from 'react'
import { Map, fromJS } from 'immutable'
import Form from './Form'
import { createReducer } from './reducer/createReducer'
import { getFieldState } from './reducer/getFieldState'
import { actions, fieldsKey } from './reducer/fieldReducer'
import { getInitialState } from './reducer/getInitialState'
import { resolveFieldData, resolveField, getFieldProps } from './resolveFieldData'
import { mergeFormValues } from './helpers/mergeFormValues'
import { getFieldValues } from './helpers/getFieldValues'
import { formStateResolvers } from './formStateResolvers'
import { setPropsAtPath } from './helpers/setPropsAtPath'
import { validateAll } from './validate/validateAll'
import { getHasError } from './validate/getHasError'
import { pruneNonErrors } from './validate/pruneNonErrors'

/**
 * @param  param0 { import("./useForm").IFormProps }
 */
export const useForm = ({ fields, submit, validate, options = {}, initialValues = Map() }) => {
  const formTools = useRef()
  const [state, dispatch] = createReducer({ fields, initialValues, options, formTools })
  const fieldCache = useRef()

  let fieldData
  const lastPath = state.get('lastPath')

  const getAllValues = () => {
    return fromJS(getFieldValues(fieldCache.current))
  }

  const t0 = performance.now()
  if (!lastPath || lastPath.length === 0 || lastPath[0] === '') {
    fieldData = resolveFieldData(state, dispatch, getAllValues, options)
  } else {
    const path = [fieldsKey, ...lastPath]
    const props = resolveField(state.getIn(path), dispatch, getAllValues)
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
    let errors = validateAll(state, fieldData, validate, getAllValues)
    dispatch(actions.validateAll(errors))
    errors = pruneNonErrors(errors)
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
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
      const errors = validateAll(state, fieldData, validate, getAllValues)
      canSubmit = !getHasError(errors)
      dispatch(actions.validateAll(errors))
    }

    if (canSubmit && submit) {
      submit(mergeFormValues(state, initialValues))
    }
  }

  const getValuesIfFormValid = () => {
    const errors = validateAll(state, fieldData, validate, getAllValues)

    if (!getHasError(errors)) {
      return mergeFormValues(state, initialValues)
    }
    return null
  }

  const resetForm = () => {
    const derivedInitialState = getInitialState(fields, initialValues, options, formTools)
    dispatch(actions.reset(derivedInitialState))
  }

  const setValue = (fieldName, value) => {
    fieldData[fieldName].setValue(value)
  }

  const getValues = () => mergeFormValues(state, initialValues)

  const updateFieldDefinition = (fieldName, definition) => {
    dispatch(actions.updateFieldDefinition(fieldName, { definition: { name: fieldName, ...definition }, options }))
  }

  const fieldProps = getFieldProps(fieldData, state, options.id)

  formTools.current = {
    addField,
    removeField,
    addFieldListener,
    removeFieldListener,
    setValue,
    getValues,
    getFields: () => fieldProps,
    updateFieldDefinition,
  }

  useEffect(() => {
    options.initialized && options.initialized({ initialValues, ...formTools.current })
  }, [initialValues.hashCode()])

  return [
    { ...fieldProps },
    {
      setValue,
      getValuesIfFormValid,
      submit: trySubmitTheForm,
      validate: getValidationResult,
      reset: resetForm,
      id: options.id || '',
      Form,
      addField,
      removeField,
      addFieldListener,
      removeFieldListener,
      ...stateResolvers,
      getValues,
      updateFieldDefinition,
    },
  ]
}

