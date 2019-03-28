import React from 'react'
import { fromJS } from 'immutable'
import { TextField, Button } from '@material-ui/core'
import Flexbox from 'flexbox-react'
import { useForm } from '../../../form'

const initialValues = fromJS({
  fullName: 'Sammy Boyle',
  nickname: 'Sam',
  address: {
    street1: '124 N Main st',
  },
})

const DeepNestedFields = () => {
  const [fields, form] = useForm({
    fields: [
      { name: 'fullName', label: 'Full Name' },
      { name: 'nickname', label: 'Nickname' },
      { name: 'address.street1', label: 'Street1' },
    ],
    initialValues,
    submit: values => console.log('saving', values.toJS()),
  })
  return (
    <form.Form>
      <Flexbox flexDirection='column'>
        <TextField {...fields.fullName} />
        <TextField {...fields.nickname} />
        <TextField {...fields['address.street1']} />
      </Flexbox>
      <Button type='submit' onClick={form.submit}>Submit</Button>
    </form.Form>
  )
}

export { DeepNestedFields }
