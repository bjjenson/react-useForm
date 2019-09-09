export const prepareNameForValidate = name => name
  .replace(/.items./g, '.')
  .replace(/.fields./g, '.')
