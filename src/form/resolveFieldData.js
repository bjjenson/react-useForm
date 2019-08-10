import { Map } from 'immutable'
import { fieldsKey } from './reducer/fieldReducer'
import {
  useBooleanField,
  useNumberField,
  useListField,
  useSelectField,
  useTextField,
  useObjectField,
} from './fields'

export const resolveFieldData = (state, dispatch) => {
  const fieldData = state.get(fieldsKey, Map()).entrySeq().reduce((acc, [fieldName, current]) => {
    const fieldState = current.set('getAllValues', () => getFieldValues(fieldData))

    acc[fieldName] = resolveField(fieldState, dispatch)
    return acc
  }, {})
  return fieldData
}

export const resolveField = (fieldState, dispatch) => {
  const field = fieldState.getIn(['initial', 'field'])
  const fieldType = fieldState.getIn(['initial', 'type'])
  switch (fieldType) {
    case 'select':
      return useSelectField(fieldState, dispatch, field)
    case 'boolean':
      return useBooleanField(fieldState, dispatch, field)
    case 'number':
      return useNumberField(fieldState, dispatch, field)
    case 'list':
      return useListField(fieldState, dispatch, field)
    case 'object':
      return useObjectField(fieldState, dispatch, field)
    case 'text':
    default:
      return useTextField(fieldState, dispatch, field)
  }
}

export const getFieldValues = (fieldData) => {
  return Object.entries(fieldData).reduce((acc, [k, v]) => {
    acc[k] = v.props.value
    return acc
  }, {})
}

export const getFieldProps = (fieldData, state = Map()) => {
  return Object.entries(fieldData).reduce((acc, [key, v]) => {
    const passThrough = state.getIn([fieldsKey, key, 'initial', 'field'], {}).passThrough || {}

    acc[key] = {
      ...v.props,
      ...passThrough,
    }
    return acc
  }, {})
}
