import React from 'react'

const Form = ({ children, ...rest }) => {
  return (
    <form
      {...rest}
      onSubmit={e => {
        e.preventDefault()
      }}
    >
      {children}
    </form>
  )
}

export default Form
