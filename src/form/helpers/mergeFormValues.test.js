import { fromJS } from 'immutable'
import { mergeFormValues } from './mergeFormValues'
import { removedFieldsKey } from '../reducer/fieldReducer'

let state, initialValues
beforeEach(() => {
  initialValues = fromJS({
    id: 'the id',
    name: 'old name',
    phone: 'old phone',
  })
  state = fromJS({
    fields: {
      name: {
        current: {
          value: 'old name',
        },
      },
      phone: {
        current: {
          value: 'new phone',
        },
      },
    },
  })
})

test('merges current form values with initialValues', () => {
  expect(mergeFormValues(state, initialValues)).toMatchSnapshot()
})

test('merges current nested form values with initialValues', () => {
  initialValues = fromJS({
    id: 'the id',
    data: {
      name: 'old name',
      phone: 'old phone',
    },
  })
  state = fromJS({
    fields: {
      'data.name': {
        current: {
          value: 'old name',
        },
      },
      'data.phone': {
        current: {
          value: 'new phone',
        },
      },
    },
  })

  expect(mergeFormValues(state, initialValues)).toMatchSnapshot()
})

test('merges current list values with initialValues', () => {
  initialValues = fromJS({
    id: 'the id',
    data: {
      name: 'old name',
      phones: [
        { number: 'old phone 1' },
        { number: 'old phone 2' },
      ],
    },
  })
  state = fromJS({
    fields: {
      'data.name': {
        current: {
          value: 'old name',
        },
      },
      'data.phones': {
        current: {
        },
        items: [
          {
            fields: {
              number: {
                current: {
                  value: 'new phone 1',
                },
              },
            },
          },
          {
            fields: {
              number: {
                current: {
                  value: 'new phone 2',
                },
              },
            },
          },
        ],
      },
    },
  })

  expect(mergeFormValues(state, initialValues)).toMatchSnapshot()
})

test('submit removes fields that were removed via action', () => {
  const newState = state.set(removedFieldsKey, fromJS(['name']))
  expect(mergeFormValues(newState, initialValues)).toMatchSnapshot()
})
