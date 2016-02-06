import express from 'express'
import schedule from 'node-schedule'
import Gallery from './models/gallery'
import activateDeadline from './lib/activateDeadline'
import calculateCriticalAssessmentScores from './lib/calculateCriticalAssessmentScores'

import { auth } from './auth'

export default ({ app, io }) => {

  let apiRoutes = express.Router()

  auth({ app, apiRoutes })

  apiRoutes.post(`/newgallery`, (req, res) => {
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
            images: [],
          })

          /*
           *  Schedule activation function.
           */

          schedule.scheduleJob(new Date(submitDeadline), () => {
            gallery = activateDeadline(gallery)
            gallery.markModified(`images`)

            gallery.save((err, gallery) => {
              console.log(`${gallery} deadline activated: ${gallery.submitDeadline}`)
              io.emit(`api:updateGallery`, gallery)
            })
          });

          gallery.save((err, g) => {
            if (err) throw err

            res.json({
              success: true,
              galleryId: g._id,
            })
          })
        }
      })
    } else res.json({ error: `Must provide name and password.` })
  })

  apiRoutes.get(`/`, (req, res) => {
    res.json({ message: 'Welcome to the coolest API on earth!' })
  })

  apiRoutes.post(`/galleries`, (req, res) => {
    Gallery.find({ $or: [ { owner: req.body.userEmail }, { public: true } ] }, (err, galleries) => {
      res.json(galleries)
    })
  })

  apiRoutes.post(`/gallery`, (req, res) => {
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
            needToAuth: true,
          }
          if (req.body.password) {
            response.message = `Wrong password.`
          }
          res.json(response)
        }
      }
    })
  })

  apiRoutes.post(`/gallery/image`, (req, res) => {
    Gallery.findOne({ _id: req.body.galleryId }, (err, gallery) => {
      if (gallery) {
        let image = gallery.images.filter(x => x.userEmail === req.body.userEmail)[0]

        if (image) {
          image.link = req.body.link
        } else {
          image = {
            link: req.body.link,
            width: req.body.width,
            height: req.body.height,
            caption: req.body.caption,
            userEmail: req.body.userEmail,
            raters: [],
            imagesToRate: [],
            averageRating: 0,
          }
        }

        gallery.images = [
          ...gallery.images.filter(x => x.userEmail !== req.body.userEmail),
          image,
        ]

        gallery.save((err, g) => {
          console.log(`Updated Gallery`, g)
          io.emit(`api:updateGallery`, g)
          res.json({ image })
        })
      }
    })
  })

  apiRoutes.post(`/gallery/activate`, (req, res) => {
    Gallery.findOne({ _id: req.body.galleryId }, (err, gallery) => {
      if (gallery && gallery.owner === req.body.userEmail) {
        gallery = activateDeadline(gallery)

        gallery.markModified(`images`)

        gallery.save((err, gallery) => {
          console.log(`${gallery} deadline activated: ${gallery.submitDeadline}`)
          io.emit(`api:updateGallery`, gallery)
          res.json({ gallery })
        })

        // TODO: notify users by email that its time to vote
      }
    })
  })

  apiRoutes.post(`/gallery/vote`, (req, res) => {
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
              multiplier: req.body.multiplier,
            },
          ]

          image.averageRating =
            image.raters.reduce((acc, rater) => {
              return acc + rater.rating
            }, 0) / (image.raters.length + (req.body.multiplier - 1))


          gallery.images = [
            ...gallery.images.filter(x =>
              x.link !== req.body.viewingImage.link
            ),
            image,
          ]

          gallery = calculateCriticalAssessmentScores(gallery)
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
            image.raters = [
              ...image.raters,
              {
                userEmail: req.body.userEmail,
                rating: req.body.rating,
              },
            ]

            let ownerRate =
              image.raters.filter(x => x.multiplier)[0]

            let multiplier = ownerRate ? ownerRate.multiplier - 1 : 0

            image.averageRating =
              image.raters.reduce((acc, rater) => {
                return acc + rater.rating
              }, 0) / (image.raters.length + multiplier)

            userImageToRate.rating = req.body.rating

            userImage.imagesToRate = [
              ...userImage.imagesToRate.filter(x =>
                x.link !== req.body.viewingImage.link
              ),
              userImageToRate,
            ]

            gallery.images = [
              ...gallery.images.filter(x =>
                x.userEmail !== req.body.userEmail &&
                x.link !== req.body.viewingImage.link
              ),
              image,
              userImage,
            ]

            gallery = calculateCriticalAssessmentScores(gallery)

          } else {
            res.json({
              success: false,
              message: `Already voted!`,
            })
          }
        }

        gallery.markModified(`images`)

        gallery.save((err, gallery) => {
          console.log(
            `${req.body.userEmail} rated ${req.body.rating} on ${image.link}`
          )

          io.emit(`api:updateGallery`, gallery)

          res.json({
            gallery,
            success: true,
          })
        })
      }
    })
  })

  apiRoutes.get(`/check`, (req, res) => {
    res.json(req.decoded)
  })

  return apiRoutes
}
