export const syncListIndexes = (state, fieldsKey, path) => {
  const items = recurseSyncListIndexes(state.getIn([fieldsKey, ...path, 'items']), path)

  return state.setIn([fieldsKey, ...path, 'items'], items)
}

const recurseSyncListIndexes = (items, path) => {
  return items.map((item, index) => {
    const fieldKeys = item.get('fields').keySeq()
    let temp = item
    for (let key of fieldKeys) {
      temp = temp.setIn(['fields', key, 'initial', 'field', 'name'], `${path.join('.')}.items.${index}.fields.${key}`)

      const childPath = ['fields', key, 'items']
      let childItems = temp.getIn(childPath)
      if (childItems) {
        childItems = recurseSyncListIndexes(childItems, [...path, 'items', index, 'fields', key])
        temp = temp.setIn(childPath, childItems)
      }
    }
    return temp
  })
}
