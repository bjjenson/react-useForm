import { Map } from 'immutable'
import { IFormTextFieldProps, IFormFieldArgs } from './fields/useFormField'
import { IValues } from './common'

export interface IValidationErrors {
  [key: String]: String
}

export interface IFormOptions {
  optionalLabelFormatter?: (label: String) => String
}

export interface IForm {
  [key: String]: IFormTextFieldProps
  Form: React.Component
  submit: Function
  addField: (field: IFormFieldArgs) => void
  removeField: (fieldName: String) => void
}

export interface IFormProps {
  fields: Array<IFormFieldArgs>
  setValue: (fieldName: String, value: any) => void
  submit: (values: IValues) => Promise
  validate?: (values: IValues) => IValidationErrors | Array<(values: IValues) => IValidationErrors>
  initialValues?: Map<String, any>
  options?: IFormOptions
}

export function useForm(props: IFormProps): IForm
