import React from 'react'
import { Map } from 'immutable'
import { TextField, Button } from '@material-ui/core'
import Flexbox from 'flexbox-react'
import { useForm } from '../../../form'

const FormReset = ({ submit }) => {
  const [fields, form] = useForm({
    fields: [
      { name: 'fullName', label: 'Full Name' },
      { name: 'nickname', label: 'Nickname' },
    ],
    initialValues: Map({
      fullName: 'Bob',
    }),
    submit,
  })

  return (
    <form.Form>
      <Flexbox flexDirection='column'>
        <TextField {...fields.fullName} />
        <TextField {...fields.nickname} />
      </Flexbox>
      <Button type='submit' onClick={form.submit}>Submit</Button>
      <Button onClick={form.reset}>Reset</Button>
    </form.Form>
  )
}

export { FormReset }
