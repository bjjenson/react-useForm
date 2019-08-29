import React from 'react'
import { fromJS, Map } from 'immutable'
import { BrixProvider } from 'react-brix'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import { BooleanToggle } from './material/BooleanToggle'
import { CustomizeOptionalPrompt } from './material/CustomizeOptionalPrompt'
import { CustomRequiredMessage } from './material/CustomRequiredMessage'
import { DeepNestedFields } from './material/DeepNestedFields'
import { DynamicFields } from './material/DynamicFields'
import { FieldNormalize } from './material/FieldNormalize'
import { FieldValidation } from './material/FieldValidation'
import { FormReset } from './material/FormReset'
import { FormStateResolvers } from './material/FormStateResolvers'
import { HelperText } from './material/HelperText'
import { InitialValuesAsync } from './material/InitialValuesAsync'
import { InitialValuesSet } from './material/InitialValuesSet'
import { ListField } from './material/ListField'
import ListOfListField from './material/ListOfListField'
import { NumberField } from './material/NumberField'
import { PassThroughField } from './material/PassThroughField'
import { PassThroughProps } from './material/PassThroughProps'
import { RadioField } from './material/RadioField'
import { SelectField } from './material/SelectField'
import { SimpleForm } from './material/SimpleForm'
import SaveNoValidate from './material/SaveNoValidate'
import { SimpleFormOptionalFields } from './material/OptionalField'
import OnFieldChangedHandler from './material/OnFieldChangedHandler'
import GetValidFormValues from './material/GetValidFormValues'
import NumberFieldValidation from './material/NumberFieldValidation'
import AddToListOnFieldChange from './material/AddToListOnFieldChange'

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
  .add('Number field validation normalized at 0', () => <NumberFieldValidation {...submitLog('NumberFieldValidation')} />)
  .add('Field input normalize', () => <FieldNormalize {...submitLog('FieldNormalize')} />)
  .add('Custom Helper Text', () => <HelperText {...submitLog('HelperText')} />)
  .add('Custom Required Field Message', () => <CustomRequiredMessage {...submitLog('CustomRequiredMessage')} />)
  .add('Save without validation', () => <SaveNoValidate {...submitLog('SaveNoValidate')} />)
  .add('Boolean field', () => <BooleanToggle {...submitLog('BooleanToggle')} />)
  .add('Number field', () => <NumberField {...submitLog('NumberField')} />)
  .add('Select field', () => <SelectField {...submitLog('SelectField')} />)
  .add('Radio field', () => <RadioField {...submitLog('RadioField')} />)
  .add('Object field', () => <PassThroughField {...submitLog('PassThroughField')} />)
  .add('List Field', () => <ListField {...submitLog('ListField')} />)
  .add('List of Lists Field', () => <ListOfListField {...submitLog('ListOfListField')} />)
  .add('Modify list on field change', () => <AddToListOnFieldChange {...submitLog('Modify list on field change')} />)
  .add('Initial values passed into form', () => <InitialValuesSet initialValues={fromJS({ fullName: 'Samuel Tarley', nickname: 'Sam' })} {...submitLog('InitialValuesSet')} />)
  .add('Initial values lazy loaded', () => (
    <BrixProvider value={Map()}>
      <InitialValuesAsync {...submitLog('InitialValues Lazy loaded')} />
    </BrixProvider>
  ))
  .add('Dynamic fields', () => <DynamicFields {...submitLog('DynamicFields')} />)
  .add('Nested Fields', () => <DeepNestedFields {...submitLog('DeepNestedFields')} />)
  .add('Using Form State Resolvers', () => <FormStateResolvers {...submitLog('FormStateResolvers')} />)
  .add('Form Reset', () => <FormReset {...submitLog('FormReset')} />)
  .add('Pass through field props', () => <PassThroughProps {...submitLog('PassThroughProps')} />)
  .add('Listen to field changed', () => <OnFieldChangedHandler {...submitLog('OnFieldChangedHandler')} />)
  .add('Get submit values directly', () => <GetValidFormValues {...submitLog('GetValidFormValues')} />)
