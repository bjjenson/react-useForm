import { useCallback } from 'react'
import { fromJS } from 'immutable'
import { useForm } from './useForm'
import { useFormField } from './fields/useFormField'
import { createReducer } from './reducer/createReducer'
import { mergeFormValues } from './helpers/mergeFormValues'
import { getInitialState } from './reducer/getInitialState'

jest.mock('react')
jest.mock('./fields/useFormField')
jest.mock('./reducer/createReducer')
jest.mock('./helpers/mergeFormValues')
jest.mock('./reducer/getInitialState')

const submitWorker = jest.fn()
const dispatch = jest.fn()

const createState = fields => fromJS(fields.reduce((acc, field) => {
  acc.fields[field.name] = {
    initial: {
      type: field.type,
      label: field.label,
    },
    current: {
      value: `current value of ${field.name}`,
    },
  }
  return acc
}, { fields: {} }))

let fields, fieldProps, initialValues

beforeEach(() => {
  fields = [
    { name: 'name', type: 'text', label: 'The name' },
    { name: 'phone', type: 'text', label: 'The phone' },
  ]
  fieldProps = {
    validate: jest.fn(),
    setValidationResult: jest.fn(),
    setValue: jest.fn(),
  }
  initialValues = fromJS({
    nested: {
      name: 'old name',
    },
    id: 'id',
  })

  fieldProps.validate.mockReturnValue(true)

  useFormField.mockImplementation((state) => ({
    ...fieldProps,
    props: {
      label: state.getIn(['initial', 'label']),
      value: state.getIn(['current', 'value']),
    },
  }))
  createReducer.mockImplementation(({ fields }) => [createState(fields), dispatch])
  mergeFormValues.mockReturnValue('merged form values')
  getInitialState.mockReturnValue('derived-initial-state')
  useCallback.mockImplementation(f => f)
})

test('returns array of form props', () => {
  const actual = useForm({ fields })
  expect(actual).toMatchSnapshot()
})

test('no submit if field validation fails', () => {
  fieldProps.validate.mockReturnValue(false)

  const [, { submit }] = useForm({ fields, submit: submitWorker })
  submit()
  expect(submitWorker).not.toHaveBeenCalled()
})

test('no submit if form validation fails', () => {
  const validateForm = jest.fn()
  validateForm.mockReturnValue({ name: 'i am error' })
  const [, { submit }] = useForm({ fields, worker: submitWorker, validate: validateForm })
  submit()
  expect(validateForm.mock.calls[0]).toMatchSnapshot()
  expect(submitWorker).not.toHaveBeenCalled()
})

test('validate can be an array of validators', () => {
  const validate1 = jest.fn()
  const validate2 = jest.fn()
  validate1.mockReturnValue({ name: 'i am name error' })
  validate2.mockReturnValue({ phone: 'i am phone error' })
  const values = { 'name': 'current value of name', 'phone': 'current value of phone' }

  const [, { submit }] = useForm({ fields, worker: submitWorker, validate: [validate1, validate2] })

  submit()
  expect(validate1).toHaveBeenCalledWith(values)
  expect(validate2).toHaveBeenCalledWith(values)
  expect(submitWorker).not.toHaveBeenCalled()
})

test('valid form submits values ', () => {
  fields = [
    { name: 'nested.name' },
    { name: 'phone' },
  ]

  const [, { submit }] = useForm({ fields, submit: submitWorker, initialValues })

  submit()
  expect(submitWorker.mock.calls[0]).toMatchSnapshot()
  expect(mergeFormValues.mock.calls[0]).toMatchSnapshot()
})

test('getValuesIfFormValid returns null if not valid', () => {
  const validateForm = jest.fn()
  validateForm.mockReturnValue({ name: 'i am error' })
  const [, { getValuesIfFormValid }] = useForm({ fields, worker: submitWorker, validate: validateForm })

  const values = getValuesIfFormValid()

  expect(validateForm.mock.calls[0]).toMatchSnapshot()
  expect(values).toBeNull()
})

test('getValuesIfFormValid returns values if form is valid ', () => {
  fields = [
    { name: 'nested.name' },
    { name: 'phone' },
  ]

  const [, { getValuesIfFormValid }] = useForm({ fields, submit: submitWorker, initialValues })

  const values = getValuesIfFormValid()

  expect(values).toMatchSnapshot()
})

test('options passed to createReducer', () => {
  const options = {
    optional: 'yes',
  }
  useForm({ fields, submit: submitWorker, options })

  expect(createReducer.mock.calls[0]).toMatchSnapshot()
})

test('reset dispatches action with derived initial state', () => {
  const [, { reset }] = useForm({ fields, initialValues })

  reset()
  expect(getInitialState.mock.calls[0]).toMatchSnapshot()
  expect(dispatch.mock.calls[0]).toMatchSnapshot()
})


test('addFieldListener dispatches action', () => {
  const [, { addFieldListener }] = useForm({ fields, initialValues })
  const listener = 'myListener'
  addFieldListener('formField', listener)

  expect(dispatch.mock.calls[0]).toMatchSnapshot()
})

test('removeFieldListener dispatches action', () => {
  const [, { removeFieldListener }] = useForm({ fields, initialValues })
  const listener = 'myListener'
  removeFieldListener('formField', listener)

  expect(dispatch.mock.calls[0]).toMatchSnapshot()
})
