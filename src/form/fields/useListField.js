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

  const setValue = () => {
    // dispatch(actions.updateValue(fieldArgs.name, v))
    // tryValidate(v, state.getIn(['current', 'touched']))
  }

  const validate = () => {
    const isEmpty = state.get('items', List()).size === 0 && !fieldArgs.optional
    dispatch(actions.validationResult(fieldArgs.name, isEmpty, isEmpty ? requiredMessage : ''))

    const myError = isEmpty ? { [fieldArgs.name]: requiredMessage } : undefined
    const errors = validateItems()
    if (errors.length > 0) {
      return {
        ...myError,
        items: errors,
      }
    }

    if (myError) {
      return {
        ...myError,
      }
    }
  }

  const validateItems = () => {
    const s = state.get('items', List()).reduce((acc, item, index) => {
      const fieldResults = Object.entries(resolveFieldData(item, dispatch)).reduce((cca, [key, fieldData]) => {
        const result = fieldData.validate()
        if (result) {
          if (typeof result === 'object') {
            return { ...cca, [key]: Object.values(result)[0] }
          } else {
            cca[key] = result
          }
        }
        return cca
      }, {})

      if (Object.keys(fieldResults).length > 0) {
        acc[index] = fieldResults
      }
      return acc
    }, [])

    return s
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

  const fieldData = state.getIn(['items'], List()).map(item => {
    return resolveFieldData(item, dispatch)
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
    },
    setValidationResult,
    setValue,
    validate,
  }
}

export const defaultListValue = List()
