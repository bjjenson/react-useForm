import { Map } from 'immutable'
import { getFieldProps } from './resolveFieldData'

let fieldData
beforeEach(() => {
  fieldData = {
    one: { props: { value: 'one', onChange: 'onChange-one' } },
    two: { props: { value: 'two', onChange: 'onChange-two' } },
  }
})

describe('getFieldProps', () => {

  test('reduces all props on keys', () => {
    expect(getFieldProps(fieldData)).toMatchSnapshot()
  })

  test('spreads passThrough from state if it exists', () => {
    fieldData = {
      one: { props: { value: 'one', onChange: 'onChange-one' } },
      two: { props: { value: 'two', onChange: 'onChange-two' } },
    }

    const state = Map([
      ['fields', Map([
        ['one', Map([
          ['initial', Map([
            ['field', { passThrough: { key: 'key-one' } }],
          ])],
        ])],
      ])],
    ])
    expect(getFieldProps(fieldData, state)).toMatchSnapshot()
  })
})
