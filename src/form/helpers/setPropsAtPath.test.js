import { setPropsAtPath } from './setPropsAtPath'

let fieldData, props
beforeEach(() => {
  fieldData = {
    f0: {
      f1: {
        props: {
          items: [
            {
              f3: {
                items: [
                  { f4: {} },
                  { f4: 'second' },
                ],
              },
            },
          ],
        },
      },
    },
  }
  props = {
    props: {
      prop1: 'prop1',
      meta: 'meta',
    },
  }
})

test('basic path', () => {
  expect(setPropsAtPath(fieldData, props, ['f0'])).toMatchSnapshot()
})

test('nested path', () => {
  expect(setPropsAtPath(fieldData, props, ['f0', 'f1'])).toMatchSnapshot()
})

test('path with items', () => {
  expect(setPropsAtPath(fieldData, props, ['f0', 'f1', 'items', '0', 'fields', 'f3'])).toMatchSnapshot()
})

test('path with items with items', () => {
  expect(setPropsAtPath(fieldData, props, ['f0', 'f1', 'items', '0', 'fields', 'f3', 'items', '1', 'f4'])).toMatchSnapshot()
})
