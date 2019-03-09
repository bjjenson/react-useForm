import { Map } from 'immutable'
import { IValues } from '../common'

export type FieldTypes =
  'text' |
  'boolean' |
  'select' |
  'number'

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
  valueFromTarget?: (target: Object) => T
}

export interface IFormField {
  props: IFormTextFieldProps
  setValidationResult: (result: String) => void
  setValue: (value: String) => void
  validate: () => void
}

export function useFormField(state: Map, dispatch: Function, fieldArgs?: IFormFieldArgs): IFormField
