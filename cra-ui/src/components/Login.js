import React, { Component } from 'react'
import { parse } from 'query-string'
import auth from '../auth'

let email, password

export default function Login({ login, message, location }) {
  let nextPathname = parse(location.search).nextPathname || '/'

  return (
    <div
      style={{
        height: `calc(100% - 5rem)`,
        display: `flex`,
        justifyContent: `center`,
        alignItems: `center`,
      }}
    >
      <div
        style={{
          display: `flex`,
          flexDirection: `column`,
          minHeight: `200px`,
        }}
      >
        <input ref={node => (email = node)} placeholder="Email.." type="text" />
        <input
          ref={node => (password = node)}
          placeholder="Password.."
          type="password"
        />
        <button
          onClick={() => {
            login({
              type: `login`,
              userInfo: { email: email.value, password: password.value },
              nextPathname,
            })
          }}
          style={{
            marginTop: `0.5rem`,
          }}
        >
          Log In
        </button>
        <button
          onClick={() => {
            login({
              type: `signup`,
              userInfo: { email: email.value, password: password.value },
              nextPathname,
            })
          }}
          style={{
            marginTop: `1rem`,
          }}
        >
          Sign Up
        </button>
        {!!message && <div>{message}</div>}
      </div>
    </div>
  )
}
