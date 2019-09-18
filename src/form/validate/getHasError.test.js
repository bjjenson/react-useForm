import expect from 'expect'
import { getHasError } from './getHasError'

test('no errors', () => {
  const errors = {
    nickname: '',
    colors: [
      {
        color: '',
        shades: [
          { shade: '' },
        ],
      },
    ],
  }

  expect(getHasError(errors)).toBeFalsy()
})

test('has an error', () => {
  const errors = {
    nickname: 'i am error',
    colors: [
      {
        color: '',
        shades: [
          { shade: '' },
        ],
      },
    ],
  }

  expect(getHasError(errors)).toBeTruthy()
})

test('has a nested error', () => {
  const errors = {
    nickname: '',
    colors: [
      {
        color: '',
        shades: [
          { shade: 'i am error' },
        ],
      },
    ],
  }

  expect(getHasError(errors)).toBeTruthy()
})

test('has an error on an array', () => {
  const errors = {
    nickname: '',
    colors: [
      {
        color: '',
        shades: [
          { shade: '' },
        ],
      },
    ],
  }
  errors.colors.error = 'error'

  expect(getHasError(errors)).toBeTruthy()
})
