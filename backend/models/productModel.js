const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
	subcat_id:{
		type: Schema.Types.ObjectId,
		ref: 'subcategory',
		required: true,
	},
	title: {
		type: String,
		required: true,
		minlength: 2,
        maxlength: 100,
        unique: true,
	},
	slug: {
		type: String,
		required: true,
		unique: true,
	},
	description: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	quantity: {
		type: Number,
		required: true,
	},
	images: {
		type: String,
		required: true,
	},
	status:{
		type: String,
		default: "active",
		enum:["active", "inactive"]
	},
}, { timestamps: true });

module.exports = mongoose.model('product', productSchema);