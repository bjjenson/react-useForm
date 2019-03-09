import React from 'react'

export const Form = ({ children, ...rest }) => {
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
