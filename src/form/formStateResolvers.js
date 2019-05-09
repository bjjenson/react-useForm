import { Map } from 'immutable'
import { fieldsKey } from './reducer/fieldReducer'

export const formStateResolvers = state => {

  const getAnyTouched = () => state.get(fieldsKey, Map())
    .reduce(((bool, v) => bool || v.getIn(['current', 'touched'])), false)

  const getIsPristine = () => state.get(fieldsKey, Map())
    .reduce(((bool, v) => bool && v.getIn(['current', 'pristine'])), true)

  return {
    getAnyTouched,
    getIsPristine,
  }
}
