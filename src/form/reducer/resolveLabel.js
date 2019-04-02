import { formatOptionalLabel } from '../helpers/formatLabel'

export const resolveLabel = (field, options) => {
  const { optionalLabelFormatter = formatOptionalLabel } = options
  return field.optional ? optionalLabelFormatter(field.label, field.name) : field.label
}
