import { Map } from 'immutable'
import { IValues } from './common'

// Fields
export type FieldTypes =
  'text' |
  'boolean' |
  'select' |
  'number' |
  'object' |
  'list'

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
  fields?: Array<IFormFieldArgs<>>
  valueFromChange?: (event: Object) => T
  passThrough?: { [key: string]: any }
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

export interface IValidationResult {
  errors: IValidationErrors,
  isValid: Boolean
}

function listener(value: any): void
export interface OptionListeners {
  [key: string]: Array<listener> | listener
}

export interface IFormOptions {
  optionalLabelFormatter?: (label: String) => String
  listeners: OptionListeners
  logPerformance: boolean,
}

export interface IFormStateResolvers {
  getAnyTouched: () => Boolean
  getIsPristine: () => Boolean
}

export interface IForm extends IFormStateResolvers {
  Form: React.Component
  submit: (skipValidation: Boolean) => void
  validate: () => IValidationResult
  reset: Function
  setValue: (fieldName: String, value: any) => void
  getValuesIfFormValid: Function
  addField: (field: IFormFieldArgs) => void
  removeField: (fieldName: String) => void
  addFieldListener: (fieldName: String, listener: Function) => void
  removeFieldListener: (fieldName: String, listener: Function) => void
  getValues: () => Map<String, any>
}

export interface IFields {
  [key: string]: IFormTextFieldProps
}

export interface IFormProps {
  fields: Array<IFormFieldArgs>
  submit: (values: IValues) => Promise<void>
  reset: () => void
  validate?: (values: IValues) => IValidationErrors | Array<(values: IValues) => IValidationErrors>
  initialValues?: Map<String, any>
  options?: IFormOptions
}

export function useForm(props: IFormProps): [IFields, IForm]
