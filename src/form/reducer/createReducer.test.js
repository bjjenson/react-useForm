import { fromJS } from 'immutable'
import { useReducer, useMemo, useRef } from 'react'
import { createReducer } from './createReducer'
import { fieldsKey } from './fieldReducer'
import { getInitialState } from './getInitialState'

jest.mock('react')
jest.mock('./getInitialState')
jest.useFakeTimers()

let state, fields, initialValues, options, dispatch, formTools, hashCodeRef
beforeEach(() => {
  formTools = { current: 'formTools' }
  dispatch = 'dispatch'
  state = fromJS({
    [fieldsKey]: {
      first: {
        initial: {
          label: 'First',
        },
      },
    },
  })
  fields = [
    { name: 'first', label: 'First' },
    { name: 'second', label: 'Second', type: 'boolean' },
  ]
  initialValues = fromJS({
    first: 'firstValue',
    second: 'secondValue',
  })
  hashCodeRef = {
    current: undefined,
  }

  useRef.mockReturnValue(hashCodeRef)
  useReducer.mockReturnValue([state, dispatch])
  getInitialState.mockReturnValue('initial-state')
})

test('prepares initialState by field', () => {
  expect(createReducer({ fields, initialValues, options, formTools })).toMatchSnapshot()
  useReducer.mock.calls[0][2]()
  expect(getInitialState.mock.calls[0]).toMatchSnapshot()
  expect(useReducer.mock.calls[0]).toMatchSnapshot()
})

test('uses memo to check for initialValues change', () => {
  createReducer({ fields, initialValues, formTools })
  expect(useMemo.mock.calls[0]).toMatchSnapshot()
})

test('no reset dispatched on first load', () => {
  options = {
    initialized: jest.fn(),
  }
  formTools.current = {
    addField: 'addField',
  }

  dispatch = jest.fn()
  useMemo.mockImplementation((memoized) =>memoized())
  useReducer.mockReturnValue([state, dispatch])
  setTimeout.mockImplementation(cb => cb())

  createReducer({ fields, initialValues, options, formTools })

  expect(dispatch).not.toHaveBeenCalled()
  expect(options.initialized.mock.calls[0]).toMatchSnapshot()
})

test('useMemo dispatches reset if initialValues has changed from default', () => {
  options = {
    initialized: jest.fn(),
  }
  formTools.current = {
    addField: 'addField',
  }
  let
  dispatch = jest.fn()
  useReducer.mockReturnValue([state, dispatch])
  useRef.mockReturnValue({ current: 'something' })

  useMemo.mockImplementation((memoized) => memoized())
  setTimeout.mockImplementation(cb => cb())

  createReducer({ fields, initialValues, options, formTools })

  expect(setTimeout).toHaveBeenCalled()
  expect(dispatch.mock.calls[0]).toMatchSnapshot()
  expect(options.initialized.mock.calls[0]).toMatchSnapshot()
})
