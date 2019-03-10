import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import { SimpleForm } from './material/SimpleForm'
import { SimpleFormOptionalFields } from './material/OptionalField'
import { FieldValidation } from './material/FieldValidation'
import { FieldNormalize } from './material/FieldNormalize'
import { HelperText } from './material/HelperText'
import { CustomRequiredMessage } from './material/CustomRequiredMessage'
import { BooleanToggle } from './material/BooleanToggle'

storiesOf('Material-UI', module)
  .addDecorator(withInfo)
  .addParameters({ options: { showPanel: false }, info: { inline: true, header: false } })
  .add('Simple Form', () => <SimpleForm />)
  .add('Optional Fields', () => <SimpleFormOptionalFields />)
  .add('Field level validation', () => <FieldValidation />)
  .add('Field input normalize', () => <FieldNormalize />)
  .add('Custom Helper Text', () => <HelperText />)
  .add('Custom Required Field Message', () => <CustomRequiredMessage />)
  .add('Boolean field', () => <BooleanToggle />)
