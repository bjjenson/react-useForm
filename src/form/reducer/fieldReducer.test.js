import { fromJS } from 'immutable'
import { fieldReducer, actions, removedFieldsKey, getFieldPath } from './fieldReducer'
import { syncListIndexes } from './syncListIndexes'

jest.mock('./syncListIndexes')

jest.useFakeTimers()

let state, fieldName, formTools
beforeEach(() => {
  fieldName = 'field-name'
  formTools = {
    current: 'current-form-tools',
  }
  state = fromJS({
    fields: {
      [fieldName]: {
        initial: {
          value: '',
        },
        current: {
          value: '',
          pristine: true,
          touched: false,
          error: false,
          helperText: '',
        },
      },
      otherField: {
        initial: {
          value: '',
        },
        current: {
          value: '',
          pristine: true,
          touched: false,
          error: false,
          helperText: '',
        },
      },
    },
  }).set('formTools', formTools)

  syncListIndexes.mockImplementation(s => s)
  setTimeout.mockImplementation(cb => {
    cb()
  })
})

test('type not handled, return state', () => {
  expect(fieldReducer(state, {})).toEqual(state)
})

test('updateValue for field updates value on current', () => {
  const action = actions.updateValue(fieldName, 'new value')
  expect(fieldReducer(state, action)).toMatchSnapshot()
})

test('pristine is false if value not equal to initial', () => {
  const action = actions.updateValue(fieldName, 'new value')
  expect(fieldReducer(state, action)).toMatchSnapshot()
})

test('pristine is true if value equal to initial', () => {
  state = state.setIn([fieldName, 'current', 'pristine'], false)
  const action = actions.updateValue(fieldName, '')
  expect(fieldReducer(state, action)).toMatchSnapshot()
})

test('touched set on current field', () => {
  const action = actions.touched(fieldName)
  expect(fieldReducer(state, action)).toMatchSnapshot()
})

test('validationResult set on current field', () => {
  const action = actions.validationResult(fieldName, true, 'i am error')
  expect(fieldReducer(state, action)).toMatchSnapshot()
})

test('insertField', () => {
  const fieldState = fromJS({
    initial: {
      value: 'one',
    },
    current: {
      value: 'one',
    },
  })
  const action = actions.insertField('newField', fieldState)
  expect(fieldReducer(state, action)).toMatchSnapshot()
})

test('insertField removes fieldName from removedFields', () => {
  const fieldState = fromJS({
    initial: {
      value: 'one',
    },
    current: {
      value: 'one',
    },
  })
  const withRemoved = state.set(removedFieldsKey, fromJS(['newField']))
  const action = actions.insertField('newField', fieldState)
  expect(fieldReducer(withRemoved, action)).toMatchSnapshot()
})

test('removeField', () => {
  const action = actions.removeField(fieldName)
  expect(fieldReducer(state, action)).toMatchSnapshot()
})

describe('nested fields', () => {
  beforeEach(() => {
    state = fromJS({
      fields: {
        'parent.nested': {
          initial: {
            value: '',
          },
          current: {
            value: '',
            pristine: true,
            touched: false,
            error: false,
            helperText: '',
          },
        },
      },
    })
  })

  test('updateValue for field updates value on current', () => {
    const action = actions.updateValue('parent.nested', 'new value')
    expect(fieldReducer(state, action)).toMatchSnapshot()
  })

})

