import React, { Component } from 'react'

export default class App extends Component {
  login = (event) => {
    event.preventDefault()

    console.log(
      event.target.name.value,
      event.target.password.value
    )
  }

  render() {
    return (
      <div
        style = {{
          height: `100%`,
          display: `flex`,
          justifyContent: `center`,
          alignItems: `center`
        }}
      >
        <div
          style = {{
            display: `flex`,
            flexDirection: `column`
          }}
        >
          <form
            onSubmit = { this.login }
            style = {{
              display: `flex`,
              flexDirection: `column`
            }}
          >
            <input
              type = "text"
              placeholder = "Name.."
              name = "name"
            />

            <input
              name = "password"
              placeholder = "Password.."
              type = "password"
            />

            <input
              type = "submit"
              value = "Sign In"
            />
          </form>
          <button>Sign Up</button>
        </div>
      </div>
    )
  }
}
