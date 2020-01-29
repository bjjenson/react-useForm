import { List, Map } from 'immutable'
import { actions } from '../reducer/fieldReducer'
import { resolveFieldData, getFieldProps } from '../resolveFieldData'
import { getFields } from '../reducer/generateDefaultListState'
import { prepareNameForValidate } from './prepareNameForValidate'
/**
 * @param  fieldArgs { import("../useForm").IFormFieldArgs}
 * @returns {import("../useForm").IFormField}
 */
export const useListField = (state, dispatch, fieldArgs = {}, getAllValues) => {
  const requiredMessage = fieldArgs.requiredMessage || 'Required'

  const setValue = () => {
    // dispatch(actions.updateValue(fieldArgs.name, v))
    // tryValidate(v, state.getIn(['current', 'touched']))
  }

  const validate = (items) => {
    let message
    if (fieldArgs.validate) {
      message = fieldArgs.validate(items, prepareNameForValidate(fieldArgs.name), state.get(('getAllValues')))
    }
    if (!message && items.size === 0 && !fieldArgs.optional) {
      message = requiredMessage
    }

    dispatch(actions.validationResult(fieldArgs.name, Boolean(message), message || ''))
  }

  const add = (item = Map()) => {
    const options = state.getIn(['initial', 'options'])
    const field = state.getIn(['initial', 'field'])
    const items = state.get('items', List())
    const itemState = getFields(field.fields, item, options, fieldArgs.name, items.size)
    dispatch(actions.addListItem(fieldArgs.name, itemState))
    validate(items.push(item))
  }

  const remove = index => {
    const items = state.get('items', List())
    dispatch(actions.removeListItem(fieldArgs.name, index))
    validate(items.remove(index))
  }

  const updateIndex = (fromIndex, toIndex) => {
    dispatch(actions.updateListIndex(fieldArgs.name, fromIndex, toIndex))
  }

  const fieldData = state.getIn(['items'], List()).map(item => {
    return resolveFieldData(item, dispatch, getAllValues)
  }).toArray()

  return {
    props: {
      error: state.getIn(['current', 'error']),
      helperText: state.getIn(['current', 'helperText']),
      label: state.getIn(['initial', 'label']),
      items: fieldData.map((item, index) => ({
        ...getFieldProps(item, state.getIn(['items', index])),
        key: `${fieldArgs.name}.${index}`,
      })),
      add,
      remove,
      updateIndex,
    },
    setValue,
  }
}

export const defaultListValue = List()
