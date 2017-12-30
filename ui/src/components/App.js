import React, { Component } from 'react'
import { Route, Link, Redirect } from 'react-router-dom'
import io from 'socket.io-client'
import auth from '../auth'
import Home from './Home'
import Login from './Login'
import Gallery from './Gallery'
import NewGalleryForm from './NewGalleryForm'

let socket = io(`${process.env.REACT_APP_DOMAIN}:8080`)

let AuthRoute = ({ component: Cmp, ...props }) => (
  <Route
    {...props}
    render={match =>
      auth.loggedIn() ? (
        <Cmp {...props} {...match} />
      ) : (
        <Redirect to={`/login?nextPathname=${match.location.pathname}`} />
      )}
  />
)

export default class App extends Component {
  state = {
    loggedIn: auth.loggedIn(),
    headerColor: `rgb(27, 173, 112)`,
    nextPathname: null,
    user: {
      email: localStorage.userEmail,
      admin: localStorage.user,
    },
  }

  login = ({ type, nextPathname, userInfo: { email, password } }) => {
    auth[type]({ email, password }, response => {
      if (response.success) {
        this.setState(
          {
            loggedIn: response.success,
            user: response.user,
            nextPathname, // redirect to previous path
          },
          // clear redirect state after route change
          () => this.setState({ nextPathname: null }),
        )
      } else {
        this.setState({
          message: response.message,
        })
      }
    })
  }

  logout = () => {
    localStorage.clear()
    this.setState(
      {
        loggedIn: false,
        headerColor: `rgb(27, 173, 112)`,
        nextPathname: '/login',
      },
      () => this.setState({ nextPathname: null }),
    )
  }

  createGallery = async ({ name, password, submitDeadline }) => {
    let body = {
      name,
      password,
      submitDeadline,
      owner: this.state.user.email,
      token: localStorage.token,
    }

    let response = await fetch(
      `${process.env.REACT_APP_DOMAIN}:8080/api/newgallery`,
      {
        method: `POST`,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
    )

    let { success, galleryId } = await response.json()

    if (success) {
      this.setState({ nextPathname: `/gallery/${galleryId}` }, () =>
        this.setState({ nextPathname: null }),
      )
    }
  }

  setHeaderColor = color => this.setState({ headerColor: color })

  render() {
    return (
      <div
        style={{
          height: `100%`,
        }}
      >
        <div
          className="z-depth-2"
          style={{
            backgroundColor: this.state.headerColor,
            height: `5rem`,
            width: `100%`,
            padding: `0 3rem`,
            display: `flex`,
            alignItems: `center`,
            color: `white`,
          }}
        >
          <Link to="/">
            <span
              style={{
                color: `white`,
                fontSize: `1.4em`,
              }}
            >
              Rater
            </span>
          </Link>

          {this.state.loggedIn && (
            <div
              style={{
                marginLeft: `auto`,
              }}
            >
              <span>Welcome, {this.state.user.email}</span>
              <a
                onClick={this.logout}
                style={{
                  marginLeft: `1rem`,
                  color: `white`,
                }}
              >
                Log out
              </a>
            </div>
          )}
        </div>
        <AuthRoute
          exact
          path="/"
          component={() => (
            <Home
              {...this.state}
              setAuth={this.setAuth}
              login={this.login}
              setHeaderColor={this.setHeaderColor}
              socket={socket}
            />
          )}
        />
        <AuthRoute
          path="/gallery/:galleryId"
          component={props => (
            <Gallery
              socket={socket}
              params={props.match.params}
              setHeaderColor={this.setHeaderColor}
            />
          )}
        />
        <AuthRoute
          path="/new-gallery"
          component={() => (
            <NewGalleryForm createGallery={this.createGallery} />
          )}
        />
        <Route
          path="/login"
          component={p => <Login login={this.login} {...p} {...this.state} />}
        />
        {this.state.nextPathname && <Redirect to={this.state.nextPathname} />}
      </div>
    )
  }
}
