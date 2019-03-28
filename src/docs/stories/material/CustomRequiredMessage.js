import React from 'react'
import { TextField, Button } from '@material-ui/core'
import Flexbox from 'flexbox-react'
import { useForm } from '../../../form'

const CustomRequiredMessage = () => {
  const [fields, form] = useForm({
    fields: [
      { name: 'fullName', label: 'Full Name', requiredMessage: 'Name is Required' },
      { name: 'nickname', label: 'Nickname', optional: true },
      { name: 'phone', label: 'Phone', requiredMessage: 'Phone is Required' },
    ],
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
