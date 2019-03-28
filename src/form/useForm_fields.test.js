import { fromJS } from 'immutable'
import { useForm } from './useForm'
import {
  useBooleanField,
  useNumberField,
  useSelectField,
  useTextField,
} from './fields'
import { createReducer } from './reducer/createReducer'
import { fieldsKey } from './reducer/fieldReducer'

jest.mock('./fields')
jest.mock('./reducer/createReducer')

const setValue = jest.fn()

let fieldProps
beforeEach(() => {
  fieldProps = {
    props: {},
    setValue,
    validate: jest.fn(),
  }

  const createState = type => fromJS({
    [fieldsKey]: {
      fieldName: {
        initial: {
          type,
        },
        current: {
          value: 'value of fieldName',
        },
      },
    },
  })

  createReducer.mockImplementation(({ fields }) => {
    return [createState(fields[0].type || 'text'), 'dispatch']
  })
  useBooleanField.mockReturnValue(fieldProps)
  useNumberField.mockReturnValue(fieldProps)
  useSelectField.mockReturnValue(fieldProps)
  useTextField.mockReturnValue(fieldProps)
})

describe('text', () => {
  test('defaults to text', () => {
    useForm({
      fields: [
        { name: 'fieldName', label: 'the label' },
      ],
    })

    expect(useTextField.mock.calls[0]).toMatchSnapshot()
  })

  test('uses text', () => {
    useForm({
      fields: [
        { name: 'fieldName', type: 'text', label: 'the label' },
      ],
    })

    expect(useTextField.mock.calls[0]).toMatchSnapshot()
  })

  test('setValue updates field value', () => {
    const [, form] = useForm({
      fields: [
        { name: 'fieldName', type: 'text', label: 'the label' },
      ],
    })
    form.setValue('fieldName', 'new value')
    expect(setValue.mock.calls[0]).toMatchSnapshot()
  })
})

describe('number', () => {
  test('uses text', () => {
    useForm({
      fields: [
        { name: 'fieldName', type: 'number', label: 'the label' },
      ],
    })

    expect(useNumberField.mock.calls[0]).toMatchSnapshot()
  })

})

describe('select', () => {
  test('uses select', () => {
    useForm({
      fields: [
        { name: 'fieldName', type: 'select', label: 'the label' },
      ],
    })

    expect(useSelectField.mock.calls[0]).toMatchSnapshot()
  })

})

describe('boolean', () => {
  test('uses boolean', () => {
    useForm({
      fields: [
        { name: 'fieldName', type: 'boolean', label: 'the label' },
      ],
    })

    expect(useBooleanField.mock.calls[0]).toMatchSnapshot()
  })

})
