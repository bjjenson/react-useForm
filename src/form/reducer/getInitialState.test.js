import { fromJS } from 'immutable'
import { getInitialState } from './getInitialState'

jest.mock('react')
jest.useFakeTimers()

let fields, initialValues, formTools, options
beforeEach(() => {
  formTools = 'form-tools'
  options = { op: 'tion' }
  fields = [
    { name: 'first', label: 'First' },
    { name: 'second', label: 'Second', type: 'boolean' },
  ]
  initialValues = fromJS({
    first: 'firstValue',
    second: 'secondValue',
  })

})

test('prepares initialState by field', () => {
  expect(getInitialState(fields, initialValues, undefined, formTools)).toMatchSnapshot()
})

test('throws error if name not provided', () => {
  fields.push({ label: 'Third' })
  expect(() => getInitialState(fields, initialValues, options, formTools)).toThrowErrorMatchingSnapshot()
})

test('adds helperText from field config', () => {
  fields[0].helperText = 'i am helper'
  expect(getInitialState(fields, initialValues, options, formTools)).toMatchSnapshot()
})

test('sets optional on field', () => {
  fields[0].optional = true
  expect(getInitialState(fields, initialValues, options, formTools)).toMatchSnapshot()
})

test('sets optional on field using custom formatter', () => {
  const optionalLabelFormatter = jest.fn()
  optionalLabelFormatter.mockReturnValue('label formatted')
  fields[0].optional = true
  expect(getInitialState(fields, initialValues, { optionalLabelFormatter }, formTools)).toMatchSnapshot()

  expect(optionalLabelFormatter.mock.calls[0]).toMatchSnapshot()
})

test('reads initialValues that are nested', () => {
  fields = [
    { name: 'nested.first', label: 'First' },
  ]
  initialValues = fromJS({
    nested: {
      first: 'nestedValue',
    },
  })
  expect(getInitialState(fields, initialValues, options, formTools)).toMatchSnapshot()
})

describe('initialValues', () => {
  test('field.value should used if set', () => {
    fields = [
      { name: 'first', type: 'text', value: 'i am field value' },
    ]
    expect(getInitialState(fields, undefined, undefined, formTools)).toMatchSnapshot()
  })

  test('text', () => {
    fields = [
      { name: 'first', type: 'text' },
    ]
    expect(getInitialState(fields, undefined, undefined, formTools)).toMatchSnapshot()
  })

  test('select', () => {
    fields = [
      { name: 'first', type: 'select' },
    ]
    expect(getInitialState(fields, undefined, undefined, formTools)).toMatchSnapshot()
  })

  test('number', () => {
    fields = [
      { name: 'first', type: 'number' },
    ]
    expect(getInitialState(fields, undefined, undefined, formTools)).toMatchSnapshot()
  })

  test('boolean', () => {
    fields = [
      { name: 'first', type: 'boolean' },
    ]
    expect(getInitialState(fields, undefined, undefined, formTools)).toMatchSnapshot()
  })

  test('list', () => {
    fields = [
      { name: 'first', type: 'list' },
    ]
    expect(getInitialState(fields, undefined, undefined, formTools)).toMatchSnapshot()
  })
})

test('adds field listeners', () => {
  const firstListener = jest.fn()
  const secondListenerA = jest.fn()
  const secondListenerB = jest.fn()
  const options = {
    listeners: {
      first: firstListener,
      second: [secondListenerA, secondListenerB],
    },
  }

  expect(getInitialState(fields, initialValues, options, formTools)).toMatchSnapshot()
})

test('adds onFormChange when present', () => {
  options.onFormChange = 'on-form-change'
  expect(getInitialState(fields, initialValues, options, formTools)).toMatchSnapshot()
})
