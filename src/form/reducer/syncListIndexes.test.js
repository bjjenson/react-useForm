import { fromJS } from 'immutable'
import { syncListIndexes } from './syncListIndexes'

let state, fieldsKey, path
beforeEach(() => {
  fieldsKey = 'fields'
  path = ['nested', 'data']
  state = fromJS({
    [fieldsKey]: {
      nested: {
        data: {
          items: [
            {
              fields: {
                first: {
                  initial: {
                    field: {
                      name: 'nested.data.items.1.fields.first',
                    },
                  },
                },
                second: {
                  items: [
                    {
                      fields: {
                        shade: {
                          initial: {
                            field: {
                              name: 'nested.data.items.1.fields.second.items.3.fields.shade',
                            },
                          },
                        },
                      },
                    }, {
                      fields: {
                        shade: {
                          initial: {
                            field: {
                              name: 'nested.data.items.1.fields.second.items.5.fields.shade',
                            },
                          },
                        },
                      },
                    },
                  ],
                  initial: {
                    field: {
                      name: 'nested.data.items.1.fields.second',
                    },
                  },
                },
              },
            },
            {
              fields: {
                first: {
                  initial: {
                    field: {
                      name: 'nested.data.items.4.fields.first',
                    },
                  },
                },
                second: {
                  initial: {
                    field: {
                      name: 'nested.data.items.4.fields.second',
                    },
                  },
                },
              },
            },
          ],
        },
      },

    },
  })
})


test('resets all index to 0 index', () => {
  expect(syncListIndexes(state, fieldsKey, path)).toMatchSnapshot()
})
