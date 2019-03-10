import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import { TextField } from '@material-ui/core'
import Flexbox from 'flexbox-react'
import { useForm } from '../../../form'

storiesOf('Test', module)
  .addDecorator(withInfo)
  .addParameters({ info: { inline: true, header: false } })
  .add('Basic', () => {
    const BasicForm = () => {
      const form = useForm({
        fields: [
          { name: 'fullName', label: 'Full Name' },
          { name: 'nickname', label: 'Nickname' },
        ],
      })

      return (
        <form.Form>
          <Flexbox flexDirection='column'>
            <TextField {...form.fullName} />
            <TextField {...form.nickname} />
          </Flexbox>
        </form.Form>
      )
    }
    return () => BasicForm()
  })
