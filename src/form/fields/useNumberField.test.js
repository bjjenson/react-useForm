import { useFormField } from './useFormField'
import { useNumberField } from './useNumberField'

jest.mock('./useFormField')

let initialArgs
beforeEach(() => {
  initialArgs = {}

  useFormField.mockReturnValue({ prop1: 'prop1', prop2: 'prop2' })
})

test('returns all props needed', () => {
  const actual = useNumberField('state', 'dispatch', initialArgs)
  expect(actual).toMatchSnapshot()
  expect(useFormField.mock.calls[0]).toMatchSnapshot()
})
