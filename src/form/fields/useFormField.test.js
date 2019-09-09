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

  test('uses valueFromChange to coerce value if provided', () => {
    const valueFromChange = jest.fn()
    valueFromChange.mockReturnValue('updatedFromTarget')
    const { props: { onChange } } = useFormField(state, dispatch, { ...initialArgs, valueFromChange })
    onChange(event)

    expect(dispatch.mock.calls[0]).toMatchSnapshot()
    expect(valueFromChange).toHaveBeenCalledWith(event)
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

  test('does not dispatch validation result until "touched"', () => {
    initialArgs.validate = jest.fn()
    initialArgs.validate.mockReturnValue('new error')
    state = state.setIn(['current', 'helperText'], 'error exists')

    const { props: { onChange } } = useFormField(state, dispatch, initialArgs)
    onChange(event)

    expect(dispatch.mock.calls).toMatchSnapshot()
  })

  test('clears result event if not touched yet', () => {
    initialArgs.validate = jest.fn()
    initialArgs.validate.mockReturnValue('')
    state = state.setIn(['current', 'helperText'], 'error exists')

    const { props: { onChange } } = useFormField(state, dispatch, initialArgs)
    onChange(event)

    expect(dispatch.mock.calls).toMatchSnapshot()
    expect(dispatch).toHaveBeenCalledTimes(2)
  })

  test('dispatches validation result if "touched"', () => {
    state = state.setIn(['current', 'touched'], true)
    initialArgs.validate = jest.fn()
    const { props: { onChange } } = useFormField(state, dispatch, initialArgs)
    onChange(event)

    expect(dispatch.mock.calls).toMatchSnapshot()
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

  test('calls validate on number change with 0 (falsy)', () => {
    initialArgs.normalize = v => Number(v)
    event.target.value = '0'
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

  test('validate prepares name for reading', () => {
    initialArgs = { ...initialArgs, name: 'colors.items.1.fields.shades.items.0.fields.shade', validate }
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

    initialArgs.validate = jest.fn()
    const { props: { onChange } } = useFormField(state, dispatch, initialArgs)
    onChange(event)

    expect(initialArgs.validate.mock.calls[0]).toMatchSnapshot()
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

