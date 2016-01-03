import mongoose from 'mongoose'

let Schema = mongoose.Schema

export default mongoose.model(`Gallery`, new Schema({
	name: String,
	password: String,
	submitDeadline: Date,
	// voteDeadline: Date,
  active: Boolean,
	owner: String,
	createdDate: Date,
	images: []
}))
