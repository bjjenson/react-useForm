import React from 'react'
import { TextField, Button, FormControlLabel, Switch } from '@material-ui/core'
import Flexbox from 'flexbox-react'
import { useForm } from '../../../form'


const BooleanToggle = ({ submit }) => {
  const SwitchField = ({ label, error, helperText, ...rest }) => {
    return (
      <FormControlLabel
        control={(
          <Switch
            {...rest}
          />
        )}
        label={label}
      />
    )
  }

  const [fields, form] = useForm({
    fields: [
      { name: 'fullName', label: 'Full Name' },
      { name: 'nickname', label: 'Nickname' },
      { name: 'isAdmin', label: 'Administrator', type: 'boolean' },
    ],
    submit,
  })

  return (
    <form.Form>
      <Flexbox flexDirection='column'>
        <TextField {...fields.fullName} />
        <TextField {...fields.nickname} />
        <SwitchField {...fields.isAdmin} />
      </Flexbox>
      <Button type='submit' onClick={form.submit}>Submit</Button>
    </form.Form>
  )
}

export { BooleanToggle }
