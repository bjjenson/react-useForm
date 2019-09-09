import { validateForm } from './validateForm'
import { validateFields } from './validateFields'
import { mergeErrors } from './mergeErrors'

export const validateAll = (state, fieldData, validateFunctions, getAllValues) => {
  const formErrors = validateForm(validateFunctions, fieldData)
  const fieldErrors = validateFields(state, getAllValues)

  return mergeErrors(fieldErrors, formErrors)
  // dispatch(actions.validateAll(results))
}
