import React, { useState } from 'react'
import { TextField, Button, Select, FormControl, InputLabel, MenuItem, FormHelperText, Typography } from '@material-ui/core'
import Flexbox from 'flexbox-react'
import { useForm } from '../../../form'

const OnFieldChangedHandler = ({ submit }) => {
  const SelectComponent = ({
    label,
    error,
    value,
    helperText,
    children,
    options,
    ...rest
  }) => {

    return (
      <FormControl>
        {label && <InputLabel error={error}>{label}</InputLabel>}
        <Select
          value={value}
          {...rest}
          error={error}
        >
          {options.map((option) => {
            return <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
          })}
        </Select>
        <FormHelperText error={error}>{helperText}</FormHelperText>
      </FormControl>
    )
  }

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ]
  const [gender, setGender] = useState('')
  const [fields, form] = useForm({
    fields: [
      { name: 'fullName', label: 'Full Name' },
      { name: 'nickname', label: 'Nickname' },
      { name: 'gender', label: 'Gender', type: 'select', options: genderOptions },
    ],
    submit,
    options: {
      listeners: {
        gender: value => {
          setGender(value)
        },
      },
    },
  })

  // form.addFieldListener('gender', value => {
  //   setGender(value)
  // })

  return (
    <form.Form>
      {gender ? (
        <Typography>{`Gender is ${gender}`}</Typography>
      ) :
        (
          <Typography>Listening for gender updates</Typography>
        )
      }

      <Flexbox flexDirection='column'>
        <TextField {...fields.fullName} />
        <TextField {...fields.nickname} />
        <SelectComponent {...fields.gender} />
      </Flexbox>

      <Button type='submit' onClick={form.submit}>Submit</Button>
    </form.Form>
  )
}

export default OnFieldChangedHandler
