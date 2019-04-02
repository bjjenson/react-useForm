import { defaultTextValue } from '../fields/useTextField'
import { defaultSelectValue } from '../fields/useSelectField'
import { defaultNumberValue } from '../fields/useNumberField'
import { defaultBooleanValue } from '../fields/useBooleanField'
import { defaultListValue } from '../fields/useListField'

const defaultValues = {
  text: defaultTextValue,
  select: defaultSelectValue,
  number: defaultNumberValue,
  boolean: defaultBooleanValue,
  list: defaultListValue,
}

export const resolveInitialFieldValue = (fieldValue, initialValue, type = 'text') => {
  if (initialValue) {
    return initialValue
  }
  if (fieldValue) {
    return fieldValue
  }
  return defaultValues[type]
}
