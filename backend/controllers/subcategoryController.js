const SubCategory = require('../models/subcategoryModel');
const { check, validationResult } = require("express-validator");

/* GET subcategories listing. */
exports.getAllsubCategory = async (req, res) => {
 	try {
 		const PAGE_SIZE = parseInt(process.env.PAGE_NUMBER);
		const page = parseInt(req.query.page || 1);
		const total = await SubCategory.countDocuments({});

		const subcategories = await SubCategory.find().populate("cat_id")
	    .limit(PAGE_SIZE).skip((page - 1) * PAGE_SIZE);

		res.status(200).json({
			totalPages: Math.ceil(total / PAGE_SIZE),
			total:total,
			current_page:page,
			per_page:PAGE_SIZE,
			data:subcategories
		});
 	 } catch (err) {
		res.status(500).json({ message: err.message })
  	}
};

/* activeSubCategory*/
exports.activeSubCategory = async (req, res) => {
 	try {
 		const activesubcat = await SubCategory.find({status:["active"]});
		res.status(200).json({
			data:activesubcat,
		});
 	 } catch (err) {
		res.status(500).json({ message: err.message })
  	}
};

/* category create*/
exports.createSubCategory = async (req, res) => {
 	try {
 		const errors = validationResult(req);
	 	if (!errors.isEmpty()) {
		    const err = {};
		    errors.array().forEach(error => {
		      err[error.param] = error.msg;
		    });
		    return res.status(422).json({ errors: err });
		}
		const { cat_id, name, status } = req.body;

	    const newSubCategory = new SubCategory({
			cat_id:cat_id,
			name: name,
			status: status,
	  	});
  	 	const saveSubCategory = await newSubCategory.save();

		res.status(201).json({
			category:saveSubCategory,
			message:"Created Successfully",
			success:true
		});
  	} catch (err) {
		res.status(500).json({ errors: err.message })
  	}
};

/* subcategory edit*/
exports.editSubCategory = async (req, res) => {
	try{
	  	const subcategories = await SubCategory.findById(req.params.id);
		res.json({data:subcategories});

	} catch (err) {
		res.status(500).json({ errors: err.message })
  	}
};

/* SubCategory update*/
exports.updateSubCategory = async (req, res) => {
	try{
		const errors = validationResult(req);
	 	if (!errors.isEmpty()) {
		    const err = {};
		    errors.array().forEach(error => {
		      err[error.param] = error.msg;
		    });
		    return res.status(422).json({ errors: err });
		}
		const { cat_id, name, status } = req.body;

		SubCategory.findById(req.params.id, function (err, subcategory) {
		 	if (!subcategory){
		 		return next(new Error('Unable To Find SubCategory With This Id'));
		 	}
		 	else {
		 		subcategory.cat_id = cat_id;
				subcategory.name = name;
				subcategory.status = status;
			 	subcategory.save().then(subcategory => {
					res.json({
						data:subcategory,
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

/* SubCategory delete*/
exports.deleteSubCategory = async (req, res) => {
	try{
		SubCategory.findByIdAndDelete({ _id: req.params.id }, function (err, subcategory) {
			 if (err) res.json(err);
			 else res.json('SubCategory Deleted Successfully');
	 	});
	} catch (err) {
		res.status(500).json({ errors: err.message })
  	}
};