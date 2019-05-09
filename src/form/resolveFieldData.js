import { Map } from 'immutable'
import { fieldsKey } from './reducer/fieldReducer'
import {
  useBooleanField,
  useNumberField,
  useListField,
  useSelectField,
  useTextField,
} from './fields'

export const resolveFieldData = (state, dispatch) => {
  const fieldData = state.get(fieldsKey, Map()).keySeq().reduce((acc, fieldName) => {
    const fieldState = state.getIn([fieldsKey, fieldName])
      .set('getAllValues', () => getFieldValues(fieldData))

    const fieldType = state.getIn([fieldsKey, fieldName, 'initial', 'type'])
    const field = state.getIn([fieldsKey, fieldName, 'initial', 'field'])
    switch (fieldType) {
      case 'select':
        acc[fieldName] = useSelectField(fieldState, dispatch, field)
        break
      case 'boolean':
        acc[fieldName] = useBooleanField(fieldState, dispatch, field)
        break
      case 'number':
        acc[fieldName] = useNumberField(fieldState, dispatch, field)
        break
      case 'list':
        acc[fieldName] = useListField(fieldState, dispatch, field)
        break
      case 'text':
      default:
        acc[fieldName] = useTextField(fieldState, dispatch, field)
        break
    }
    return acc
  }, {})
  return fieldData
}

export const getFieldValues = (fieldData) => {
  return Object.entries(fieldData).reduce((acc, [k, v]) => {
    acc[k] = v.props.value
    return acc
  }, {})
}

export const getFieldProps = (fieldData, fieldArgs) => {
  return Object.entries(fieldData).reduce((acc, [k, v]) => {
    let rest = []
    if (Array.isArray(fieldArgs)) {
      const { passThrough } = fieldArgs.find(f => f.name === k)
      rest = passThrough
    }

    acc[k] = {
      ...v.props,
      ...rest,
    }
    return acc
  }, {})
}
