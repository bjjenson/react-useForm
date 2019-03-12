# react-hooks-useform

`react-hooks-useform` implements React hooks to enable an complete, lightweight form implementation for React.
It works best with Material-UI components but can be used with native react inputs as well.

## Installation

`npm install --save react-hooks-useform`

`yarn add react-hooks-useform`

## Documentation

`const [fieldProps, formProps] = useForm(formConfiguration)`

### formConfiguration
Prop|Type|Required|Description
----|----|--------|-----------
fields|Array<FormField>|Yes|Array of objects describing fieldConfiguration (see fieldConfiguration)
submit|Function|Yes|(values)=>void Function calls when submit is triggered on form.
validate|Function or Function[]|No| Called each time the form validates
initialValues| Map<String, any>|No| Values to populate form fields.  Can be lazy loaded.
options|FormOptions|No|optional configurations
### fieldConfiguration
Prop|Type|Required|Description
----|----|--------|-----------
name|String|Yes|Name of the field. Will be used to pull data from initialValues.
type|FieldTypes|No|Type of field data (text,boolean,select,number)
helperText|String|No|Helper/Error text associated with the field
optional|Boolean|No|Specifies if the field is optional or required for field validation
requiredMessage|String|No|Message to display when required field validation fails (Defaults to 'Required')
label|String|No|Label to display with the field
normalize|Function|No|Normlalization function during onChange event to normalize data such as numbers/phones etc.
value|any|No|Initial value used by the field (default: "")
validate|(value: T, fieldName: String, getValues: () => IValues) => String|No|Validation function for field level validation. Can be combined with Form level validation.
options|Array<ISelectOptions>|No|Pass through options if `type` is _select_
valueFromTarget|(target: Object) => T|No|Helper function used if onChange handler needs to provide a value other than `event.target.value`
### fieldProps Object
Prop|Type|Description
----|----|-----------
error|Boolean|True if error exists on field, otherwise false
helperText|String|Helper or error text
label|String|Label provided by fieldConfiguration, Formatted as `${label} (optional)` if field configured as an optional field.  This can be customized in FormOptions
value|any|Controlled value of the field
onBlur|Function|Event triggered upon input blur
onChange|Function|Event triggered upon input change
### formProps Object
Prop|Type|Description
----|----|-----------
Form|React.Component|Component used to wrap the form inputs
submit|Function|Function to invoke when form should be submitted.  Will trigger validation and if successful, trigger `formConfiguration.submit`
addField|(field: fieldConfiguration) => void|Call to add a new field dynamically to the form
removeField|(fieldName: String) => void|Call to remove a field dynamically form the form
### fieldConfiguration
Prop|Type|Required|Description
----|----|--------|-----------
optionalLabelFormatter|(label: String) => String|No|Function invoked to format labels for fields that are configured as optional
### Examples
_The following examples utilize Material-UI inputs_
#### Simple Form
```
const SimpleForm = () => {
  const [fields, form] = useForm({
    fields: [
      { name: 'fullName', label: 'Full Name' },
      { name: 'nickname', label: 'Nickname' },
    ],
  })

  return (
    <form.Form>
      <Flexbox flexDirection='column'>
        <TextField {...fields.fullName} />
        <TextField {...fields.nickname} />
      </Flexbox>
      <Button type='sumit' onClick={form.submit}>Submit</Button>
    </form.Form>
  )
}

export { SimpleForm }
```
#### Optional Fields
```
const SimpleFormOptionalFields = () => {
  const [fields, form] = useForm({
    fields: [
      { name: 'fullName', label: 'Full Name' },
      { name: 'nickname', label: 'Nickname', optional: true },
    ],
  })

  return (
    <form.Form>
      <Flexbox flexDirection='column'>
        <TextField {...fields.fullName} />
        <TextField {...fields.nickname} />
      </Flexbox>
      <Button type='sumit' onClick={form.submit}>Submit</Button>
    </form.Form>
  )
}

export { SimpleFormOptionalFields }
```
#### Customize optional field prompt
```
const CustomizeOptionalPrompt = () => {
  const [fields, form] = useForm({
    fields: [
      { name: 'fullName', label: 'Full Name' },
      { name: 'nickname', label: 'Nickname', optional: true },
    ],
    options: {
      optionalLabelFormatter: label => `${label} - not required`,
    },
  })

  return (
    <form.Form>
      <Flexbox flexDirection='column'>
        <TextField {...fields.fullName} />
        <TextField {...fields.nickname} />
      </Flexbox>
      <Button type='sumit' onClick={form.submit}>Submit</Button>
    </form.Form>
  )
}

export { CustomizeOptionalPrompt }
```
#### Field level validation
```
const FieldValidation = () => {
  const [fields, form] = useForm({
    fields: [
      { name: 'fullName', label: 'Full Name' },
      { name: 'nickname', label: 'Nickname', optional: true },
      { name: 'phone', label: 'Phone', validate: validatePhone },
    ],
  })

  return (
    <form.Form>
      <Flexbox flexDirection='column'>
        <TextField {...fields.fullName} />
        <TextField {...fields.nickname} />
        <TextField {...fields.phone} />
      </Flexbox>
      <Button type='sumit' onClick={form.submit}>Submit</Button>
    </form.Form>
  )
}

export { FieldValidation }
```
#### Field input normalize
```
const normalizePhone = input => {
  let normalizedPhone
  ...
  return normalizedPhone
}

const FieldNormalize = () => {
  const [fields, form] = useForm({
    fields: [
      { name: 'fullName', label: 'Full Name' },
      { name: 'nickname', label: 'Nickname', optional: true },
      { name: 'phone', label: 'Phone', validate: validatePhone, normalize: normalizePhone },
    ],
  })

  return (
    <form.Form>
      <Flexbox flexDirection='column'>
        <TextField {...fields.fullName} />
        <TextField {...fields.nickname} />
        <TextField {...fields.phone} />
      </Flexbox>
      <Button type='sumit' onClick={form.submit}>Submit</Button>
    </form.Form>
  )
}

export { FieldNormalize }
```
#### Custom helper text
```
const HelperText = () => {
  const [fields, form] = useForm({
    fields: [
      { name: 'fullName', label: 'Full Name' },
      { name: 'nickname', label: 'Nickname', optional: true },
      { name: 'phone', label: 'Phone', helperText: 'Please enter a phone number' },
    ],
  })

  return (
    <form.Form>
      <Flexbox flexDirection='column'>
        <TextField {...fields.fullName} />
        <TextField {...fields.nickname} />
        <TextField {...fields.phone} />
      </Flexbox>
      <Button type='sumit' onClick={form.submit}>Submit</Button>
    </form.Form>
  )
}

export { HelperText }
```
#### Custom required field message
```
const CustomRequiredMessage = () => {
  const [fields, form] = useForm({
    fields: [
      { name: 'fullName', label: 'Full Name', requiredMessage: 'Name is Required' },
      { name: 'nickname', label: 'Nickname', optional: true },
      { name: 'phone', label: 'Phone', requiredMessage: 'Phone is Required' },
    ],
  })

  return (
    <form.Form>
      <Flexbox flexDirection='column'>
        <TextField {...fields.fullName} />
        <TextField {...fields.nickname} />
        <TextField {...fields.phone} />
      </Flexbox>
      <Button type='sumit' onClick={form.submit}>Submit</Button>
    </form.Form>
  )
}

export { CustomRequiredMessage }
```
#### Boolean field
```
const BooleanToggle = () => {
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

  const [fields, form] = useForm({
    fields: [
      { name: 'fullName', label: 'Full Name' },
      { name: 'nickname', label: 'Nickname' },
      { name: 'isAdmin', label: 'Administrator', type: 'boolean' },
    ],
  })

  return (
    <form.Form>
      <Flexbox flexDirection='column'>
        <TextField {...fields.fullName} />
        <TextField {...fields.nickname} />
        <SwitchField {...fields.isAdmin} />
      </Flexbox>
      <Button type='sumit' onClick={form.submit}>Submit</Button>
    </form.Form>
  )
}

export { BooleanToggle }
```
#### Number field
```
const NumberField = () => {
  const [fields, form] = useForm({
    fields: [
      { name: 'fullName', label: 'Full Name' },
      { name: 'nickname', label: 'Nickname' },
      { name: 'age', label: 'Age', type: 'number', normalize: normalizeNumber },
    ],
  })

  return (
    <form.Form>
      <Flexbox flexDirection='column'>
        <TextField {...fields.fullName} />
        <TextField {...fields.nickname} />
        <TextField {...fields.age} />
      </Flexbox>
      <Button type='sumit' onClick={form.submit}>Submit</Button>
    </form.Form>
  )
}

export { NumberField }
```
#### Select field
```
const SelectField = () => {
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
            return <MenuItem key={options.value} value={option.value}>{option.label}</MenuItem>
          })}
        </Select>
        <FormHelperText error={error}>{helperText}</FormHelperText>
      </FormControl>
    )
  }

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ]

  const [fields, form] = useForm({
    fields: [
      { name: 'fullName', label: 'Full Name' },
      { name: 'nickname', label: 'Nickname' },
      { name: 'gender', label: 'Gender', type: 'select', options: genderOptions },
    ],
  })

  return (
    <form.Form>
      <Flexbox flexDirection='column'>
        <TextField {...fields.fullName} />
        <TextField {...fields.nickname} />
        <SelectComponent {...fields.gender} />
      </Flexbox>
      <Button type='sumit' onClick={form.submit}>Submit</Button>
    </form.Form>
  )
}

export { SelectField }
```
#### Initial values passed into form
```
const InitialValuesSet = ({ initialValues }) => {
  const [fields, form] = useForm({
    fields: [
      { name: 'fullName', label: 'Full Name' },
      { name: 'nickname', label: 'Nickname' },
    ],
    initialValues,
  })

  return (
    <form.Form>
      <Flexbox flexDirection='column'>
        <TextField {...fields.fullName} />
        <TextField {...fields.nickname} />
      </Flexbox>
      <Button type='sumit' onClick={form.submit}>Submit</Button>
    </form.Form>
  )
}

export { InitialValuesSet }
```
#### Dynamic fields
```
const DynamicFields = () => {

  const [fields, form] = useForm({
    fields: [
      { name: 'fullName', label: 'Full Name' },
      { name: 'nickname', label: 'Nickname' },
    ],
  })

  const [dynamicFields, dynamicForm] = useForm({
    fields: [
      { name: 'name', label: 'Name' },
      { name: 'label', label: 'Label' },
    ],
    submit: values => {
      const name = values.get('name')
      const label = values.get('label')
      form.addField({ name, label })
    },
  })

  return (
    <Flexbox flexDirection='column'>
      <dynamicForm.Form>
        <Flexbox>
          <TextField {...dynamicFields.name} />
          <TextField {...dynamicFields.label} />
          <Button type='submit' onClick={dynamicForm.submit}>Add Field</Button>
        </Flexbox>
      </dynamicForm.Form>
      <Divider style={{ margin: '24px 16px 8px 16px' }} />
      <form.Form>
        <Flexbox flexDirection='column'>
          <TextField {...fields.fullName} />
          <TextField {...fields.nickname} />
          {Object.keys(fields)
            .filter(key => (key !== 'fullName' && key !== 'nickname'))
            .map(key => (
              <Flexbox key={key}>
                <TextField {...fields[key]} />
                <Button onClick={() => form.removeField(key)}>X</Button>
              </Flexbox>
            ))
          }
        </Flexbox>
        <Button type='sumit' onClick={form.submit}>Submit</Button>
      </form.Form>
    </Flexbox>
  )
}

export { DynamicFields }
```
