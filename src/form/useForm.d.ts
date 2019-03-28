import { Map } from 'immutable'
import { IValues } from './common'

// Fields
export type FieldTypes =
  'text' |
  'boolean' |
  'select' |
  'number' |
  'object'

export interface ISelectOptions {
  value: String
  label: String
}


export interface IFormTextFieldProps {
  error: Boolean
  helperText: String
  label: String
  value: String
  // Handlers
  onBlur: Function
  onChange: Function
}

export interface IFormFieldArgs<T = String> {
  name: String
  type: FieldTypes
  helperText: String
  optional: Boolean
  requiredMessage?: String
  label: String
  normalize?: Function
  value: T
  validate?: (value: T, fieldName: String, getValues: () => IValues) => String
  options?: Array<ISelectOptions>
  valueFromChange?: (event: Object) => T
}

export interface IFormField {
  props: IFormTextFieldProps
  setValidationResult: (result: String) => void
  setValue: (value: String) => void
  validate: () => void
}

export function useFormField(state: Map<String, any>, dispatch: Function, fieldArgs?: IFormFieldArgs): IFormField

// Form
export interface IValidationErrors {
  [key: string]: String
}

export interface IFormOptions {
  optionalLabelFormatter?: (label: String) => String
}

export interface IForm {
  Form: React.Component
  submit: Function
  addField: (field: IFormFieldArgs) => void
  removeField: (fieldName: String) => void
}

export interface IFields {
  [key: string]: IFormTextFieldProps
}

export interface IFormProps {
  fields: Array<IFormFieldArgs>
  setValue: (fieldName: String, value: any) => void
  submit: (values: IValues) => Promise<void>
  validate?: (values: IValues) => IValidationErrors | Array<(values: IValues) => IValidationErrors>
  initialValues?: Map<String, any>
  options?: IFormOptions
}

export function useForm(props: IFormProps): [IFields, IForm]
