require(`babel-core/register`)

import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import mongoose from 'mongoose'
import config from './config'
import User from './models/user'
import router from './router'
import socketIO from 'socket.io'
import { Server } from 'http'

let app = express()

let http = Server(app)
let io = socketIO(http)

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

        if (email === `admin`) user.admin = true

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

io.on(`connection`, socket => {
  app.use('/api', router({ app, socket, io }))
})

http.listen(port, () => {
  console.log(`☆ listening on localhost:${port}`)
})
