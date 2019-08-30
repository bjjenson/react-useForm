import React from 'react'
import { TextField, Button, Typography, FormHelperText } from '@material-ui/core'
import Flexbox from 'flexbox-react'
import { useForm } from '../../../form'


const SimpleForm = ({ submit }) => {
  const [fields, form] = useForm({
    fields: [
      { name: 'fullName', label: 'Full Name' },
      { name: 'nickname', label: 'Nickname' },
      {
        name: 'colors', label: 'Favorite Colors', type: 'list', fields: [
          { name: 'color', label: 'Color' },
          {
            name: 'shades', type: 'list', fields: [
              { name: 'shade', label: 'Shade' },
            ],
          },
        ],
      },
    ],
    submit,
  })

  const handleValidate = () => {
    const errors = form.validate()
    console.log('validation errors', JSON.stringify(errors, null, '  '))
  }

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
      <Button onClick={handleValidate}>validate</Button>
    </form.Form>
  )
}

export default SimpleForm
