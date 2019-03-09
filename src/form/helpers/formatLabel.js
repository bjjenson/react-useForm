export const formatLabel = (label, optional = false) => {
  return optional ? `${label} (optional)` : label
}

export const formatOptionalLabel = label => `${label} (optional)`
