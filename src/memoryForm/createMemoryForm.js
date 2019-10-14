import { fromJS } from 'immutable'
import { getInitialState } from '../form/reducer/getInitialState'
import { validateAll } from '../form/validate/validateAll'
import { resolveFieldData } from '../form/resolveFieldData'
import { getFieldValues } from '../form/helpers/getFieldValues'
import { pruneNonErrors } from '../form/validate/pruneNonErrors'

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
