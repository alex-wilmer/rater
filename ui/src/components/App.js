import React, { Component, Children, cloneElement } from 'react'
import auth from '../auth'

export default class App extends Component {
  static contextTypes = {
    history: React.PropTypes.object
  }

  constructor () {
    super()
    this.state = {
      loggedIn: auth.loggedIn(),
      user: {
        email: localStorage.userEmail
      },
    }
  }

  login = (type, { email, password }) => {
    auth[type]({ email, password }, user => {
      this.setState({
        loggedIn: !!user,
        user
      })
      this.context.history.pushState(null, `/`)
    })
  }

  logout = () => {
    localStorage.clear()
    this.context.history.pushState(null, `/login`)
    this.setState({ loggedIn: false })
  }

  createGallery = async event => {
    event.preventDefault()

    let body = {
      name: event.target.name.value,
      password: event.target.password.value,
      submitDeadline: event.target.submitDeadline.value,
      owner: this.state.user.email,
      token: localStorage.token
    }

    let response = await fetch(`http://localhost:8080/api/newgallery`, {
      method: `POST`,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    let { success, galleryId } = await response.json()

    console.log(success, galleryId)

    if (success) {
      this.context.history.pushState(null, `/gallery/${galleryId}`)
    }
  }

  render() {
    let children = Children.map(this.props.children, child => {
      return cloneElement(child, {
        ...child.props,
        ...this.props,
        ...this.state,
        setAuth: this.setAuth,
        createGallery: this.createGallery,
        login: this.login
      })
    })

    return (
      <div
        style = {{
          height: `100%`,
        }}
      >
        <div
          style = {{
            backgroundColor: `rgb(27, 173, 112)`,
            height: `5rem`,
            width: `100%`
          }}
        >
          { this.state.loggedIn &&
          <div>
            <span>{ this.state.user.email }</span>
            <button
              onClick = { this.logout }
            >
              Log out
            </button>
          </div>
          }
        </div>
       { children }
      </div>
    )
  }
}
