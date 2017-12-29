import 'babel-polyfill'

import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import App from './components/App'

render(
  <Router>
    <MuiThemeProvider>
      <App />
    </MuiThemeProvider>
  </Router>,
  document.getElementById(`app`),
)
