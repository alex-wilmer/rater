import React, { Component } from 'react'
import { Route, Link, Redirect } from 'react-router-dom'
import io from 'socket.io-client'
import auth from '../auth'
import Home from './Home'
import Login from './Login'
import Gallery from './Gallery'
import Userlist from './Userlist'
import NewGalleryForm from './NewGalleryForm'

let socket = io(`${process.env.REACT_APP_API}`)

let AuthRoute = ({ component, ...props }) => {
  return (
    <Route
      {...props}
      render={
        auth.loggedIn()
          ? component
          : match => (
              <Redirect to={`/login?nextPathname=${match.location.pathname}`} />
            )
      }
    />
  )
}

export default class App extends Component {
  state = {
    loggedIn: auth.loggedIn(),
    headerColor: `rgb(27, 173, 112)`,
    nextPathname: null,
    user: {
      username: localStorage.username,
      admin: localStorage.admin,
    },
  }

  login = ({ type, nextPathname, userInfo: { username, password } }) => {
    auth[type]({ username, password, socket }, response => {
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
      owner: this.state.user.username,
      token: localStorage.token,
    }

    let response = await fetch(`${process.env.REACT_APP_API}/api/newgallery`, {
      method: `POST`,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

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
          {this.state.user.admin && (
            <Link to="/userlist">
              <div
                style={{
                  marginLeft: `1rem`,
                  color: `#f0ff3e`,
                }}
              >
                USERLIST
              </div>
            </Link>
          )}
          {this.state.loggedIn && (
            <div
              style={{
                marginLeft: `auto`,
              }}
            >
              <span>Welcome, {this.state.user.username}</span>
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
              {...props}
            />
          )}
        />
        <AuthRoute
          path="/new-gallery"
          component={() => (
            <NewGalleryForm createGallery={this.createGallery} />
          )}
        />
        <AuthRoute
          path="/userlist"
          component={() => <Userlist socket={socket} />}
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
