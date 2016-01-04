require(`babel-core/register`)

import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import mongoose from 'mongoose'
import config from './config'
import User from './models/user'
import setupApiRoutes from './apiRoutes'

let app = express()
let port = process.env.PORT || 8080
mongoose.connect(config.database)
app.set(`superSecret`, config.secret)

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(morgan(`dev`))

app.post(`/signup`, (req, res) => {

  let { email, password } = req.body

  if (email && password) {
    User.findOne({ email }, (err, user) => {
      if (err) throw err
      if (user) res.json({
        success: false,
        message: `User with this email already exists.`
      })
      else {
        let user = new User({ email, password })

        user.save(err => {
          if (err) throw err
          res.json({ success: true })
        })
      }
    })
  } else res.json({
    success: false,
    message: `Must provide email and password.`
  })
})

let apiRoutes = setupApiRoutes(app)
app.use('/api', apiRoutes)

app.listen(port)
console.log('Magic happens at http://localhost:' + port)
