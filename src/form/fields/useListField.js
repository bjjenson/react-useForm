import { List, Map } from 'immutable'
import { actions } from '../reducer/fieldReducer'
import { resolveFieldData, getFieldProps } from '../resolveFieldData'
import { getFields, generateDefaultListState } from '../reducer/generateDefaultListState'
import { prepareNameForValidate } from './prepareNameForValidate'
import {getId} from '../helpers/getId'

/**
 * @param  fieldArgs { import("../useForm").IFormFieldArgs}
 * @returns {import("../useForm").IFormField}
 */
export const useListField = (state, dispatch, fieldArgs = {}, getAllValues, formOptions = {}) => {
  const requiredMessage = fieldArgs.requiredMessage || 'Required'

  const setValue = (value) => {
    const s = generateDefaultListState(fieldArgs, Map().setIn(fieldArgs.name.split('.'), value), formOptions)

    dispatch(actions.updateList(fieldArgs.name, s.get('items')))
    validate(s.get('items'))
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
    return resolveFieldData(item, dispatch, getAllValues, formOptions)
  }).toArray()

  const id = getId(formOptions.id, fieldArgs.name)
  return {
    props: {
      id,
      error: state.getIn(['current', 'error']),
      helperText: state.getIn(['current', 'helperText']),
      label: state.getIn(['initial', 'label']),
      items: fieldData.map((item, index) => {
        const key = `${fieldArgs.name}.${index}`
        return {
        ...getFieldProps(item, state.getIn(['items', index]), getId(formOptions.id, key)),
        key,
      }}),
      add,
      remove,
      updateIndex,
    },
    setValue,
  }
}

export const defaultListValue = List()
