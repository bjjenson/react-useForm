import React from 'react'
import { fromJS } from 'immutable'
import { TextField, Button, Typography, FormHelperText } from '@material-ui/core'
import Flexbox from 'flexbox-react'
import { useForm } from '../../../form'

const initialValues = fromJS({
  colors: [
    { color: '' },
    { color: 'Blue' },
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
        ],
      },
    ],
    submit,
    initialValues,
    options: {
      id: 'list-example',
    },
  })

  return (
    <form.Form id={form.id}>
      <Flexbox flexDirection='column'>
        <TextField {...fields.fullName} />
        <TextField {...fields.nickname} />

        <Typography>{fields.colors.label}</Typography>
        <FormHelperText error={fields.colors.error}>{fields.colors.helperText}</FormHelperText>
        <Flexbox flexDirection='column' id={fields.colors.id}>
          {fields.colors.items.map((item, index) => {
          return (
            <Flexbox key={item.key}>
              <TextField {...item.color} />
              <Button onClick={() => fields.colors.remove(index)}>X</Button>
            </Flexbox>
          )
        })}
        </Flexbox>
        <Button onClick={() => fields.colors.add()}>Add row</Button>

      </Flexbox>
      <Button type='submit' onClick={form.submit}>Submit</Button>
    </form.Form>
  )
}

export { ListField }
