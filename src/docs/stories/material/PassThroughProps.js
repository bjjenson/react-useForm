import React from 'react'
import PropTypes from 'prop-types'
import { fromJS } from 'immutable'
import { TextField, Button } from '@material-ui/core'
import Flexbox from 'flexbox-react'
import { useForm } from '../../../form'

const initialValues = fromJS({
  colors: [
    { color: 'Red' },
    { color: 'Blue' },
  ],
})


const PassThroughProps = ({ submit }) => {
  const [fields, form] = useForm({
    fields: [
      { name: 'fullName', label: 'Full Name', passThrough: { key: 'fullNameKey', style: { background: '#BFE' } } },
      { name: 'nickname', label: 'Nickname', passThrough: { key: 'nicknameKey' } },
      {
        name: 'colors', label: 'Favorite Colors', type: 'list', fields: [
          { name: 'color', label: 'Color', passThrough: { style: { background: '#BFE' } } },
        ],
      },
    ],
    submit,
    initialValues,
  })

  return (
    <form.Form>
      <Flexbox flexDirection='column'>
        <TextField {...fields.fullName} />
        <TextField {...fields.nickname} />
        {fields.colors.items.map((item) => {
          return (
            <Flexbox key={item.key}>
              <TextField {...item.color} />
            </Flexbox>
          )
        })}
      </Flexbox>
      <Button type='submit' onClick={form.submit}>Submit</Button>
    </form.Form>
  )
}

PassThroughProps.propTypes = {
  submit: PropTypes.func.isRequired,
}

export { PassThroughProps }
