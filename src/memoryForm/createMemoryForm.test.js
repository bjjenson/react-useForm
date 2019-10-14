import { fromJS, Map } from 'immutable'
import { getInitialState } from '../form/reducer/getInitialState'
import { validateAll } from '../form/validate/validateAll'
import { resolveFieldData } from '../form/resolveFieldData'
import { createMemoryForm } from './createMemoryForm'
import { getFieldValues } from '../form/helpers/getFieldValues'
import { pruneNonErrors } from '../form/validate/pruneNonErrors'

jest.mock('../form/reducer/getInitialState')
jest.mock('../form/validate/validateAll')
jest.mock('../form/resolveFieldData')
jest.mock('../form/helpers/getFieldValues')
jest.mock('../form/validate/pruneNonErrors')

let fields, validators, initialValues
beforeEach(() => {
  fields = [
    { name: 'name', type: 'text', label: 'Name' },
    { name: 'address', type: 'text', label: 'Address' },
  ]

  validators = ['validator1']

  initialValues = fromJS({ 'name': 'the-name', address: 'the-address' })

  getInitialState.mockReturnValue(initialValues.merge(Map({ 'resolvedInitialState': true })))
  resolveFieldData.mockReturnValue('field-data')
  validateAll.mockReturnValue({ isValid: true, errors: {} })
  getFieldValues.mockReturnValue({ name: 'name', address: 'address' })
  pruneNonErrors.mockReturnValue({ errors: 'pruned' })
})

test('gets initial state from fields and values', () => {
  createMemoryForm({ fields, validate: validators, initialValues })

  expect(getInitialState.mock.calls[0]).toMatchSnapshot()
})

test('gets field data', () => {
  createMemoryForm({ fields, validate: validators, initialValues })

  expect(resolveFieldData.mock.calls[0]).toMatchSnapshot()
})

test('returns form functions', () => {
  expect(createMemoryForm({ fields, validate: validators, initialValues })).toMatchSnapshot()
})

test('validates the form', () => {
  const { validate } = createMemoryForm({ fields, validate: validators, initialValues })

  expect(validate()).toMatchSnapshot()
  expect(validateAll.mock.calls[0]).toMatchSnapshot()
})

test('validation: getAllValues returns getFieldValues', () => {
  const { validate } = createMemoryForm({ fields, validate: validators, initialValues })

  validate()

  const actual = validateAll.mock.calls[0][3]()

  expect(getFieldValues.mock.calls[0]).toMatchSnapshot()
  expect(actual).toMatchSnapshot()
})
