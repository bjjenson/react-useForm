import React from 'react'
import { fromJS, Map } from 'immutable'
import { BrixProvider } from 'react-brix'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import { SimpleForm } from './material/SimpleForm'
import { SimpleFormOptionalFields } from './material/OptionalField'
import { FieldValidation } from './material/FieldValidation'
import { FieldNormalize } from './material/FieldNormalize'
import { HelperText } from './material/HelperText'
import { CustomRequiredMessage } from './material/CustomRequiredMessage'
import { BooleanToggle } from './material/BooleanToggle'
import { NumberField } from './material/NumberField'
import { SelectField } from './material/SelectField'
import { RadioField } from './material/RadioField'
import { InitialValuesSet } from './material/InitialValuesSet'
import { InitialValuesAsync } from './material/InitialValuesAsync'
import { CustomizeOptionalPrompt } from './material/CustomizeOptionalPrompt'
import { DynamicFields } from './material/DynamicFields'

storiesOf('Material-UI', module)
  .addDecorator(withInfo)
  .addParameters({
    options: {
      showPanel: false,
    },
    info: {
      inline: true,
      header: false,
    },
  })
  .add('Simple Form', () => <SimpleForm />)
  .add('Optional Fields', () => <SimpleFormOptionalFields />)
  .add('Customize optional field prompt', () => <CustomizeOptionalPrompt />)
  .add('Field level validation', () => <FieldValidation />)
  .add('Field input normalize', () => <FieldNormalize />)
  .add('Custom Helper Text', () => <HelperText />)
  .add('Custom Required Field Message', () => <CustomRequiredMessage />)
  .add('Boolean field', () => <BooleanToggle />)
  .add('Number field', () => <NumberField />)
  .add('Select field', () => <SelectField />)
  .add('Radio field', () => <RadioField />)
  .add('Initial values passed into form', () => <InitialValuesSet initialValues={fromJS({ fullName: 'Samuel Tarley', nickname: 'Sam' })} />)
  .add('Initial values lazy loaded', () => (
    <BrixProvider value={Map()}>
      <InitialValuesAsync />
    </BrixProvider>
  ))
  .add('Dynamic fields', () => <DynamicFields />)
