import React from 'react'
import { TextField } from '@material-ui/core'
import Flexbox from 'flexbox-react'
import { useForm } from '../../../form'


const BasicForm = () => {
  const form = useForm({
    fields: [
      { name: 'fullName', label: 'Full Name' },
      { name: 'nickname', label: 'Nickname' },
    ],
  })

  return (
    <form.Form>
      <Flexbox flexDirection='column'>
        <TextField {...form.fullName} />
        <TextField {...form.nickname} />
      </Flexbox>
    </form.Form>
  )
}

export { BasicForm }
