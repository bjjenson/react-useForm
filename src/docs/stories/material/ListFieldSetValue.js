import React from 'react'
import PropTypes from 'prop-types'
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

const ListFieldSetValue = ({ submit }) => {
  const [fields, form] = useForm({
    fields: [
      {
        name: 'colors', label: 'Favorite Colors', type: 'list', fields: [
          { name: 'color', label: 'Color' },
        ],
      },
    ],
    submit,
    initialValues,
  })

  const handleSetList = ()=> {
    form.setValue('colors', fromJS([{color: 'Purple'},{color: 'Yellow'}]))
  }

  return (
    <form.Form>
      <Flexbox flexDirection='column'>
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
        <Button onClick={handleSetList}>Replace List</Button>

      </Flexbox>
      <Button type='submit' onClick={form.submit}>Submit</Button>
    </form.Form>
  )
}

ListFieldSetValue.propTypes = {
  submit: PropTypes.func.isRequired,
}

export default ListFieldSetValue
