const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const promocodeSchema = new Schema({
	cat_id:{
		type: Schema.Types.ObjectId,
		ref: 'category',
		default: null,
	},
	subcat_id:{
		type: Schema.Types.ObjectId,
		ref: 'subcategory',
		default: null,
	},
	title: {
		type: String,
		required: true,
        unique: true,
	},
	promocode: {
		type: String,
		required: true,
		unique: true,
	},
	type:{
		type: String,
		default: "fixed",
		enum:["fixed", "percentage"],
	},
	discount:{
		type: Number,
		required: true,
	},
	from_date: {
		type: Date,
		required: true,
	},
	to_date: {
		type: Date,
		required: true,
	},
}, { timestamps: true } );

module.exports = mongoose.model('promocode', promocodeSchema);