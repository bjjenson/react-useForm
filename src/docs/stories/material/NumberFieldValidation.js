import React from 'react'
import { TextField, Button } from '@material-ui/core'
import Flexbox from 'flexbox-react'
import { useForm } from '../../../form'
import { normalizeNumber } from '../helpers/normalizeNumber'

export const validateGreaterThanZero = value => {
  const num = Number(value)
  if (num === 0) return 'Must be greater than 0'

  return ''
}

const NumberFieldValidation = ({ submit }) => {
  const [fields, form] = useForm({
    fields: [
      { name: 'fullName', label: 'Full Name' },
      { name: 'nickname', label: 'Nickname', optional: true },
      { name: 'age', label: 'Age', type: 'number', normalize: normalizeNumber, validate: validateGreaterThanZero },
    ],
    submit,
  })

  return (
    <form.Form>
      <Flexbox flexDirection='column'>
        <TextField {...fields.fullName} />
        <TextField {...fields.nickname} />
        <TextField {...fields.age} type='number' />
      </Flexbox>
      <Button type='submit' onClick={form.submit}>Submit</Button>
    </form.Form>
  )
}

export default NumberFieldValidation
