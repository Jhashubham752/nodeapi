const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
	cust_id:{
		type: Schema.Types.ObjectId,
		ref: 'customer',
		required: true,
	},
	product_name: {
		type: String,
		required: true,
	},
	available_quantity: {
		type: Number,
	},
	quantity: {
		type: Number,
	},
	total_price:{
		type: Number,
	},
}, { timestamps: true });

module.exports = mongoose.model('order', orderSchema);