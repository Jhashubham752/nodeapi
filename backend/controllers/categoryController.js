const Category = require('../models/categoryModel');
const { check, validationResult } = require("express-validator");

 /* GET categories listing. */
exports.getAllcategory = async (req, res) => {
 	try {
 		const PAGE_SIZE = parseInt(process.env.PAGE_NUMBER);
		const page = parseInt(req.query.page || 1);
		const total = await Category.countDocuments({});

	    const categories = await Category.find()
	    .limit(PAGE_SIZE).skip((page - 1) * PAGE_SIZE);

		res.status(200).json({
			totalPages: Math.ceil(total / PAGE_SIZE),
			total:total,
			current_page:page,
			per_page:PAGE_SIZE,
			data:categories
		});
 	 } catch (err) {
		res.status(500).json({ message: err.message })
  	}
};

/* activeCategory*/
exports.activeCategory = async (req, res) => {
 	try {
 		const activecat = await Category.find({status:["active"]});
		res.status(200).json({
			data:activecat,
		});
 	 } catch (err) {
		res.status(500).json({ message: err.message })
  	}
};

/* category create*/
exports.createCategory = async (req, res) => {
 	try {
 		const errors = validationResult(req);
	 	if (!errors.isEmpty()) {
		    const err = {};
		    errors.array().forEach(error => {
		      err[error.param] = error.msg;
		    });
		    return res.status(422).json({ errors: err });
		}
		const { name, cgst, sgct, cess, status } = req.body;
		
	    const newCategory = new Category({
			name: name,
			cgst: cgst,
			sgct: sgct,
			cess: cess,
			status: status,
	  	});
  	 	const saveCategory = await newCategory.save();

		res.status(201).json({
			category:saveCategory,
			message:"Created Successfully",
			success:true
		});
  	} catch (err) {
		res.status(500).json({ errors: err.message })
  	}
};

/* category edit*/
exports.editCategory = async (req, res) => {
	try{
	  	const categories = await Category.findById(req.params.id);
		res.json({data:categories});

	} catch (err) {
		res.status(500).json({ errors: err.message })
  	}
};


/* Category update*/
exports.updateCategory = async (req, res) => {
	try{
		const errors = validationResult(req);
	 	if (!errors.isEmpty()) {
		    const err = {};
		    errors.array().forEach(error => {
		      err[error.param] = error.msg;
		    });
		    return res.status(422).json({ errors: err });
		}
		const { name, cgst, sgct, cess, status } = req.body;

		Category.findById(req.params.id, function (err, category) {
		 	if (!category){
		 		return next(new Error('Unable To Find Category With This Id'));
		 	}
		 	else {
				category.name = name;
				category.cgst = cgst;
				category.sgct = sgct;
				category.cess = cess;
				category.status = status;
			 	category.save().then(category => {
					res.json({
						data:category,
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
/* Category delete*/
exports.deleteCategory = async (req, res) => {
	try{
		Category.findByIdAndDelete({ _id: req.params.id }, function (err, category) {
			 if (err) res.json(err);
			 else res.json('Category Deleted Successfully');
	 	});
	} catch (err) {
		res.status(500).json({ errors: err.message })
  	}
};