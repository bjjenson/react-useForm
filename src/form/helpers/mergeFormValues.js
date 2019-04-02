import { Map, List } from 'immutable'
import { fieldsKey, removedFieldsKey } from '../reducer/fieldReducer'

export const mergeFormValues = (state, initialValues) => {
  let values = reduceFields(state, initialValues)
  // Remove any fields that were specifically removed through actions
  values = state.get(removedFieldsKey, List()).reduce((acc, fieldName) => {
    return acc.deleteIn(fieldName.split('.'))
  }, values)

  return values
}

const reduceFields = (state, initialState) => {
  return state.get(fieldsKey, Map()).entrySeq().reduce((acc, [key, fieldData]) => {
    const items = fieldData.get('items')
    const value = !items ?
      fieldData.getIn(['current', 'value']) :
      items.map(item => {
        return reduceFields(item, Map())
      })

    return acc.setIn(key.split('.'), value)
  }, initialState)
}
