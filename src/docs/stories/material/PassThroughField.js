import React from 'react'
import { fromJS } from 'immutable'
import { TextField, Button } from '@material-ui/core'
import Flexbox from 'flexbox-react'
import { useForm } from '../../../form'
import ChipField from '../helpers/ChipField'

const PassThroughField = () => {
  const [fields, form] = useForm({
    fields: [
      { name: 'fullName', label: 'Full Name' },
      { name: 'nickname', label: 'Nickname' },
      { name: 'nested.colors', label: 'Favorite Colors', type: 'object', valueFromChange: v => v, value: fromJS(['Red']) },
    ],
    submit: values => console.log('saving', values.toJS()),
  })

  return (
    <form.Form>
      <Flexbox flexDirection='column'>
        <TextField {...fields.fullName} />
        <TextField {...fields.nickname} />
        <ChipField {...fields['nested.colors']} />
      </Flexbox>
      <Button type='submit' onClick={form.submit}>Submit</Button>
    </form.Form>
  )
}

export { PassThroughField }

