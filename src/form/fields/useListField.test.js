import { fromJS } from 'immutable'
import { useListField } from './useListField'

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

})

test('returns props needed', () => {
  expect(useListField(state, dispatch, fieldArgs)).toMatchSnapshot()
})

test('add', () => {
  const { props } = useListField(state, dispatch, fieldArgs)
  props.add()
  expect(dispatch.mock.calls[0]).toMatchSnapshot()
})

test('add with values', () => {
  const { props } = useListField(state, dispatch, fieldArgs)
  props.add(fromJS({ first: '111' }))
  expect(dispatch.mock.calls[0]).toMatchSnapshot()
})

test('add will trigger validation', () => {
  const { props } = useListField(state, dispatch, fieldArgs)
  props.add()
  expect(dispatch.mock.calls[1]).toMatchSnapshot()
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
