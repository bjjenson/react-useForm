import React, { useState } from 'react'
import { fromJS } from 'immutable'
import { withStyles, TextField, Button, Switch, FormControlLabel } from '@material-ui/core' // eslint-disable-line import/no-extraneous-dependencies
import { useForm } from '../../../form'
import { normalizePhone } from './normalizePhone'
import RadioField from './RadioField'
import { validateForm, validatePhone } from './validate'

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

const useInitialValues = () => {
  const values = fromJS({
    isAlive: true,
    first: 'Paul',
  })
  return values
}

const getColorField = i => ({ name: `color${i}`, label: `Color ${i + 1}` })

const Address = ({ classes }) => {
  const [colorCount, setColorCount] = useState(0)
  const initialValues = useInitialValues()

  const [fields, form] = useForm({
    fields: [
      { name: 'first', label: 'First' },
      { name: 'middle', label: 'Middle', optional: true },
      { name: 'last', label: 'Last' },
      { name: 'mobile', label: 'Mobile', normalize: normalizePhone, validate: validatePhone },
      { name: 'isAlive', label: 'IsAlive', type: 'boolean' },
      { name: 'gender', label: 'Gender', type: 'select', options: genderOptions },
    ],
    submit: values => console.log('submitting', values),
    validate: validateForm,
    initialValues,
  })

  const colorFields = () => {
    const fields = []
    for (let i = 0; i < colorCount; i++) {
      const key = `color${i}`
      if (form[key]) {
        fields.push(
          <div key={key}>
            <TextField {...fields[key]} />
            <Button onClick={() => form.removeField(key)}>X</Button>
          </div>
        )
      }
    }
    return fields
  }

  const addColor = () => {
    form.addField(getColorField(colorCount))
    setColorCount(colorCount + 1)
  }

  return (
    <div>
      Form test (material-ui)
      <form.Form className={classes.root}>
        <TextField {...fields.first} />
        <TextField {...fields.middle} />
        <TextField {...fields.last} />
        <TextField {...fields.mobile} />
        <RadioField {...fields.gender} />
        <SwitchField {...fields.isAlive} />
        {colorFields()}
        <Button onClick={addColor}>more</Button>
        <Button type='submit' onClick={form.submit}>Submit</Button>
      </form.Form>
    </div>
  )
}


const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 300,
    padding: 8,
  },
}

export default withStyles(styles)(Address)

const genderOptions = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
]
