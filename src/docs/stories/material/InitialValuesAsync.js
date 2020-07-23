import React from 'react'
import { Map, fromJS } from 'immutable'
import { TextField, Button } from '@material-ui/core'
import Flexbox from 'flexbox-react'
import { useBrixWorker, withBoundary } from 'react-brix'
import { useForm } from '../../../form'

const useFetchInitialValues = () => {
  const fetchInitialValues = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(fromJS({
          fullName: 'Samuel Tarley',
          nickname: 'Sam',
          arrived: 'late!',
        }))
      }, 2000)
    })
  }
  return useBrixWorker(['initialValues'], fetchInitialValues, Map())
}

const InitialValuesAsyncLoader = withBoundary(<div>loading initial values</div>)(({ submit }) => {
  const initialValues = useFetchInitialValues()
  const [fields, form] = useForm({
    fields: [
      { name: 'fullName', label: 'Full Name' },
      { name: 'nickname', label: 'Nickname' },
    ],
    initialValues,
    options: {
      initialized: ({ initialValues: updatedValues, addField }) => {
        if (updatedValues.get('arrived')) {
          addField({ name: 'arrived', label: 'Arrived' })
        }
      },
    },
    submit,
  })

  return (
    <form.Form>
      <Flexbox flexDirection='column'>
        <TextField {...fields.fullName} />
        <TextField {...fields.nickname} />
        {fields.arrived && <TextField {...fields.arrived} />}
      </Flexbox>
      <Button type='submit' onClick={form.submit}>Submit</Button>
    </form.Form>
  )
})

const InitialValuesAsync = (props) => {
  const [show, setShow] = React.useState(false)

  return show ?
    <InitialValuesAsyncLoader {...props} />
    :
    <Button onClick={() => setShow(!show)} >Begin Loading</Button>
}

export { InitialValuesAsync }
