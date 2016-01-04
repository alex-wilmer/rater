import express from 'express'
import jwt from 'jsonwebtoken'
import User from './models/user'
import Gallery from './models/gallery'
import _ from 'lodash'

export default (app) => {

  let apiRoutes = express.Router()

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

  apiRoutes.post('/newgallery', (req, res) => {
    let { owner, name, password, submitDeadline } = req.body

    if (name && password) {
      Gallery.findOne({ name }, (err, gallery) => {
        if (err) throw err
        if (gallery) res.json({ error: `Gallery with this name already exists.` })
        else {
          let gallery = new Gallery({
            name,
            password,
            submitDeadline,
            owner,
            active: true,
            passedDeadline: false,
            createdDate: +new Date(),
            images: []
          })


          gallery.save((err, g) => {
            if (err) throw err

            res.json({
              success: true,
              galleryId: g._id
            })
          })
        }
      })
    } else res.json({ error: `Must provide name and password.` })
  })

  apiRoutes.get('/', (req, res) => {
    res.json({ message: 'Welcome to the coolest API on earth!' })
  })

  apiRoutes.post('/galleries', (req, res) => {
    Gallery.find({ $or: [ { owner: req.body.userEmail } ] }, (err, galleries) => {
      res.json(galleries)
    })
  })

  apiRoutes.post('/gallery', (req, res) => {
    Gallery.findOne({ _id: req.body.galleryId }, (err, gallery) => {
      if (gallery) {
        if (
          gallery.owner === req.body.userEmail ||
          gallery.password === req.body.password
        ) {
          res.json(gallery)
        }
        else {
          let response = {
            needToAuth: true
          }
          if (req.body.password) {
            response.message = `Wrong password.`
          }
          res.json(response)
        }
      }
    })
  })

  apiRoutes.post('/gallery/image', (req, res) => {
    Gallery.findOne({ _id: req.body.galleryId }, (err, gallery) => {
      if (gallery) {
        let image = gallery.images.filter(x => x.userEmail === req.body.userEmail)[0]

        if (image) {
          image.link = req.body.link
        } else {
          image = {
            link: req.body.link,
            userEmail: req.body.userEmail,
            raters: [],
            imagesToRate: [],
            averageRating: 0
          }
        }

        gallery.images = [
          ...gallery.images.filter(x => x.userEmail !== req.body.userEmail),
          image
        ]

        gallery.save((err, g) => {
          console.log(`Updated Gallery`, g)
          res.json({ image })
        })
      }
    })
  })

  apiRoutes.post('/gallery/activate', (req, res) => {
    Gallery.findOne({ _id: req.body.galleryId }, (err, gallery) => {
      if (gallery && gallery.owner === req.body.userEmail) {
        gallery.submitDeadline = +new Date()
        gallery.passedDeadline = true

        gallery.images = gallery.images.map(x => ({
          ...x,
          raters: [],
          imagesToRate: [],
          averageRating: 0
        }))

        let imagesToPull = gallery.images.map(x => x)

        gallery.images.forEach(img => {
          let sliceImage = () => {
            let randomIndex = Math.floor(Math.random() * imagesToPull.length)
            return [ imagesToPull.slice(randomIndex, randomIndex + 1)[0], randomIndex ]
          }

          for (let i = 0; i < Math.min(gallery.images.length - 1, 5); i += 1) {
            do {
              var [ imgToRate, randomIndex ] = sliceImage()

              if (
                imgToRate.userEmail !== img.userEmail &&
                !img.imagesToRate.some(x => x.link === imgToRate.link)
              ) {
                imgToRate = imagesToPull.splice(randomIndex, 1)[0]

                img.imagesToRate = [
                  ...img.imagesToRate,
                  {
                    link: imgToRate.link
                  }
                ]
                if (imagesToPull.length === 1) {
                  imagesToPull = gallery.images.map(x => x)
                }
              }
            }
            while (
              imgToRate.userEmail === img.userEmail &&
              !img.imagesToRate.some(x => x.link === imgToRate.link) &&
              imagesToPull.length > img.imagesToRate.length + 1
            )
          }

          img.imagesToRate = _.uniq(img.imagesToRate, `link`)
        })

        gallery.markModified(`images`)

        gallery.save((err, gallery) => {
          console.log(`${gallery} deadline activated: ${gallery.submitDeadline}`)
          res.json({ gallery })
        })

        // TODO: notify users by email that its time to vote
      }
    })
  })

  apiRoutes.post('/gallery/vote', (req, res) => {
    Gallery.findOne({ _id: req.body.galleryId }, (err, gallery) => {
      if (gallery) {
        let image = (
          gallery.images.filter(x =>
            x.link === req.body.viewingImage.link
          )[0]
        )

        let userImage =
          gallery.images.filter(x =>
            x.userEmail === req.body.userEmail
          )[0]

        /*
         *  Admin Vote
         */

        if (gallery.owner === req.body.userEmail) {
          image.raters = [
            ...image.raters.filter(x => x.userEmail !== req.body.userEmail),
            {
              userEmail: req.body.userEmail,
              rating: req.body.rating * req.body.multiplier,
              multiplier: req.body.multiplier
            }
          ]

          image.averageRating =
            image.raters.reduce((acc, rater) => {
              return acc + rater.rating
            }, 0) / (image.raters.length + (req.body.multiplier - 1))


          gallery.images = [
            ...gallery.images.filter(x =>
              x.link !== req.body.viewingImage.link
            ),
            image
          ]
        }

        /*
         *  User vote
         */

        if (image && userImage) {
          let userImageToRate =
            userImage.imagesToRate.filter(x =>
              x.link === req.body.viewingImage.link
            )[0]

          if (!userImageToRate.rating) {

            // TODO: calculate average rating

            image.raters = [
              ...image.raters,
              {
                userEmail: req.body.userEmail,
                rating: req.body.rating
              }
            ]

            let ownerRate =
              image.raters.filter(x => x.multiplier)[0]

            let multiplier = ownerRate ? ownerRate.multiplier : 0

            image.averageRating =
              image.raters.reduce((acc, rater) => {
                return acc + rater.rating
              }, 0) / (image.raters.length + multiplier)

            userImageToRate.rating = req.body.rating

            userImage.imagesToRate = [
              ...userImage.imagesToRate.filter(x =>
                x.link !== req.body.viewingImage.link
              ),
              userImageToRate
            ]

            gallery.images = [
              ...gallery.images.filter(x =>
                x.userEmail !== req.body.userEmail &&
                x.link !== req.body.viewingImage.link
              ),
              image,
              userImage
            ]
          } else {
            res.json({
              success: false,
              message: `Already voted!`
            })
          }
        }

        gallery.markModified(`images`)

        gallery.save((err, gallery) => {
          console.log(
            `${req.body.userEmail} rated ${req.body.rating} on ${image.link}`
          )
          res.json({
            gallery,
            success: true
          })
        })
      }
    })
  })

  apiRoutes.get('/check', (req, res) => {
    res.json(req.decoded)
  })

  return apiRoutes
}
