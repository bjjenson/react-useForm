import { fromJS } from 'immutable'
import { mergeValidationResults } from './mergeValidationResults'

let state
beforeEach(() => {
  state = fromJS({
    other: 'other data',
    fields: {
      nickname: {
        current: {
          error: 'notSet',
          helperText: 'notSet',
        },
        initial: 'initialNickname',
      },
      fullName: {
        current: {
          error: 'notSet',
          helperText: 'notSet',
        },
      },
      colors: {
        current: {
          error: 'notSet',
          helperText: 'notSet',
        },
        initial: 'initialColors',
        items: [
          {
            fields: {
              color: {
                current: {
                  error: 'notSet',
                  helperText: 'notSet',
                },
                initial: 'initialColor',
              },
            },
          },
          {
            fields: {
              color: {
                current: {
                  error: 'notSet',
                  helperText: 'notSet',
                },
              },
              shades: {
                current: {
                  error: 'notSet',
                  helperText: 'notSet',
                },
                items: [
                  {
                    fields: {
                      shade: {
                        current: {
                          error: 'notSet',
                          helperText: 'notSet',
                        },
                        initial: 'initialShade',
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    },
  })
})

test('no errors will clear state values', () => {
  expect(mergeValidationResults(state, undefined)).toMatchSnapshot()
})

test('sets a single error', () => {
  const errors = { fullName: 'i am not full' }
  expect(mergeValidationResults(state, errors)).toMatchSnapshot()
})

test('sets an error on a list', () => {
  const errors = { colors: 'blind' }
  expect(mergeValidationResults(state, errors)).toMatchSnapshot()
})

test('sets an error on a list field', () => {
  const errors = {
    colors: [
      null,
      { color: 'blind' },
    ],
  }
  expect(mergeValidationResults(state, errors)).toMatchSnapshot()
})

test('sets an error on a list and its field', () => {
  const errors = {
    colors: [
      null,
      { color: 'blind' },
    ],
  }
  errors.colors.error = 'no blindness'

  expect(mergeValidationResults(state, errors)).toMatchSnapshot()
})

test('sets an error on a nested list field', () => {
  const errors = {
    colors: [
      { color: 'blind' },
      {
        shades: [
          { shade: 'down' },
        ],
      },
    ],
  }
  expect(mergeValidationResults(state, errors)).toMatchSnapshot()
})
