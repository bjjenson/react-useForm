import { fromJS } from 'immutable'
import { useForm } from './useForm'
import { useFormField } from './fields/useFormField'
import { createReducer } from './reducer/createReducer'
import { removedFieldsKey } from './reducer/fieldReducer'

jest.mock('react')
jest.mock('./fields/useFormField')
jest.mock('./reducer/createReducer')

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

let fields, fieldProps
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

  fieldProps.validate.mockReturnValue(true)

  useFormField.mockImplementation((state) => ({
    ...fieldProps,
    props: {
      label: state.getIn(['initial', 'label']),
      value: state.getIn(['current', 'value']),
    },
  }))
  createReducer.mockImplementation(({ fields }) => [createState(fields), dispatch])
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

test('submit calls worker, merges with initialValues', () => {
  useFormField.mockReturnValueOnce({ ...fieldProps, props: { value: 'new name' } })
  useFormField.mockReturnValueOnce({ ...fieldProps, props: { value: 'new phone' } })
  fields = [
    { name: 'nested.name' },
    { name: 'phone' },
  ]
  const initialValues = fromJS({
    nested: {
      name: 'old name',
    },
    id: 'id',
  })
  const [, { submit }] = useForm({ fields, submit: submitWorker, initialValues })
  submit()
  expect(submitWorker.mock.calls[0]).toMatchSnapshot()
})

test('submit removes fields that were removed via action', () => {
  createReducer.mockImplementation(({ fields }) => [createState(fields).set(removedFieldsKey, fromJS(['nested.name'])), dispatch])
  useFormField.mockReturnValueOnce({ ...fieldProps, props: { value: 'new name' } })
  useFormField.mockReturnValueOnce({ ...fieldProps, props: { value: 'new phone' } })
  fields = [
    { name: 'nested.name' },
    { name: 'phone' },
  ]
  const initialValues = fromJS({
    nested: {
      name: 'old name',
    },
    id: 'id',
  })
  const [, { submit }] = useForm({ fields, submit: submitWorker, initialValues })
  submit()
  expect(submitWorker.mock.calls[0]).toMatchSnapshot()
})

test('options passed to createReducer', () => {
  const options = {
    optional: 'yes',
  }
  useForm({ fields, submit: submitWorker, options })

  expect(createReducer.mock.calls[0]).toMatchSnapshot()
})
