import { getFieldValues } from './getFieldValues'

describe('getFieldValues', () => {

  test('gets nested values', () => {
    const fieldData = {
      nickname: {
        props: {
          value: 'nickname',
        },
      },
      fullName: {
        props: {
          value: 'fullName',
        },
      },
      colors: {
        props: {
          items: [
            {
              color: {
                value: 'color1',
              },
              shades: {
                items: [
                  { shade: { value: 'shade-1-1' } },
                ],
              },
            },
            {
              color: {
                value: 'color2',
              },
            },
          ],
        },
      },
    }

    expect(getFieldValues(fieldData)).toMatchSnapshot()
  })

})
