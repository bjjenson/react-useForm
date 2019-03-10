import React from 'react'
import { TextField, Button, FormControlLabel, Switch } from '@material-ui/core'
import Flexbox from 'flexbox-react'
import { useForm } from '../../../form'


const BooleanToggle = () => {
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

  const form = useForm({
    fields: [
      { name: 'fullName', label: 'Full Name' },
      { name: 'nickname', label: 'Nickname' },
      { name: 'isAdmin', label: 'Administrator', type: 'boolean' },
    ],
  })

  return (
    <form.Form>
      <Flexbox flexDirection='column'>
        <TextField {...form.fullName} />
        <TextField {...form.nickname} />
        <SwitchField {...form.isAdmin} />
      </Flexbox>
      <Button type='sumit' onClick={form.submit}>Submit</Button>
    </form.Form>
  )
}

export { BooleanToggle }
