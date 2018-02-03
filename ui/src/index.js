import 'babel-polyfill'

import React from 'react'
import { render } from 'react-dom'
import { HashRouter, BrowserRouter } from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import App from './components/App'

let Router =
  process.env.REACT_APP_ROUTER === 'hash' ? HashRouter : BrowserRouter

render(
  <Router>
    <MuiThemeProvider>
      <App />
    </MuiThemeProvider>
  </Router>,
  document.getElementById(`app`),
)
