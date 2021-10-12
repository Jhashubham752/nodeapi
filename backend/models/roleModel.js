const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roleSchema = new Schema({
	role: {
		type: String,
		required: true,
		minlength: 2,
        maxlength: 50,
        unique: true,
	},
	permission: {
		type: String,
	},
}, { timestamps: true });

module.exports = mongoose.model('role', roleSchema);