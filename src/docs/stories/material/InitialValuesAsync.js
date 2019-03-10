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
        }))
      }, 2000)
    })
  }
  return useBrixWorker(['initialValues'], fetchInitialValues, Map())
}

const InitialValuesAsyncLoader = withBoundary(<div>loading initial values</div>)(() => {
  const initialValues = useFetchInitialValues()
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
})

const InitialValuesAsync = () => {
  const [show, setShow] = React.useState(false)

  return show ?
    <InitialValuesAsyncLoader />
    :
    <Button onClick={() => setShow(!show)} >Begin Loading</Button>
}

export { InitialValuesAsync }
