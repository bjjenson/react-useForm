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
  value: string
  label: string
}


export interface IFormTextFieldProps {
  error: boolean
  helperText: string
  label: string
  value: string
  // Handlers
  onBlur: Function
  onChange: Function
}

export interface IFormFieldArgs<T = string> {
  name: string
  type: FieldTypes
  helperText: string
  optional: boolean
  requiredMessage?: string
  label: string
  normalize?: Function
  value: T
  validate?: (value: T, fieldName: string, getValues: () => IValues) => string
  options?: Array<ISelectOptions>
  fields?: Array<IFormFieldArgs<>>
  valueFromChange?: (event: object) => T
  passThrough?: { [key: string]: any }
}

export interface IFormField {
  props: IFormTextFieldProps
  setValidationResult: (result: string) => void
  setValue: (value: string) => void
  validate: () => void
}

export function useFormField(state: Map<string, any>, dispatch: Function, fieldArgs?: IFormFieldArgs): IFormField

// Form
export interface IValidationErrors {
  [key: string]: string
}

export interface IValidationResult {
  errors: IValidationErrors,
  isValid: boolean
}

function listener(value: any): void

export interface OptionListeners {
  [key: string]: Array<listener> | listener
}

export interface InitializedProps {
  initialValues: Map<string, any>
  addField: (field: IFormFieldArgs) => void
  removeField: (fieldName: string) => void
}

export interface IFormOptions {
  optionalLabelFormatter?: (label: string) => string
  listeners: OptionListeners
  onFormChange: (currentState: Map) => Map
  initialized: (props: InitializedProps) => void
  logPerformance: boolean,
  id: string,
}

export interface IFormStateResolvers {
  getAnyTouched: () => boolean
  getIsPristine: () => boolean
}

export interface IForm extends IFormStateResolvers {
  id: string
  Form: React.Component
  submit: (skipValidation: boolean) => void
  validate: () => IValidationResult
  reset: Function
  setValue: (fieldName: string, value: any) => void
  getValuesIfFormValid: Function
  addField: (field: IFormFieldArgs) => void
  removeField: (fieldName: string) => void
  addFieldListener: (fieldName: string, listener: Function) => void
  removeFieldListener: (fieldName: string, listener: Function) => void
  getValues: () => Map<string, any>
}

export interface IFields {
  [key: string]: IFormTextFieldProps
}

export interface IFormProps {
  fields: Array<IFormFieldArgs>
  submit: (values: IValues) => Promise<void>
  reset: () => void
  validate?: (values: IValues) => IValidationErrors | Array<(values: IValues) => IValidationErrors>
  initialValues?: Map<string, any>
  options?: IFormOptions
}

export function useForm(props: IFormProps): [IFields, IForm]
