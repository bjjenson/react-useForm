import { fromJS } from 'immutable'
import { fieldReducer, actions, fieldsKey, removedFieldsKey } from './fieldReducer'

let state, fieldName
beforeEach(() => {
  fieldName = 'field-name'
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
