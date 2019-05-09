import React from 'react'
import { TextField, Button, List, ListItem, ListItemText, ListItemSecondaryAction, Checkbox } from '@material-ui/core'
import Flexbox from 'flexbox-react'
import { useForm } from '../../../form'

const FormStateResolvers = ({ submit }) => {
  const [fields, form] = useForm({
    fields: [
      { name: 'fullName', label: 'Full Name' },
      { name: 'nickname', label: 'Nickname' },
    ],
    submit,
  })

  const isPristine = form.getIsPristine()
  const anyTouched = form.getAnyTouched()

  return (
    <Flexbox flexDirection='column' alignItems='flex-start'>
      <form.Form>
        <Flexbox flexDirection='column'>
          <TextField {...fields.fullName} />
          <TextField {...fields.nickname} />
        </Flexbox>
        <Button type='submit' disabled={isPristine} onClick={form.submit}>Submit</Button>
      </form.Form>
      <List>
        <ListItem>
          <ListItemText>isPristine</ListItemText>
          <ListItemSecondaryAction>
            <Checkbox checked={isPristine} disabled />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemText>anyTouched</ListItemText>
          <ListItemSecondaryAction>
            <Checkbox checked={anyTouched} disabled />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </Flexbox>
  )
}

export { FormStateResolvers }
