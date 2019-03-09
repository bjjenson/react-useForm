module.exports = {
  verbose: false,
  errorOnDeprecated: true,
  transform: {
    '^.+\\.js$': 'babel-jest',
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
  },
  resetMocks: true,
}
