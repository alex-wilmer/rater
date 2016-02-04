import mongoose from 'mongoose'

let Schema = mongoose.Schema

export default mongoose.model(`Gallery`, new Schema({
	name: String,
	password: String,
	submitDeadline: String,
	// voteDeadline: Date,
  active: Boolean,
	owner: String,
	createdDate: String,
	passedDeadline: Boolean,
	images: [],
	color: String,
	public: Boolean,
}))
