export const syncListIndexes = (state, fieldsKey, path) => {
  const items = state.getIn([fieldsKey, ...path, 'items'])
    .map((item, index) => {
      const fieldKeys = item.get('fields').keySeq()
      let temp = item
      for (let key of fieldKeys) {
        temp = temp.setIn(['fields', key, 'initial', 'field', 'name'], `${path.join('.')}.items.${index}.fields.${key}`)
      }
      return temp
    })

  return state.setIn([fieldsKey, ...path, 'items'], items)
}
