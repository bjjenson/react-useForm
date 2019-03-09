import { useFormField } from './useFormField'
import { useSelectField } from './useSelectField'

jest.mock('./useFormField')

let initialArgs
beforeEach(() => {
  initialArgs = {
    options: [{ value: 'value1', label: 'label1' }],
  }

  useFormField.mockReturnValue({
    props: {
      prop1: 'prop1',
      prop2: 'prop2',
    },
    validate: 'validateFunction',
  })
})

test('returns all props needed', () => {
  const actual = useSelectField('state', 'dispatch', initialArgs)
  expect(actual).toMatchSnapshot()
  expect(useFormField.mock.calls[0]).toMatchSnapshot()
})
