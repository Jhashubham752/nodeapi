const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const variantSchema = new Schema({
	product_id:{
		type: Schema.Types.ObjectId,
		ref: 'product',
	},
	var_name: {
		type: String,
        unique: true,
	},
	var_price: {
		type: Number,
	},
	var_quantity: {
		type: Number,
	},
	data: {
		type: String,
	},
}, { timestamps: true });

module.exports = mongoose.model('variant', variantSchema);