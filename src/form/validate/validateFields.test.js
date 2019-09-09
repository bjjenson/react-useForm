import { fromJS, Map } from 'immutable'
import { validateFields } from './validateFields'

let state, nicknameField, colorsField, colorField, getAllValues

beforeEach(() => {
  getAllValues = 'getAllValuesFunc'

  nicknameField = Map([
    ['optional', false],
    ['field', {
      name: 'nickname',
      validate: jest.fn(),
    }],
  ])
  colorsField = Map([
    ['optional', false],
    ['field', {
      name: 'colors',
      validate: jest.fn(),
    }],
  ])
  colorField = Map([
    ['optional', false],
    ['field', {
      name: 'color',
      validate: jest.fn(),
    }],
  ])

  state = fromJS({
    other: 'other data',
    getAllValues: 'getAllValuesFunc',
    fields: {
      nickname: {
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
        items: [
          {
            fields: {
              color: {
                current: {
                  error: 'notSet',
                  helperText: 'notSet',
                },
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

  state = state.setIn(['fields', 'nickname', 'initial'], nicknameField)
  state = state.setIn(['fields', 'colors', 'initial'], colorsField)
  state = state.setIn(['fields', 'colors', 'items', 0, 'fields', 'color', 'initial'], colorField)
  state = state.setIn(['fields', 'colors', 'items', 1, 'fields', 'shades', 'items', 0, 'fields', 'shade', 'initial'], colorField)
})


const setValues = () => {
  state = state
    .setIn(['fields', 'nickname', 'current', 'value'], 'val')
    .setIn(['fields', 'colors', 'items', 0, 'fields', 'color', 'current', 'value'], 'val')
    .setIn(['fields', 'colors', 'items', 1, 'fields', 'color', 'current', 'value'], 'val')
    .setIn(['fields', 'colors', 'items', 1, 'fields', 'shades', 'items', 0, 'fields', 'shade', 'current', 'value'], 'val')
}

test('state', () => {
  setValues()
  expect(state).toMatchSnapshot()
})

test('validates required fields', () => {
  expect(validateFields(state, getAllValues)).toMatchSnapshot()
})

test('validates optional fields', () => {
  setValues()
  expect(validateFields(state, getAllValues)).toMatchSnapshot()
})

test('validates optional = true', () => {
  nicknameField = nicknameField.set('optional', true)
  state = state.setIn(['fields', 'nickname', 'initial'], nicknameField)

  expect(validateFields(state, getAllValues)).toMatchSnapshot()
})

test('validate custom validator', () => {
  setValues()

  const nickname = nicknameField.get('field')
  nickname.validate.mockReturnValue('nickname error')

  expect(validateFields(state, getAllValues)).toMatchSnapshot()
  expect(nickname.validate.mock.calls[0]).toMatchSnapshot()
})
