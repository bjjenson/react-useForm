import { validateForm } from './validateForm'

export const tryValidateFormAndFields = (validate, fieldData) => {
  let result = {
    isValid: true,
    errors: validateForm(validate, fieldData),
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
