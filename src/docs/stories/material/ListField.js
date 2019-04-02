import React from 'react'
import { fromJS } from 'immutable'
import { TextField, Button, Typography } from '@material-ui/core'
import Flexbox from 'flexbox-react'
import { useForm } from '../../../form'

const initialValues = fromJS({
  colors: [
    { color: 'Red' },
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
  })

  return (
    <form.Form>
      <Flexbox flexDirection='column'>
        <TextField {...fields.fullName} />
        <TextField {...fields.nickname} />

        <Typography>{fields.colors.label}</Typography>
        <Typography variant='caption'>{fields.colors.helperText}</Typography>
        {fields.colors.items.map((item, index) => {
          return (
            <Flexbox key={item.key}>
              <TextField {...item.color} />
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

export { ListField }
