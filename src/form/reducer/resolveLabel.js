import { formatOptionalLabel } from '../helpers/formatLabel'

export const resolveLabel = (field, options = {}) => {
  const formatter = options && options.optionalLabelFormatter ? options.optionalLabelFormatter : formatOptionalLabel
  return field.optional ? formatter(field.label, field.name) : field.label
}
