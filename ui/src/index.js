import 'babel-polyfill'

import React from 'react'
import { render } from 'react-dom'
import { Router, Route } from 'react-router'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import App from 'components/App'
import Login from 'components/Login'
import Home from 'components/Home'
import Gallery from 'components/Gallery'
import NewGalleryForm from 'components/NewGalleryForm'
import auth from './auth'

let requireAuth = (nextState, replaceState) => {
  if (!auth.loggedIn()) {
    replaceState({ nextPathname: nextState.location.pathname }, '/login')
  }
}

let routes =
  <Router
    history = { createBrowserHistory() }
  >
    <Route
      component = { App }
    >
      <Route
        path = "/"
        component = { Home }
        onEnter = { requireAuth }
      />
      <Route
        path = "/gallery/:galleryId"
        component = { Gallery }
        onEnter = { requireAuth }
      />
      <Route
        path = "/new-gallery"
        component = { NewGalleryForm }
        onEnter = { requireAuth }
      />
      <Route
        path = "/login"
        component = { Login }
      />
    </Route>
  </Router>

render(routes, document.getElementById(`app`))
