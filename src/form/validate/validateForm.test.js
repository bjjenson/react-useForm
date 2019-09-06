import { validateForm } from './validateForm'
import { getFieldValues } from '../helpers/getFieldValues'

jest.mock('../helpers/getFieldValues')

let values, fieldData
beforeEach(() => {
  fieldData = {
    fieldOne: { props: 'props1' },
  }

  values = {
    value1: 'one',
    value2: 'two',
  }
  getFieldValues.mockReturnValue(values)
})

test('no validators returns empty object', () => {
  expect(validateForm(undefined, fieldData)).toEqual({})
})

test('singleValidator returns results', () => {
  const validator = jest.fn()
  validator.mockReturnValue({
    value1: 'Error1',
    value2: 'Error2',
  })

  expect(validateForm(validator, fieldData)).toMatchSnapshot()
})

test('multiple validators returns merged results', () => {
  const validator1 = jest.fn()
  const validator2 = jest.fn()

  validator1.mockReturnValue({
    value1: 'Error1',
  })
  validator2.mockReturnValue({
    value2: 'Error2',
  })

  expect(validateForm([validator1, validator2], fieldData)).toMatchSnapshot()
})

test('multiple validators deeply merges results', () => {
  const validator1 = jest.fn()
  const validator2 = jest.fn()

  validator1.mockReturnValue({
    nested: {
      deepNested: {
        value1: 'Error1',
        value1a: 'Error1a',
      },
    },
    other1: 'OtherError1',
  })
  validator2.mockReturnValue({
    nested: {
      deepNested: {
        value2: 'Error2',
      },
    },
    other2: 'OtherError2',
  })

  expect(validateForm([validator1, validator2], fieldData)).toMatchSnapshot()
})
