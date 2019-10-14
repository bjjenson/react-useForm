import { fromJS } from 'immutable'
import { getInitialState } from '../reducer/getInitialState'
import { validateAll } from '../validate/validateAll'
import { resolveFieldData } from '../resolveFieldData'
import { getFieldValues } from '../helpers/getFieldValues'
import { pruneNonErrors } from '../validate/pruneNonErrors'

export const createMemoryForm = ({ fields, validate, initialValues }) => {
  let fieldData
  const formTools = {
    current: {},
  }
  const fakeDispatch = () => undefined
  const getAllValues = () => fromJS(getFieldValues(fieldData))

  const state = getInitialState(fields, initialValues, {}, formTools)
  fieldData = resolveFieldData(state, fakeDispatch, getAllValues)

  const validateForm = () => {
    let errors = validateAll(state, fieldData, validate, getAllValues)
    errors = pruneNonErrors(errors)
    return {
      errors,
      isValid: Object.keys(errors).length === 0,
    }
  }

  return {
    validate: validateForm,
  }
}
