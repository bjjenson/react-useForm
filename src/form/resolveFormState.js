import { Map } from 'immutable'
import { fieldsKey } from './reducer/fieldReducer'

export const resolveFormState = state => {
  const fieldData = state.get(fieldsKey, Map())

  const anyTouched = fieldData.reduce(((bool, v) => bool || v.getIn(['current', 'touched'])), false)
  const isPristine = fieldData.reduce(((bool, v) => bool && v.getIn(['current', 'pristine'])), true)

  return {
    anyTouched,
    isPristine,
  }
}
