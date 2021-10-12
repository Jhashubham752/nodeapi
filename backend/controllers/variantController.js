const Variant = require('../models/variantModel');
const { check, validationResult } = require("express-validator");


/* GET variants listing. */
exports.getAllvariant = async (req, res) => {
 	try {
 		const PAGE_SIZE = parseInt(process.env.PAGE_NUMBER);
		const page = parseInt(req.query.page || 1);
		const total = await Variant.countDocuments({product_id:req.params.id});

		const variants = await Variant.find({product_id:req.params.id})
	    .limit(PAGE_SIZE).skip((page - 1) * PAGE_SIZE);
	    
		res.status(200).json({
			totalPages: Math.ceil(total / PAGE_SIZE),
			total:total,
			current_page:page,
			per_page:PAGE_SIZE,
			data:variants,
		});
 	 } catch (err) {
		res.status(500).json({ message: err.message })
  	}
};


/* GET singleVariant listing. */
exports.singleVariant = async (req, res) => {
 	try {
	    const variants = await Variant.findOne({_id:req.params.id});
		res.json({
			data:variants,
		});
 	 } catch (err) {
		res.status(500).json({ message: err.message })
  	}
};

/* Variant create*/
exports.createVariant = async (req, res) => {
 	try {
 		const errors = validationResult(req);
	 	if (!errors.isEmpty()) {
		    const err = {};
		    errors.array().forEach(error => {
		      err[error.param] = error.msg;
		    });
		    return res.status(422).json({ errors: err });
		}

		const { product_id, var_name, var_price, var_quantity, data } = req.body;

	    const newVariant = new Variant({
	    	product_id: product_id,
	    	var_name: var_name,
	    	var_price: var_price,
	    	var_quantity: var_quantity,
			data: JSON.stringify(data),
	  	});
  	 	const saveVariant = await newVariant.save();

		res.status(201).json({
			data:saveVariant,
			message:"Created Successfully",
			success:true
		});
  	} catch (err) {
		res.status(500).json({ errors: err.message })
  	}
};

/* product variants edit*/
exports.editVariant = async (req, res) => {
	try{
	  	const variants = await Variant.findById(req.params.id);
		res.json({
			data:variants,
		});

	} catch (err) {
		res.status(500).json({ errors: err.message })
  	}
};


/* Category update*/
exports.updateVariant = async (req, res) => {
	try{
		const errors = validationResult(req);
	 	if (!errors.isEmpty()) {
		    const err = {};
		    errors.array().forEach(error => {
		      err[error.param] = error.msg;
		    });
		    return res.status(422).json({ errors: err });
		}
		const { product_id, var_name, var_price, var_quantity, data } = req.body;
		Variant.findById(req.params.id, function (err, variant) {
		 	if (!variant){
		 		return next(new Error('Unable To Find Variant With This Id'));
		 	}
		 	else { 
				variant.product_id = product_id;
				variant.var_name = var_name;
		    	variant.var_price = var_price;
		    	variant.var_quantity = var_quantity;
				variant.data = JSON.stringify(data);
			 	variant.save().then(variant => {
					res.json({
						data:variant,
						success:true,
						message: "Updated successfully", 
					})
				});
			}
		});
		

	} catch (err) {
		res.status(500).json({ errors: err.message })
  	}
};


/* Product Variants delete*/
exports.deleteVariant = async (req, res) => {
	try{
		Variant.findByIdAndDelete({ _id: req.params.id }, function (err, item) {
			 if (err) res.json(err);
			 else res.json('Variant Deleted Successfully');
	 	});
	} catch (err) {
		res.status(500).json({ errors: err.message })
  	}
};
