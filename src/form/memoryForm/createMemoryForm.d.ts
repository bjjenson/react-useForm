import { Map } from 'immutable'
import { IFormProps, IValidationErrors, IValidationResult } from '../useForm'
import { IValues } from '../common'

export interface IMemoryFormProps {
  fields: Array<IFormFieldArgs>
  validate?: (values: IValues) => IValidationErrors | Array<(values: IValues) => IValidationErrors>
  initialValues?: Map<string, any>
}

export function createMemoryFrom(props: IMemoryFormProps): { validate: () => IValidationResult }
