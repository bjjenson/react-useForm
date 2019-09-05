const getListFieldValues = items => {
  return items.reduce((acc, item) => {
    const itemValues = getFieldValues(item)
    acc.push(itemValues)
    return acc
  }, [])
}

export const getFieldValues = (fieldData) => {
  return Object.entries(fieldData).reduce((acc, [k, v]) => {
    let value
    if (v.props) {
      if (v.props.items) {
        value = getListFieldValues(v.props.items)
      } else {
        value = v.props.value
      }
    } else {
      if (v.items) {
        value = getListFieldValues(v.items)
      } else {
        value = v.value
      }
    }

    acc[k] = value
    return acc
  }, {})
}

