import React from 'react'
import { TextField, Button, FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@material-ui/core'
import Flexbox from 'flexbox-react'
import { useForm } from '../../../form'

// eslint-disable-next-line
const ComplexListItems = ({ submit }) => {
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

  const [fields, form] = useForm({
    fields: [
      {
        name: 'people',
        type: 'list',
        fields: [
          {
            name: 'role',
            label: 'Role',
            type: 'select',
            options: [{ label: 'Employee', value: 'employee' }, {label: 'Customer', value: 'customer'}],
          },
          {
            name: 'profile.firstName',
            label: 'First Name',
            type: 'string',
          },
          {
              name: 'profile.lastName',
              label: 'Last Name',
              type: 'string',
          },
        ],
      },
    ],
    submit,
  })

  return (
    <form.Form>
      <Flexbox flexDirection='column'>
        <Button onClick={() => fields.people.add()}>Add</Button>
        <Flexbox flexDirection='column'>
          {fields.people.items.map((item, index) => {
          return (
            <Flexbox key={item.key}>
              <SelectComponent {...item.role}/>
              <TextField {...item['profile.firstName']} />
              <TextField {...item['profile.lastName']}/>
              <Button onClick={() => fields.people.remove(index)}>Remove</Button>
            </Flexbox>
          )
        })}
          <Button type='submit' onClick={form.submit}>Submit</Button>
        </Flexbox>
      </Flexbox>
    </form.Form>
  )
}

export { ComplexListItems }
