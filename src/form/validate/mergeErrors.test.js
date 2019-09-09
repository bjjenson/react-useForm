import expect from 'expect'
import { mergeErrors } from './mergeErrors'

test('merges with array', () => {
  const formErrors = {
    nickname: 'nickname, error',
    colors: [
      { color: 'color 0 error' },
    ],
  }
  const fieldErrors = {
    colors: [
      null,
      { color: 'color 1 error' },
    ],
  }

  expect(mergeErrors(fieldErrors, formErrors)).toMatchSnapshot()
})

test('missing array on fields ', () => {
  const formErrors = {
    colors: [
      { color: 'color 0 error' },
    ],
  }
  const fieldErrors = {
  }

  expect(mergeErrors(fieldErrors, formErrors)).toMatchSnapshot()
})

test('missing array on form ', () => {
  const formErrors = {
  }
  const fieldErrors = {
    colors: [
      { color: 'color 0 error' },
    ],
  }

  expect(mergeErrors(fieldErrors, formErrors)).toMatchSnapshot()
})

test('more deeply nested arrays data', () => {
  const formErrors = {
    nickname: 'nickname, error',
    colors: [
      { color: 'color 0 error' },
      { shades: 'shades 1 error' },
    ],
  }
  const fieldErrors = {
    colors: [
      null,
      {
        color: 'color 1 error',
        shades: [
          { shade: 'nested shade 1 error' },
        ],
      },
    ],
  }

  const actual = mergeErrors(fieldErrors, formErrors)
  expect(actual).toMatchSnapshot()
  expect(actual.colors[1].shades.error).toMatchSnapshot()
})

test('more deeply nested arrays data opposite', () => {
  const fieldErrors = {
    nickname: 'nickname, error',
    colors: [
      { color: 'color 0 error' },
      { shades: 'shades 1 error' },
    ],
  }
  const formErrors = {
    colors: [
      null,
      {
        color: 'color 1 error',
        shades: [
          { shade: 'nested shade 1 error' },
        ],
      },
    ],
  }

  const actual = mergeErrors(fieldErrors, formErrors)
  expect(actual).toMatchSnapshot()
  expect(actual.colors[1].shades.error).toMatchSnapshot()
})
