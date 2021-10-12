const Promocode = require('../models/promocodeModel');
const { check, validationResult } = require("express-validator");


/* GET Promocode listing. */
exports.getAllpromocode = async (req, res) => {
 	try {
 		const PAGE_SIZE = parseInt(process.env.PAGE_NUMBER);
		const page = parseInt(req.query.page || 1);
		const total = await Promocode.countDocuments({});

	    const promocodes = await Promocode.find()
	    .limit(PAGE_SIZE).skip((page - 1) * PAGE_SIZE);

		res.status(200).json({
			totalPages: Math.ceil(total / PAGE_SIZE),
			total:total,
			current_page:page,
			per_page:PAGE_SIZE,
			data:promocodes
		});
 	 } catch (err) {
		res.status(500).json({ message: err.message })
  	}
};

/* category create*/
exports.createCode = async (req, res) => {
 	try {
 		const errors = validationResult(req);
	 	if (!errors.isEmpty()) {
		    const err = {};
		    errors.array().forEach(error => {
		      err[error.param] = error.msg;
		    });
		    return res.status(422).json({ errors: err });
		}
		//console.log(req.body);
		const { cat_id, subcat_id, title, promocode, type, discount, from_date, to_date } = req.body;
		
	    const newPromocode = new Promocode({
			cat_id: cat_id ? cat_id : null,
			subcat_id: subcat_id ? subcat_id : null,
			title: title,
			promocode: promocode,
			type: type,
			discount:discount,
			from_date:from_date,
			to_date:to_date
	  	});
  	 	const savePromocode = await newPromocode.save();

		res.status(201).json({
			category:savePromocode,
			message:"Created Successfully",
			success:true
		});
  	} catch (err) {
		res.status(500).json({ errors: err.message })
  	}
};

/* promocode edit*/
exports.editPromocode = async (req, res) => {
	try{
	  	const promocode = await Promocode.findById(req.params.id);
		res.json({data:promocode});

	} catch (err) {
		res.status(500).json({ errors: err.message })
  	}
};


/* Promocode update*/
exports.updatePromocode = async (req, res) => {
	try{
		const errors = validationResult(req);
	 	if (!errors.isEmpty()) {
		    const err = {};
		    errors.array().forEach(error => {
		      err[error.param] = error.msg;
		    });
		    return res.status(422).json({ errors: err });
		}
		const { cat_id, subcat_id, title, promocode, type, discount, from_date, to_date } = req.body;

		Promocode.findById(req.params.id, function (err, promocodeSave) {
		 	if (!promocodeSave){
		 		return next(new Error('Unable To Find Promocode With This Id'));
		 	}
		 	else {
				promocodeSave.cat_id = cat_id ? cat_id : null;
				promocodeSave.subcat_id = subcat_id ? subcat_id : null;
				promocodeSave.title = title;
				promocodeSave.promocode = promocode;
				promocodeSave.type = type;
				promocodeSave.discount = discount;
				promocodeSave.from_date = from_date;
				promocodeSave.to_date = to_date;
			 	promocodeSave.save().then(promocodeSave => {
					res.json({
						data:promocodeSave,
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

/* promocode delete*/
exports.deletePromocode = async (req, res) => {
	try{
		Promocode.findByIdAndDelete({ _id: req.params.id }, function (err, promocode) {
			 if (err) res.json(err);
			 else res.json('Promocode Deleted Successfully');
	 	});
	} catch (err) {
		res.status(500).json({ errors: err.message })
  	}
};

