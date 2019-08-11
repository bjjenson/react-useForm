import React from 'react'
import { fromJS } from 'immutable'
import { TextField, Button, Typography, FormHelperText, FormControlLabel, Checkbox } from '@material-ui/core'
import Flexbox from 'flexbox-react'
import { useForm } from '../../../form'

const initialValues = fromJS({
  colors: [
    { color: '' },
    { color: 'Blue' },
  ],
})

const ModifyList = ({ submit }) => {
  const [fields, form] = useForm({
    fields: [
      { name: 'fullName', label: 'Full Name' },
      { name: 'nickname', label: 'Nickname' },
      { name: 'like', label: 'Do you like colors?', type: 'boolean', value: true },
      {
        name: 'colors', label: 'Favorite Colors', type: 'list', fields: [
          { name: 'color', label: 'Color' },
        ],
      },
    ],
    submit,
    initialValues,
    options: {
      logPerformance: true,
    },
  })

  const handleLikeChanged = e => {
    if (e.target.checked) {
      fields.colors.add()
    } else {
      let index = fields.colors.items.length - 1
      while (index >= 0) {
        fields.colors.remove(index)
        index--
      }
    }
    fields.like.onChange(e)
  }

  return (
    <form.Form>
      <Flexbox flexDirection='column'>
        <TextField {...fields.fullName} />
        <TextField {...fields.nickname} />
        <FormControlLabel
          control={
            <Checkbox checked={fields.like.value} onChange={handleLikeChanged} />
          }
          label={fields.like.label}
        />
        <Typography>{fields.colors.label}</Typography>
        <FormHelperText error={fields.colors.error}>{fields.colors.helperText}</FormHelperText>
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

export default ModifyList
