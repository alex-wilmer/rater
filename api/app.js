require(`babel-core/register`)

import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import config from './config'
import User from './models/user'
import Gallery from './models/gallery'

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
			if (user) res.json({ error: `User with this email already exists.` })
			else {
				let user = new User({ email, password })

				user.save(err => {
					if (err) throw err
					res.json({ success: true })
				})
			}
		})
	} else res.json({ error: `Must provide email and password.` })
})

let apiRoutes = express.Router()

apiRoutes.post(`/authenticate`, (req, res) => {

	let { email, password } = req.body

	User.findOne({ email }, (err, user) => {

		if (err) throw err

		if (!user) {
			res.json({ success: false, message: 'Authentication failed. User not found.' })
		} else if (user) {

			// check if password matches
			if (user.password !== password) {
				res.json({ success: false, message: 'Authentication failed. Wrong password.' })
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
					createdDate: +new Date()
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
			else res.json({ needToAuth: true })
		}
	})
})

apiRoutes.get('/check', (req, res) => {
	res.json(req.decoded)
})

app.use('/api', apiRoutes)

app.listen(port)
console.log('Magic happens at http://localhost:' + port)
