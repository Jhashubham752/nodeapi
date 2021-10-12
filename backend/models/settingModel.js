const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const settingSchema = new Schema({
	user:{
		type: Schema.Types.ObjectId,
		ref: 'user',
		required: true,
	},
	gst_number: {
		type: Number,
		unique:true
	},
	pan_number: {
		type: Number,
		unique:true
	},
	company_name: {
		type: String,
		unique:true
	},
	contact: {
		type: Number,
		unique:true
	},
	taxable: {
		type: Number,
	},
	company_address:{
		type:String,
	},
	priceCode:{
		type: String,
		default: "in",
		enum:["in", "us"]
	},
}, { timestamps: true });


module.exports = mongoose.model('setting', settingSchema);