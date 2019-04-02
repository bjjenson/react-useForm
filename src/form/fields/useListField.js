import { List, Map } from 'immutable'
import { actions } from '../reducer/fieldReducer'
import { resolveFieldData, getFieldProps } from '../resolveFieldData'
import { getFields } from '../reducer/generateDefaultListState'
/**
 * @param  fieldArgs { import("../useForm").IFormFieldArgs}
 * @returns {import("../useForm").IFormField}
 */
export const useListField = (state, dispatch, fieldArgs = {}) => {
  const requiredMessage = fieldArgs.requiredMessage || 'Required'

  const setValidationResult = result => {
    dispatch(actions.validationResult(fieldArgs.name, true, result))
  }

  const setValue = v => {
    // dispatch(actions.updateValue(fieldArgs.name, v))
    // tryValidate(v, state.getIn(['current', 'touched']))
  }

  const validate = () => {
    const isEmpty = state.get('items', List()).size === 0
    dispatch(actions.validationResult(fieldArgs.name, isEmpty, isEmpty ? requiredMessage : ''))
    return !isEmpty
  }

  const add = (item = Map()) => {
    const options = state.getIn(['initial', 'options'])
    const field = state.getIn(['initial', 'field'])
    const size = state.get('items', List()).size
    const itemState = getFields(field.fields, item, options, fieldArgs.name, size)
    dispatch(actions.addListItem(fieldArgs.name, itemState))
  }

  const remove = index => {
    dispatch(actions.removeListItem(fieldArgs.name, index))
  }

  const fieldData = state.getIn(['items']).map(item => {
    return resolveFieldData(item, dispatch)
  }).toJS()

  return {
    props: {
      error: state.getIn(['current', 'error']),
      helperText: state.getIn(['current', 'helperText']),
      label: state.getIn(['initial', 'label']),
      items: fieldData.map((item, index) => ({
        ...getFieldProps(item),
        key: `${fieldArgs.name}.${index}`,
      })),
      add,
      remove,
    },
    setValidationResult,
    setValue,
    validate,
  }
}

export const defaultListValue = List()
