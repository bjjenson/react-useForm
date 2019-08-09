import { fromJS } from 'immutable'
import { useReducer, useMemo } from 'react'
import { createReducer } from './createReducer'
import { fieldsKey } from './fieldReducer'
import { getInitialState } from './getInitialState'

jest.mock('react')
jest.mock('./getInitialState')
jest.useFakeTimers()

let state, fields, initialValues, dispatch
beforeEach(() => {
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

  useReducer.mockReturnValue([state, dispatch])
  getInitialState.mockReturnValue('initial-state')
})

test('prepares initialState by field', () => {
  expect(createReducer({ fields, initialValues })).toMatchSnapshot()
  useReducer.mock.calls[0][2]()
  expect(getInitialState.mock.calls[0]).toMatchSnapshot()
  expect(useReducer.mock.calls[0]).toMatchSnapshot()
})

test('uses memo to check for initialValues change', () => {
  createReducer({ fields, initialValues })
  expect(useMemo.mock.calls[0]).toMatchSnapshot()
})

test('useMemo update dispatches reset', () => {
  let memoized
  dispatch = jest.fn()
  let timeoutCB
  useMemo.mockImplementation((f) => {
    memoized = f
  })
  useReducer.mockReturnValue([state, dispatch])
  setTimeout.mockImplementation(cb => {
    timeoutCB = cb
  })

  createReducer({ fields, initialValues })
  memoized()
  timeoutCB()

  expect(setTimeout).toHaveBeenCalled()
  expect(dispatch.mock.calls[0]).toMatchSnapshot()
})
