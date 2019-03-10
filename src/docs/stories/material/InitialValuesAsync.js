import React from 'react'
import { TextField, Button } from '@material-ui/core'
import Flexbox from 'flexbox-react'
import { useForm } from '../../../form'


const InitialValuesAsync = ({ initialValues }) => {
  const form = useForm({
    fields: [
      { name: 'fullName', label: 'Full Name' },
      { name: 'nickname', label: 'Nickname' },
    ],
    initialValues,
  })

  return (
    <form.Form>
      <Flexbox flexDirection='column'>
        TODO
        <TextField {...form.fullName} />
        <TextField {...form.nickname} />
      </Flexbox>
      <Button type='sumit' onClick={form.submit}>Submit</Button>
    </form.Form>
  )
}

export { InitialValuesAsync }
