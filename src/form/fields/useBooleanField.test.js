import { useFormField } from './useFormField'
import { useBooleanField } from './useBooleanField'

jest.mock('./useFormField')

let initialArgs
beforeEach(() => {
  initialArgs = {}

  useFormField.mockReturnValue({ prop1: 'prop1', prop2: 'prop2', props: { value: true } })
})

test('returns all props needed', () => {
  const actual = useBooleanField('state', 'dispatch', initialArgs)
  expect(actual).toMatchSnapshot()
  expect(useFormField.mock.calls[0]).toMatchSnapshot()
})

test('valueFromChange returns checked', () => {
  useBooleanField('state', 'dispatch', initialArgs)
  expect(useFormField.mock.calls[0][2].valueFromChange({ target: { checked: 'i am value' } })).toEqual('i am value')
})