describe('list in state', () => {
  let listItemFieldName
  beforeEach(() => {
    listItemFieldName = `data.listField.items.1.fields.${fieldName}`
    state = fromJS({
      fields: {
        'data.listField': {
          items: [
            {},
            {
              fields: {
                [fieldName]: {
                  initial: {
                    value: '',
                  },
                  current: {
                    value: '',
                    pristine: true,
                    touched: false,
                    error: false,
                    helperText: '',
                  },
                },
              },
            },
          ],
        },
        otherField: {
          initial: {
            value: '',
          },
          current: {
            value: '',
            pristine: true,
            touched: false,
            error: false,
            helperText: '',
          },
        },
      },
    })
  })

  test('updateValue for field updates value on current', () => {
    const action = actions.updateValue(listItemFieldName, 'new value')
    expect(fieldReducer(state, action)).toMatchSnapshot()
  })

  test('touched set on current field', () => {
    const action = actions.touched(listItemFieldName)
    expect(fieldReducer(state, action)).toMatchSnapshot()
  })

  test('addListItem', () => {
    const fieldState = fromJS({
      fields: {
        [fieldName]: {
          initial: {
            type: 'text',
            value: '',
            optional: false,
            label: 'First',
            field: {
              label: 'First',
              name: 'data.listField.items.0.fields.fieldName',
            },
          },
          current: {
            helperText: '',
            error: false,
            pristine: true,
            touched: false,
            value: '',
          },
        },
      },
    })
    const action = actions.addListItem('data.listField', fieldState)
    expect(fieldReducer(state, action)).toMatchSnapshot()
  })

  test('removeListItem', () => {
    const action = actions.removeListItem('data.listField', 1)
    expect(fieldReducer(state, action)).toMatchSnapshot()
    expect(syncListIndexes.mock.calls[0]).toMatchSnapshot()
  })

  test('updateListIndex', () => {
    const action = actions.updateListIndex('data.listField', 0, 1)
    expect(fieldReducer(state, action)).toMatchSnapshot()
    expect(syncListIndexes.mock.calls[0]).toMatchSnapshot()
  })

})

describe('getFieldPath', () => {
  test('single name', () => {
    expect(getFieldPath('name')).toEqual(['name'])
  })

  test('combined name', () => {
    expect(getFieldPath('data.name')).toEqual(['data.name'])
  })

  test('single name with items', () => {
    expect(getFieldPath('listField.items.1.fields.fieldName')).toMatchSnapshot()
  })

  test('single name with items using combined name', () => {
    expect(getFieldPath('listField.items.1.fields.fieldName.sub1')).toMatchSnapshot()
  })

  test('combined name with items', () => {
    expect(getFieldPath('data.listField.items.1.fields.fieldName')).toMatchSnapshot()
  })

  test('list with combined names', () => {
    expect(getFieldPath('data.listField.items.0.fields.field1.sub1')).toMatchSnapshot()
  })

  test('list with more than 10 items', () => {
    expect(getFieldPath('data.listField.items.11.fields.field1.sub1')).toMatchSnapshot()
  })

  test('list of lists with single names', () => {
    expect(getFieldPath('data.listField.items.0.fields.field1.items.0.fields.field2')).toMatchSnapshot()
  })

  test('list of list with complex names', () => {
    expect(getFieldPath('data.listField.items.0.fields.field1.sub1.items.0.fields.field2.sub2')).toMatchSnapshot()
  })

  test('list of list with complex names longer than 10 items', () => {
    expect(getFieldPath('data.listField.items.11.fields.field1.sub1.items.11.fields.field2.sub2')).toMatchSnapshot()
  })
})

