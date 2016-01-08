import jwt from 'jsonwebtoken'
import User from '../models/user'

export default ({
  apiRoutes
}) => {
  apiRoutes.post(`/authenticate`, (req, res) => {

    let { email, password } = req.body

    User.findOne({ email }, (err, user) => {

      if (err) throw err

      if (!user) {
        res.json({ success: false, message: 'User not found.' })
      } else if (user) {

        // check if password matches
        if (user.password !== password) {
          res.json({ success: false, message: 'Wrong password.' })
        } else {

          let token = jwt.sign(user, app.get('superSecret'), {
            expiresInMinutes: 1440 // expires in 24 hours
          })

          res.json({
            success: true,
            message: 'Enjoy your token!',
            token,
            user
          })
        }
      }
    })
  })

  apiRoutes.use((req, res, next) => {

    let token = req.body.token

    if (token) {
      jwt.verify(token, app.get(`superSecret`), (err, decoded) => {
        if (err) {
          return res.json({ success: false, message: 'Failed to authenticate token.' })
        } else {
          req.decoded = decoded
          next()
        }
      })

    } else {

      return res.status(403).send({
        success: false,
        message: 'No token provided.'
      })
    }
  })
}
