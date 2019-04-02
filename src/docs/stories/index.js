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
import { DeepNestedFields } from './material/DeepNestedFields'
import { PassThroughField } from './material/PassThroughField'
import { ListField } from './material/ListField'

const submitLog = name => {
  return {
    submit: values => console.log(name, values.toJS()),
  }
}

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
  .add('Simple Form', () => <SimpleForm {...submitLog('SimpleForm')} />)
  .add('Optional Fields', () => <SimpleFormOptionalFields {...submitLog('SimpleFormOptionalFields')} />)
  .add('Customize optional field prompt', () => <CustomizeOptionalPrompt {...submitLog('CustomizeOptionalPrompt')} />)
  .add('Field level validation', () => <FieldValidation {...submitLog('FieldValidation')} />)
  .add('Field input normalize', () => <FieldNormalize {...submitLog('FieldNormalize')} />)
  .add('Custom Helper Text', () => <HelperText {...submitLog('HelperText')} />)
  .add('Custom Required Field Message', () => <CustomRequiredMessage {...submitLog('CustomRequiredMessage')} />)
  .add('Boolean field', () => <BooleanToggle {...submitLog('BooleanToggle')} />)
  .add('Number field', () => <NumberField {...submitLog('NumberField')} />)
  .add('Select field', () => <SelectField {...submitLog('SelectField')} />)
  .add('Radio field', () => <RadioField {...submitLog('RadioField')} />)
  .add('Object field', () => <PassThroughField {...submitLog('PassThroughField')} />)
  .add('List Field', () => <ListField {...submitLog('ListField')} />)
  .add('Initial values passed into form', () => <InitialValuesSet initialValues={fromJS({ fullName: 'Samuel Tarley', nickname: 'Sam' })} {...submitLog('InitialValuesSet')} />)
  .add('Initial values lazy loaded', () => (
    <BrixProvider value={Map()}>
      <InitialValuesAsync />
    </BrixProvider>
  ))
  .add('Dynamic fields', () => <DynamicFields {...submitLog('DynamicFields')} />)
  .add('Nested Fields', () => <DeepNestedFields {...submitLog('DeepNestedFields')} />)
