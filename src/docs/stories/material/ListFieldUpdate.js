import React from 'react'
import { fromJS } from 'immutable'
import { TextField, Button, Typography, FormHelperText } from '@material-ui/core'
import Flexbox from 'flexbox-react'
import { useForm } from '../../../form'

const initialValues = fromJS({
  colors: [
    { color: 'Red' },
    { color: 'Green' },
    { color: 'Blue' },
  ],
})

const ListFieldUpdate = ({ submit }) => {
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

  const handleRearrange = ()=> {
    // fields.colors.update(fields.colors.items.sort((a,b)=> {
    //   const aColor = a.color.value
    //   const bColor = b.color.value

    //   if(aColor > bColor) return 1
    //   if(aColor < bColor) return -1
    //   return 0
    // }).map(item=> ({fields: {color: item.color.value}})))
    fields.colors.updateIndex(0,1)
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
              <TextField {...item.color} />
              <Button onClick={() => fields.colors.remove(index)}>X</Button>
            </Flexbox>
          )
        })}
        <Button onClick={handleRearrange}>Re arrange colors</Button>

      </Flexbox>
      <Button type='submit' onClick={form.submit}>Submit</Button>
    </form.Form>
  )
}

export default ListFieldUpdate
