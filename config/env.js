const REACT_APP = /^REACT_APP_/i

const getReleventEnvVars = () => Object.keys(process.env).filter(key => REACT_APP.test(key)).reduce((acc, key) => {
  acc[key] = process.env[key]
  return acc
}, {})

module.exports = getReleventEnvVars
