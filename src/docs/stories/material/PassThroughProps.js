import React from 'react'
import { TextField, Button } from '@material-ui/core'
import Flexbox from 'flexbox-react'
import { useForm } from '../../../form'


const PassThroughProps = ({ submit }) => {
  const [fields, form] = useForm({
    fields: [
      { name: 'fullName', label: 'Full Name', passThrough: { key: 'fullNameKey', style: { background: '#BFE' } } },
      { name: 'nickname', label: 'Nickname', passThrough: { key: 'nicknameKey' } },
    ],
    submit,
  })

  return (
    <form.Form>
      <Flexbox flexDirection='column'>
        {Object.values(fields).map(field => (
          <TextField {...field} /> // eslint-disable-line
        ))}
      </Flexbox>
      <Button type='submit' onClick={form.submit}>Submit</Button>
    </form.Form>
  )
}

export { PassThroughProps }
