import React from 'react'
import { fromJS } from 'immutable'
import { TextField, Button, Typography, FormHelperText } from '@material-ui/core'
import Flexbox from 'flexbox-react'
import { useForm } from '../../../form'

const validateShade = (value, name, getValues) => {
  const colorPath = name.slice(0, name.indexOf('.shades.'))
  const allValues = fromJS(getValues())

  const color = allValues.getIn([...colorPath.split('.'), 'color'])
  if (color === 'Blue' && (value !== 'dark' && value !== 'medium')) {
    return 'Shade must be dark or medium if color is Blue'
  }
}

const initialValues = fromJS({
  colors: [
    { color: '' },
    {
      color: 'Blue',
      shades: [
        { shade: 'light' },
        { shade: 'medium' },
      ],
    },
  ],
})

const ListField = ({ submit }) => {
  const [fields, form] = useForm({
    fields: [
      { name: 'fullName', label: 'Full Name' },
      { name: 'nickname', label: 'Nickname' },
      {
        name: 'colors', label: 'Favorite Colors', type: 'list', fields: [
          { name: 'color', label: 'Color' },
          {
            name: 'shades', type: 'list', optional: true, fields: [
              { name: 'shade', label: 'Shade', validate: validateShade },
            ],
          },
        ],
      },
    ],
    submit,
    initialValues,
    options: {
      logPerformance: true,
    },
  })

  return (
    <form.Form>
      <Flexbox flexDirection='column'>
        <TextField {...fields.fullName} />
        <TextField {...fields.nickname} />

        <Typography>{fields.colors.label}</Typography>
        <FormHelperText error={fields.colors.error}>{fields.colors.helperText}</FormHelperText>
        {fields.colors.items.map((item, index) => {
          return (
            <Flexbox key={item.key}>
              <Flexbox flexDirection='column'>
                <TextField {...item.color} />
                {item.shades.items.map((shade) => (
                  <TextField key={shade.key} {...shade.shade} />
                ))}
                <Button onClick={() => item.shades.add()}>Add Shade</Button>
              </Flexbox>
              <Button onClick={() => fields.colors.remove(index)}>X</Button>
            </Flexbox>
          )
        })}
        <Button onClick={() => fields.colors.add()}>Add row</Button>

      </Flexbox>
      <Button type='submit' onClick={form.submit}>Submit</Button>
    </form.Form>
  )
}

export default ListField
