import { pruneNonErrors } from './pruneNonErrors'

let errors
beforeEach(() => {

})

test('prunes first level', () => {
  errors = {
    nickname: '',
    colors: [],
  }

  expect(pruneNonErrors(errors)).toMatchSnapshot()
})

test('prunes more levels', () => {
  errors = {
    nickname: '',
    colors: [{
      color: 'color',
      shades: [
        { shade: '' },
      ],
    }],
  }

  expect(pruneNonErrors(errors)).toMatchSnapshot()
})

test('prunes nested object', () => {
  errors = {
    name: {
      first: '',
      middle: 'finger',
      last: 'last',
    },
    colors: [{
      color: 'color',
      shades: [
        { shade: '' },
      ],
    }],
  }

  expect(pruneNonErrors(errors)).toMatchSnapshot()
})

test('prunes all of nested objects', () => {
  errors = {
    name: {
      first: '',
      middle: '',
      last: '',
    },
    colors: [
      undefined,
      {
        color: '',
        shades: [
          null,
          { shade: '' },
          undefined,
        ],
      }],
  }

  expect(pruneNonErrors(errors)).toMatchSnapshot()
})

test('prunes nested array', () => {
  errors = {
    nickname: '',
    colors: [{
      shades: [
        undefined,
        { shade: 'shade' },
      ],
    }],
  }

  expect(pruneNonErrors(errors)).toMatchSnapshot()
})

test('prunes array at middle index', () => {
  errors = {
    nickname: '',
    colors: [
      undefined,
      { color: 'color' },
      undefined,
    ],
  }

  expect(pruneNonErrors(errors)).toMatchSnapshot()
})

test('leaves error on array', () => {
  errors = {
    nickname: '',
    colors: [
      undefined,
      { color: '' },
      undefined,
    ],
  }
  errors.colors.error = 'colors'

  expect(pruneNonErrors(errors)).toMatchSnapshot()
  expect(errors.colors.error).toEqual('colors')
})

test('leaves error on array with errors', () => {
  errors = {
    nickname: '',
    colors: [
      undefined,
      { color: 'color' },
      undefined,
    ],
  }
  errors.colors.error = 'colors'

  expect(pruneNonErrors(errors)).toMatchSnapshot()
  expect(errors.colors.error).toEqual('colors')
})
