import React from 'react'
import { fromJS } from 'immutable'
import { Button, Typography } from '@material-ui/core'
import Flexbox from 'flexbox-react'
import { createMemoryForm } from '../../../form'

const cannotBeBlue = value => {
  if (value === 'blue') return 'cannot be blue'
}

const cannotBeLight = value => {
  if (value === 'light') return 'cannot be light'
}

const mustHaveTwo = value => {
  if (value.size < 2) {
    return 'Must have at least two'
  }
}

const initialValues = fromJS({
  nickname: 'nick',
  colors: [
    { color: 'blue' },
  ],
})

const SimpleForm = () => {
  const { validate } = createMemoryForm({
    fields: [
      { name: 'fullName', label: 'Full Name', validate: () => 'bob' },
      { name: 'nickname', label: 'Nickname' },
      {
        name: 'colors', label: 'Favorite Colors', type: 'list', validate: mustHaveTwo, fields: [
          { name: 'color', label: 'Color', validate: cannotBeBlue },
          {
            name: 'shades', type: 'list', fields: [
              { name: 'shade', label: 'Shade', validate: cannotBeLight },
            ],
          },
        ],
      },
    ],
    initialValues,
  })

  const handleValidate = () => {
    const result = validate()
    console.log('validation errors', JSON.stringify(result, null, '  '))
  }

  return (
    <Flexbox flexDirection='column'>
      <Typography>See console for validation output</Typography>
      <Button onClick={handleValidate}>validate</Button>
    </Flexbox>
  )
}

export default SimpleForm
