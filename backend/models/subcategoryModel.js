const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subcategorySchema = new Schema({
	cat_id:{
		type: Schema.Types.ObjectId,
		ref: 'category',
		required: true,
	},
	name: {
		type: String,
		required: true,
		minlength: 2,
        maxlength: 50,
        unique: true,
	},
	status:{
		type: String,
		default: "active",
		enum:["active", "inactive"]
	},
}, { timestamps: true });

module.exports = mongoose.model('subcategory', subcategorySchema);