import { fromJS, List } from 'immutable'
import { generateDefaultListState, getCurrentValues } from './generateDefaultListState'

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

test('complex nested list with initialValues', () => {
  field = {
    name: 'fieldName', type: 'list', label: 'List', fields: [
      { name: 'first', label: 'First' },
      {
        name: 'second', label: 'Second', type: 'list', fields: [
          { name: 'nestedName', label: 'nestedList' },
        ],
      },
    ],
  }
  initialValues = fromJS({
    fieldName: [
      { first: '1', second: [{ nestedName: 'nested name 1' }] },
      { first: '10', second: [{ nestedName: 'nested name 10.A' }, { nestedName: 'nested name 10.B' }] },
    ],
  })
  expect(generateDefaultListState(field, initialValues, options)).toMatchSnapshot()
})
//C fieldName.items.0.fields.first
//A fieldName.items.0.fields.first
//C fieldName.items.0.fields.second.items.0.fields.nestedName
//A fieldName.items.1.fields.second.items.0.fields.nestedName

test('thingy', () => {
  field = [{
    name: 'fieldName', type: 'list', label: 'List', fields: [
      { name: 'first', label: 'First' },
      {
        name: 'second', label: 'Second', type: 'list', fields: [
          { name: 'nestedName', label: 'nestedList' },
        ],
      },
    ],
  }]

})

test('getCurrentValues handles null', () => {
  expect(getCurrentValues(null, null)).toEqual(List())
})
