export const setPropsAtPath = (fieldData, props, path) => {
  let current = fieldData
  let previousBranch
  let usedProps = false
  const size = path.length
  for (let index = 0; index < size; index++) {
    let branch = path[index]
    if (!isNaN(previousBranch) && branch === 'fields') {
      index++
      branch = path[index]
    }

    if (!usedProps && branch === 'items') {
      usedProps = true
      current = current.props
    }

    if (index === size - 1) {
      current[branch] = usedProps ? props.props : props
    } else {
      previousBranch = branch
      current = current[branch]
    }
  }

  return fieldData
}
