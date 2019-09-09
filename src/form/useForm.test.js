import { useCallback, useRef } from 'react'
import { fromJS } from 'immutable'
import { useForm } from './useForm'
import { useFormField } from './fields/useFormField'
import { createReducer } from './reducer/createReducer'
import { mergeFormValues } from './helpers/mergeFormValues'
import { getInitialState } from './reducer/getInitialState'
import { getFieldState } from './reducer/getFieldState'
import { getHasError } from './validate/getHasError'
import { validateAll } from './validate/validateAll'

jest.mock('react')
jest.mock('./fields/useFormField')
jest.mock('./reducer/createReducer')
jest.mock('./helpers/mergeFormValues')
jest.mock('./reducer/getInitialState')
jest.mock('./reducer/getFieldState')
jest.mock('./validate/getHasError')
jest.mock('./validate/validateAll')


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

let fields, fieldProps, initialValues, formRef

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

  formRef = {
    current: undefined,
  }

  fieldProps.validate.mockReturnValue('')

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
  useRef.mockReturnValue(formRef)
  validateAll.mockReturnValue({ obj: 'containing errors' })
})

test('returns array of form props', () => {
  const actual = useForm({ fields })
  expect(actual).toMatchSnapshot()
})

test('no submit if validation fails', () => {
  getHasError.mockReturnValue(true)
  const validateForm = jest.fn()
  validateForm.mockReturnValue({ name: 'i am error' })
  const [, { submit }] = useForm({ fields, submit: submitWorker, validate: validateForm })

  submit()

  expect(validateAll.mock.calls[0]).toMatchSnapshot()
  expect(getHasError.mock.calls[0]).toMatchSnapshot()
  expect(dispatch.mock.calls[0]).toMatchSnapshot()
  expect(submitWorker).not.toHaveBeenCalled()
})

test('submit with skipValidation submits all values', () => {
  const validateForm = jest.fn()
  const [, { submit }] = useForm({ fields, submit: submitWorker, validate: validateForm })

  submit(true)

  expect(dispatch).not.toHaveBeenCalled()
  expect(validateForm).not.toHaveBeenCalled()
  expect(submitWorker).toHaveBeenCalled()
})

test('submit with skipValidation must be a boolean', () => {
  getHasError.mockReturnValue(true)
  const validateForm = 'i validate forms'

  const [, { submit }] = useForm({ fields, submit: submitWorker, validate: validateForm })
  submit('I am truthy')
  expect(validateAll.mock.calls[0]).toMatchSnapshot()
  expect(submitWorker).not.toHaveBeenCalled()
})

test('form.validate returns all errors', () => {
  const validateForm = ['i validate forms', 'as do i']

  const [, { validate }] = useForm({ fields, submit: submitWorker, validate: validateForm })
  const errors = validate()

  expect(errors).toMatchSnapshot()
  expect(validateAll.mock.calls[0]).toMatchSnapshot()
  expect(submitWorker).not.toHaveBeenCalled()
  expect(dispatch.mock.calls[0]).toMatchSnapshot()
})

test('validate can be an array of validators', () => {
  getHasError.mockReturnValue(true)
  const validate1 = 'i validate forms'
  const validate2 = 'as do i'

  const [, { submit }] = useForm({ fields, submit: submitWorker, validate: [validate1, validate2] })

  submit()
  expect(validateAll.mock.calls[0]).toMatchSnapshot()
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
  expect(dispatch.mock.calls[0]).toMatchSnapshot()
})

test('getValuesIfFormValid returns null if not valid', () => {
  getHasError.mockReturnValue(true)
  const validateForm = 'i validate forms'
  const [, { getValuesIfFormValid }] = useForm({ fields, submit: submitWorker, validate: validateForm })

  const values = getValuesIfFormValid()

  expect(validateAll.mock.calls[0]).toMatchSnapshot()
  expect(getHasError.mock.calls[0]).toMatchSnapshot()
  expect(values).toBeNull()
})

test('getValuesIfFormValid returns values if form is valid ', () => {
  getHasError.mockReturnValue(false)

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

test('addField', () => {
  getFieldState.mockReturnValue('i am a new field')
  const [, { addField }] = useForm({ fields, initialValues })

  addField({ name: 'newField', type: 'list' })
  expect(getFieldState.mock.calls[0]).toMatchSnapshot()
  expect(dispatch.mock.calls[0]).toMatchSnapshot()
})
