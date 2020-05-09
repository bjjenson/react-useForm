import React from 'react'
import { fromJS } from 'immutable'
import { TextField, Button, Checkbox, FormControlLabel } from '@material-ui/core'
import Flexbox from 'flexbox-react'
import { useForm } from '../../../form'

const initial = fromJS({ fullName: 'Hank Williams', nickname: 'Henry', happy: 'true' })

const FormInitializedHandler = ({ submit }) => {
  const [fields, form] = useForm({
    fields: [
      { name: 'fullName', label: 'Full Name' },
      { name: 'nickname', label: 'Nickname' },
    ],
    submit,
    initialValues: initial,
    options: {
      initialized: ({ initialValues, addField }) => {
        console.log('initial', initialValues.toJS())
        if (initialValues.get('happy')) {
          addField({ name: 'happy', label: 'Happy', type: 'boolean' })
        }
      },
    },
  })
console.log('fields', fields)
  return (
    <form.Form id={form.id}>
      <Flexbox flexDirection='column'>
        <TextField {...fields.fullName} />
        <TextField {...fields.nickname} />
        {fields.happy && (
        <FormControlLabel
          label={fields.happy.label}
          control={<Checkbox checked={fields.happy.value} onChange={(e, checked) => fields.happy.onChange(checked)} />}
        />
)}
      </Flexbox>
      <Button type='submit' onClick={form.submit}>Submit</Button>
    </form.Form>
  )
}

export default FormInitializedHandler
