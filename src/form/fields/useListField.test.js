import { fromJS } from 'immutable'
import { useListField } from './useListField'
import { generateDefaultListState, getFields } from '../reducer/generateDefaultListState'

jest.mock('../reducer/generateDefaultListState')

const dispatch = jest.fn()
let state, fieldArgs
beforeEach(() => {
  fieldArgs = {
    name: 'fieldName',
    type: 'list',
    fields: [
      { name: 'first', label: 'First' },
    ],
  }

  state = fromJS({
    initial: {
      label: 'the label',
      type: 'list',
    },
    current: {
      error: false,
      helperText: 'help me',
    },
    items: [
      {
        fields: {
          first: {
            initial: {
              type: 'text',
              label: 'First',
              field: 'initialFirstField',
            },
            current: {
              error: 'false',
              helperText: '',
              value: '1',
            },
          },
          second: {
            initial: {
              type: 'text',
              label: 'Second',
              field: 'initialSecondField',
            },
            current: {
              error: 'false',
              helperText: '',
              value: '2',
            },
          },
        },
      },
    ],
  }).setIn(['initial', 'options'], {})
    .setIn(['initial', 'field'], fieldArgs)

  getFields.mockReturnValue('fields gotten')
})

test('returns props needed', () => {
  expect(useListField(state, dispatch, fieldArgs)).toMatchSnapshot()
})

test('add', () => {
  const { props } = useListField(state, dispatch, fieldArgs)
  props.add()

  expect(getFields.mock.calls[0]).toMatchSnapshot()
  expect(dispatch.mock.calls[0]).toMatchSnapshot()
})

test('add with values', () => {
  const { props } = useListField(state, dispatch, fieldArgs)
  props.add(fromJS({ first: '111' }))
  expect(getFields.mock.calls[0]).toMatchSnapshot()
  expect(dispatch.mock.calls[0]).toMatchSnapshot()
})

test('add will trigger validation', () => {
  const validate = jest.fn()
  validate.mockReturnValue('i am error')
  state = state.set('getAllValues', 'getAllValuesFunc')

  const { props } = useListField(state, dispatch, { ...fieldArgs, validate, name: 'colors.items.1.fields.shades.items.0.fields.shade' })
  props.add()
  expect(dispatch.mock.calls[1]).toMatchSnapshot()
  expect(validate.mock.calls[0]).toMatchSnapshot()
})

test('add will trigger custom validation', () => {
  const custom = jest.fn()
  custom.mockReturnValue('i am error')

  const { props } = useListField(state, dispatch, { ...fieldArgs, validate: custom })
  props.add()
  expect(dispatch.mock.calls[1]).toMatchSnapshot()
})

test('can handle list arrays that have no data', () => {
  const testState = state.deleteIn(['items'])
  expect(() => useListField(testState, dispatch, fieldArgs)).not.toThrowError()
})

test('remove', () => {
  const { props } = useListField(state, dispatch, fieldArgs)
  props.remove(1)
  expect(dispatch.mock.calls[0]).toMatchSnapshot()
})

test('remove will trigger validation', () => {
  const { props } = useListField(state, dispatch, fieldArgs)
  props.remove(1)
  expect(dispatch.mock.calls[1]).toMatchSnapshot()
})

test('remove will trigger custom validation', () => {
  const custom = jest.fn()
  custom.mockReturnValue('i am error')

  const { props } = useListField(state, dispatch, { ...fieldArgs, validate: custom })
  props.remove(1)
  expect(dispatch.mock.calls[1]).toMatchSnapshot()
})

it('updateIndex will dispatch action', () => {
  const { props } = useListField(state, dispatch, fieldArgs)
  props.updateIndex(0, 4)
  expect(dispatch.mock.calls[0]).toMatchSnapshot()
})

it('setValue will set list items', () => {
  fieldArgs.name = 'data.nested'
  generateDefaultListState.mockReturnValue(fromJS({items: [{value: 'item1'}, {value: 'item2'}]}))
  const { setValue } = useListField(state, dispatch, fieldArgs)

  setValue(fromJS(['item1', 'item2']))

  expect(generateDefaultListState.mock.calls[0]).toMatchSnapshot()
  expect(dispatch.mock.calls[0]).toMatchSnapshot()
  expect(dispatch.mock.calls[1]).toMatchSnapshot()
})
