const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: {
		type: String,
		required: true,
		minlength: 2,
        maxlength: 50
	},
	role:{
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		minlength: 5,
        maxlength: 255,
		unique:true,
	},
	password: {
		type: String,
		required: true,
		/*minlength: 5,
        maxlength: 1024*/
	},
	contact_number:{
		type: Number,
		unique:true
		// required: true,
	/*	minlength: 0,
        maxlength: 15*/
	},
	email_verified_at:{
		type:Date
	},
	status:{
		type: String,
		default: "active",
		enum:["active", "inactive"]
	},
	resetToken:{
		type:String,
	},
	resetExpires:{
		type:Date
	},
}, { timestamps: true });

module.exports = mongoose.model('user', userSchema);