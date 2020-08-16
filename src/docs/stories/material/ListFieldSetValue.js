import React from 'react'
import PropTypes from 'prop-types'
import { fromJS } from 'immutable'
import { TextField, Button, Typography, FormHelperText } from '@material-ui/core'
import Flexbox from 'flexbox-react'
import { useForm } from '../../../form'

const initialValues = fromJS({
  data: {
    colors: [
      { color: 'Red' },
      { color: 'Green' },
      { color: 'Blue' },
    ],
  },
})

const ListFieldSetValue = ({ submit }) => {
  const [fields, form] = useForm({
    fields: [
      {
        name: 'data.colors', label: 'Favorite Colors', type: 'list', fields: [
          { name: 'color', label: 'Color' },
        ],
      },
    ],
    submit,
    initialValues,
  })

  const handleSetList = ()=> {
    form.setValue('data.colors', fromJS([{color: 'Purple'},{color: 'Yellow'}]))
  }

  return (
    <form.Form>
      <Flexbox flexDirection='column'>
        <Typography>{fields['data.colors'].label}</Typography>
        <FormHelperText error={fields['data.colors'].error}>{fields['data.colors'].helperText}</FormHelperText>
        {fields['data.colors'].items.map((item, index) => {
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
