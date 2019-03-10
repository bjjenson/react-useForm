import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import { BasicForm } from './basic/form'

storiesOf('Material-UI', module)
  .addDecorator(withInfo)
  .addParameters({ info: { inline: true, header: false } })
  .add('Basic', () => <BasicForm />)
