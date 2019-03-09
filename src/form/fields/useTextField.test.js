import { useFormField } from './useFormField'
import { useTextField } from './useTextField'

jest.mock('./useFormField')

let initialArgs
beforeEach(() => {
  initialArgs = {}

  useFormField.mockReturnValue({ prop1: 'prop1', prop2: 'prop2' })
})

test('useFormField correctly', () => {
  const actual = useTextField('state', 'dispatch', initialArgs)
  expect(actual).toMatchSnapshot()
  expect(useFormField.mock.calls[0]).toMatchSnapshot()
})
