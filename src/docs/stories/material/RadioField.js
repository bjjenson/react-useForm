import React from 'react'
import { TextField, Button, FormControl, FormHelperText, FormLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core'
import Flexbox from 'flexbox-react'
import { useForm } from '../../../form'

const RadioField = () => {
  const RadioComponent = ({ value, onChange, helperText, error, label, options }) => { //eslint-disable-line
    return (
      <FormControl component='fieldset' error={error} style={{ marginTop: '16px' }}>
        <FormLabel component='legend'>{label}</FormLabel>
        <RadioGroup
          value={value}
          onChange={onChange}
        >
          {options.map(o => (
            <FormControlLabel key={o.value} value={o.value} control={<Radio />} label={o.label} />
          ))}
        </RadioGroup>
        <FormHelperText>{helperText}</FormHelperText>
      </FormControl>
    )
  }

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ]

  const form = useForm({
    fields: [
      { name: 'fullName', label: 'Full Name' },
      { name: 'nickname', label: 'Nickname' },
      { name: 'gender', label: 'Gender', type: 'select', options: genderOptions },
    ],
  })

  return (
    <form.Form>
      <Flexbox flexDirection='column'>
        <TextField {...form.fullName} />
        <TextField {...form.nickname} />
        <RadioComponent {...form.gender} />
      </Flexbox>
      <Button type='sumit' onClick={form.submit}>Submit</Button>
    </form.Form>
  )
}

export { RadioField }
