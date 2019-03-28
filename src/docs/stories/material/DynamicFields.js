import React from 'react'
import { TextField, Button, Divider } from '@material-ui/core'
import Flexbox from 'flexbox-react'
import { useForm } from '../../../form'

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
        <Button type='submit' onClick={form.submit}>Submit</Button>
      </form.Form>
    </Flexbox>
  )
}

export { DynamicFields }
