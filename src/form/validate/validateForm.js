import { Map } from 'immutable'
import { getFieldValues } from '../helpers/getFieldValues'

export const validateForm = (validateFunctions, fieldData) => {
  if (!validateFunctions) return {}

  const values = getFieldValues(fieldData)
  let results = Map()
  let validators = validateFunctions
  if (!Array.isArray(validateFunctions)) { validators = [validateFunctions] }

  for (let v of validators) {
    results = results.mergeDeep(v(values))
  }
  return results.toJS()
}
