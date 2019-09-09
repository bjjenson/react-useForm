import React from 'react'
import { TextField, Button } from '@material-ui/core'
import Flexbox from 'flexbox-react'
import { useForm } from '../../../form'

const CustomRequiredMessage = ({ submit }) => {
  const [fields, form] = useForm({
    fields: [
      { name: 'fullName', label: 'Full Name', requiredMessage: 'Name must be filled out' },
      { name: 'nickname', label: 'Nickname', optional: true },
      { name: 'phone', label: 'Phone', requiredMessage: 'Phone must be filled out' },
    ],
    submit,
  })

  return (
    <form.Form>
      <Flexbox flexDirection='column'>
        <TextField {...fields.fullName} />
        <TextField {...fields.nickname} />
        <TextField {...fields.phone} />
      </Flexbox>
      <Button type='submit' onClick={form.submit}>Submit</Button>
    </form.Form>
  )
}

export { CustomRequiredMessage }
