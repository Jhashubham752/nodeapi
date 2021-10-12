const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
	name: {
		type: String,
		required: true,
		minlength: 2,
        maxlength: 50,
        unique: true,
	},
	cgst: {
		type: Number,
	},
	sgct: {
		type: Number,
	},
	cess: {
		type: Number,
	},
	status:{
		type: String,
		default: "active",
		enum:["active", "inactive"]
	},
}, { timestamps: true });

/*Schema.pre('remove', function(doc) {/
    // Remove all the docs that refers
    //console.log(doc);
/*    this.model('subcategory').remove({ cat_id: this._id }, );
});*/

module.exports = mongoose.model('category', categorySchema);