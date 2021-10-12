const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
	contact: {
		type: Number,
		unique:true,
		default:null,
	},
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		default:null,
	},
	gst_number: {
		type: Number,
	},
	address:{
		type: String,
		default:null,
	},
}, { timestamps: true });

module.exports = mongoose.model('customer', customerSchema);