describe('fieldListener', () => {
  const listener = jest.fn()
  const listener2 = jest.fn()

  test('addListener sets listener into reducer', () => {
    const action = actions.addListener('name', listener)
    expect(fieldReducer(state, action)).toMatchSnapshot()
  })

  test('add multiple listeners', () => {
    const action = actions.addListener('name', listener)
    const action2 = actions.addListener('name', listener2)
    state = fieldReducer(state, action)
    state = fieldReducer(state, action2)

    expect(state).toMatchSnapshot()
  })

  test('listeners called when field value changes', () => {
    const previousValue = 'previousValue'
    state = state.setIn(['fields', fieldName, 'current', 'value'], previousValue)
    const update = 'i am update'
    const action = actions.addListener(fieldName, listener)
    const action2 = actions.addListener(fieldName, listener2)
    const changeAction = actions.updateValue(fieldName, update)

    state = fieldReducer(state, action)
    state = fieldReducer(state, action2)
    fieldReducer(state, changeAction)

    expect(listener).toHaveBeenCalledWith(update, previousValue, formTools.current)
    expect(listener2).toHaveBeenCalledWith(update, previousValue, formTools.current)
  })

  test('listeners called for nested field value changes', () => {
    const previousValue = 'previousValue'
    state = state.setIn(['fields', 'data', 'items', '0', 'fields', 'field', 'current', 'value'], previousValue)
    const update = 'i am update'
    const action = actions.addListener('data.field', listener)
    const changeAction = actions.updateValue('data.items.0.fields.field', update)

    state = fieldReducer(state, action)
    fieldReducer(state, changeAction)

    expect(listener).toHaveBeenCalledWith(update, previousValue, formTools.current)
  })

  test('listener not called for other fields', () => {
    const action = actions.addListener('name', listener)
    const changeAction = actions.updateValue('other', 'i am update')

    state = fieldReducer(state, action)
    state = fieldReducer(state, changeAction)

    expect(listener).not.toHaveBeenCalled()
  })

  test('removeListener removes by reference', () => {
    const previousValue = 'previousValue'
    state = state.setIn(['fields', fieldName, 'current', 'value'], previousValue)


    const update = 'i am update'
    const action = actions.addListener(fieldName, listener)
    const action2 = actions.addListener(fieldName, listener2)
    const removeAction = actions.removeListener(fieldName, listener)
    const changeAction = actions.updateValue(fieldName, update)

    state = fieldReducer(state, action)
    state = fieldReducer(state, action2)
    state = fieldReducer(state, removeAction)
    fieldReducer(state, changeAction)

    expect(state).toMatchSnapshot()
    expect(listener2).toHaveBeenCalledWith(update, previousValue, formTools.current)
    expect(listener).not.toHaveBeenCalled()
  })

})

test('validateAll merges validation errors', () => {
  const errors = {
    [fieldName]: 'error 1',
    otherField: 'error 2',
  }
  const action = actions.validateAll(errors)

  expect(fieldReducer(state, action)).toMatchSnapshot()
})

describe('onFormChange', () => {
  it('is called when present and a function', () => {
    const onFormChange = jest.fn()
    const action = actions.updateValue(fieldName, 'new value')
    const testState = state.set('onFormChange', onFormChange)
    fieldReducer(testState, action)
    expect(onFormChange).toHaveBeenCalledTimes(1)
    expect(onFormChange.mock.calls[0]).toMatchSnapshot()
  })
})

describe('updateFieldDefinition', ()=> {
  beforeEach(()=> {
    state = state.setIn(['fields', fieldName, 'initial', 'field'], {label: 'the-label'})
  })

  it('updateFieldDefinition updates optional', () => {
    const action = actions.updateFieldDefinition(fieldName, { definition: { name: fieldName, optional: true }, options: {} })
    expect(fieldReducer(state, action)).toMatchSnapshot()
  })

  it('updateFieldDefinition updates label', () => {
    const action = actions.updateFieldDefinition(fieldName, { definition: { name: fieldName, label: 'new-label' }, options: {} })
    expect(fieldReducer(state, action)).toMatchSnapshot()
  })

  it('updateFieldDefinition updates optional && label', () => {
    const action = actions.updateFieldDefinition(fieldName, { definition: { name: fieldName, optional: true, label: 'new-label' }, options: {} })
    expect(fieldReducer(state, action)).toMatchSnapshot()
  })

  it('updateFieldDefinition updates optional && label using formatter', () => {
    const action = actions.updateFieldDefinition(fieldName, { definition: { name: fieldName, optional: true, label: 'new-label' }, options: {optionalLabelFormatter: l=> `${l}***`} })
    expect(fieldReducer(state, action)).toMatchSnapshot()
  })

})
