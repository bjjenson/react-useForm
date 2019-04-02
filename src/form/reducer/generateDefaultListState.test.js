import { fromJS } from 'immutable'
import { generateDefaultListState } from './generateDefaultListState'

let field, initialValues, options
beforeEach(() => {
  field = { name: 'fieldName', type: 'list', label: 'List' }
  initialValues = fromJS({})
  options = {}
})

test('simple list', () => {
  expect(generateDefaultListState(field, initialValues, options)).toMatchSnapshot()
})

test('complex list', () => {
  field = {
    name: 'fieldName', type: 'list', label: 'List', fields: [
      { name: 'first', label: 'First' },
      { name: 'second', label: 'Second' },
    ],
  }
  expect(generateDefaultListState(field, initialValues, options)).toMatchSnapshot()
})

test('complex list with initialValues', () => {
  field = {
    name: 'fieldName', type: 'list', label: 'List', fields: [
      { name: 'first', label: 'First' },
      { name: 'second', label: 'Second' },
    ],
  }
  initialValues = fromJS({
    fieldName: [
      { first: '1', second: '2' },
      { first: '10', second: '20' },
    ],
  })
  expect(generateDefaultListState(field, initialValues, options)).toMatchSnapshot()
})
