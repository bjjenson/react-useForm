import { fromJS } from 'immutable'
import { useForm } from './useForm'
import { useFormField } from './fields/useFormField'
import { createReducer } from './reducer/createReducer'

jest.mock('react')
jest.mock('./fields/useFormField')
jest.mock('./reducer/createReducer')

const submitWorker = jest.fn()
const dispatch = jest.fn()

const createState = fields => fromJS({
  name: {
    initial: {
      type: fields[0].type,
      label: fields[0].label,
    },
    current: {
      value: 'current value of name',
    },
  },
  phone: {
    initial: {
      type: fields[1].type,
      label: fields[1].label,
    },
    current: {
      value: 'current value of phone',
    },
  },
})

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

  const { submit } = useForm({ fields, submit: submitWorker })
  submit()
  expect(submitWorker).not.toHaveBeenCalled()
})

test('no submit if form validation fails', () => {
  const validateForm = jest.fn()
  validateForm.mockReturnValue({ name: 'i am error' })
  const actual = useForm({ fields, worker: submitWorker, validate: validateForm })
  actual.submit()
  expect(validateForm.mock.calls[0]).toMatchSnapshot()
  expect(submitWorker).not.toHaveBeenCalled()
})

test('submit calls worker, merges with initialValues', () => {
  useFormField.mockReturnValueOnce({ ...fieldProps, props: { value: 'new name' } })
  useFormField.mockReturnValueOnce({ ...fieldProps, props: { value: 'new phone' } })
  fields = [
    { name: 'name' },
    { name: 'phone' },
  ]
  const initialValues = fromJS({
    name: 'old name',
    id: 'id',
  })
  const actual = useForm({ fields, submit: submitWorker, initialValues })
  actual.submit()
  expect(submitWorker.mock.calls[0]).toMatchSnapshot()
})

test('options passed to createReducer', () => {
  const options = {
    optional: 'yes',
  }
  useForm({ fields, submit: submitWorker, options })

  expect(createReducer.mock.calls[0]).toMatchSnapshot()
})
