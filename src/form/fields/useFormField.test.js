import { fromJS } from 'immutable'
import { useFormField } from './useFormField'
import { actionTypes } from '../reducer/fieldReducer'

jest.mock('react')

const dispatch = jest.fn()
let value, initialArgs, state
beforeEach(() => {
  value = 'the value'
  initialArgs = {
    name: 'fieldName',
    optional: false,
    error: 'on',
    helperText: 'the help',
    label: 'the label',
  }

  state = fromJS({
    initial: {
      label: initialArgs.label,
      type: 'text',
      value,
      optional: false,
    },
    current: {
      value,
      error: false,
      pristine: true,
      touched: false,
      helperText: initialArgs.helperText,
    },
    getAllValues: 'getAllValuesFunc',
  })
})

test('returns all props needed', () => {
  expect(useFormField(state, dispatch, initialArgs)).toMatchSnapshot()
})

describe('onChange', () => {
  let event
  beforeEach(() => {
    event = {
      target: {
        value: 'updated',
      },
    }
  })

  test('dispatches change action', () => {
    const { props: { onChange } } = useFormField(state, dispatch, initialArgs)
    onChange(event)

    expect(dispatch.mock.calls[0]).toMatchSnapshot()
  })

  test('uses valueFromTarget to coerce value if provided', () => {
    const valueFromTarget = jest.fn()
    valueFromTarget.mockReturnValue('updatedFromTarget')
    const { props: { onChange } } = useFormField(state, dispatch, { ...initialArgs, valueFromTarget })
    onChange(event)

    expect(dispatch.mock.calls[0]).toMatchSnapshot()
    expect(valueFromTarget).toHaveBeenCalledWith(event.target)
  })

  test('coerces value using normalize', () => {
    const normalize = jest.fn()
    normalize.mockReturnValue('normalized value')
    const { props: { onChange } } = useFormField(state, dispatch, { ...initialArgs, normalize })
    onChange(event)

    expect(dispatch.mock.calls[0]).toMatchSnapshot()
    expect(normalize).toHaveBeenCalledWith(event.target.value)
  })

  test('validates on change', () => {
    initialArgs.validate = jest.fn()
    const { props: { onChange } } = useFormField(state, dispatch, initialArgs)
    onChange(event)

    expect(initialArgs.validate.mock.calls[0]).toMatchSnapshot()
  })
})

describe('validate', () => {
  const validate = jest.fn()
  let event
  beforeEach(() => {
    initialArgs = { ...initialArgs, validate }
    event = {
      target: {
        value: '1',
      },
    }
    state = fromJS({
      current: {
        value,
        error: false,
        pristine: false,
        touched: true,
        helperText: initialArgs.helperText,
      },
      getAllValues: 'getAllValuesFunc',
    })
  })

  test('calls validate on change', () => {
    const { props: { onChange } } = useFormField(state, dispatch, initialArgs)
    onChange(event)

    expect(validate.mock.calls[0]).toMatchSnapshot()
  })

  test('does not set error if not "touched"', () => {
    state = fromJS({
      current: {
        value,
        error: false,
        pristine: false,
        touched: false,
        helperText: initialArgs.helperText,
      },
    })
    validate.mockReturnValue('Error here')

    const { props: { onChange } } = useFormField(state, dispatch, initialArgs)
    onChange(event)

    expect(dispatch).not.toHaveBeenCalledWith({
      type: actionTypes.validationResult,
      payload: {
        error: true,
        helperText: expect.any(String),
      },
    })

  })

  test('sets validation result if "touched"', () => {
    validate.mockReturnValue('Error here')

    const { props: { onChange } } = useFormField(state, dispatch, initialArgs)
    onChange(event)

    expect(dispatch).toHaveBeenCalledWith({
      type: actionTypes.validationResult,
      fieldName: 'fieldName',
      payload: {
        error: true,
        helperText: expect.any(String),
      },
    })

  })

  test('validates onBlur', () => {
    validate.mockReturnValue('Error here')

    const { props: { onBlur } } = useFormField(state, dispatch, initialArgs)
    onBlur()

    expect(validate.mock.calls[0]).toMatchSnapshot()
  })

  test('sets required if empty on blur', () => {
    state = fromJS({
      current: {
        value: '',
        error: false,
        pristine: false,
        touched: true,
        helperText: initialArgs.helperText,
      },
    })

    const { props: { onBlur } } = useFormField(state, dispatch, initialArgs)
    onBlur()

    expect(dispatch).toHaveBeenCalledWith({
      type: actionTypes.validationResult,
      fieldName: 'fieldName',
      payload: {
        error: true,
        helperText: expect.any(String),
      },
    })
  })

  test('validate directly', () => {
    state = fromJS({
      current: {
        value: '',
        error: false,
        pristine: false,
        touched: false,
        helperText: initialArgs.helperText,
      },
    })

    const actual = useFormField(state, dispatch, initialArgs)

    const isValid = actual.validate()

    expect(dispatch).toHaveBeenCalledWith({
      type: actionTypes.validationResult,
      fieldName: 'fieldName',
      payload: {
        error: true,
        helperText: 'Required',
      },
    })
    expect(isValid).toBeFalsy()
  })

  test('validate directly returns true if valid', () => {
    validate.mockReturnValue('')
    const actual = useFormField(state, dispatch, initialArgs)

    const isValid = actual.validate()

    expect(isValid).toBeTruthy()
  })

})

test('setValidationResult externally', () => {
  const { setValidationResult } = useFormField(state, dispatch, initialArgs)

  setValidationResult('i am error')
  expect(dispatch).toHaveBeenCalledWith({
    type: actionTypes.validationResult,
    fieldName: 'fieldName',
    payload: {
      error: true,
      helperText: 'i am error',
    },
  })
})

test('sets touched onBlur', () => {
  const { props: { onBlur } } = useFormField(state, dispatch, initialArgs)
  onBlur()

  expect(dispatch).toHaveBeenCalledWith({
    fieldName: 'fieldName',
    type: actionTypes.touched,
  })
})

test('setValue sets value externally', () => {
  const { setValue } = useFormField(state, dispatch, initialArgs)

  setValue('i am value')
  expect(dispatch).toHaveBeenCalledWith({
    type: actionTypes.updateValue,
    fieldName: 'fieldName',
    payload: 'i am value',
  })
})

