import React from 'react'
import { Map } from 'immutable'
import { TextField, Button } from '@material-ui/core'
import Flexbox from 'flexbox-react'
import { useForm } from '../../../form'


const GetValidFormValues = ({ submit }) => {
  const [fields, form] = useForm({
    fields: [
      { name: 'fullName', label: 'Full Name' },
      { name: 'nickname', label: 'Nickname' },
    ],
  })

  return (
    <form.Form>
      <Flexbox flexDirection='column'>
        <TextField {...fields.fullName} />
        <TextField {...fields.nickname} />
      </Flexbox>
      <Button
        type='submit'
        onClick={() => {
          const values = form.getValuesIfFormValid()
          submit(values || Map([['valid', 'not!']]))
        }}
      >
        Get Values if form is valid
      </Button>
    </form.Form >
  )
}

export default GetValidFormValues
