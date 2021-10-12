const Setting = require('../models/settingModel');
const User = require('../models/userModel');
const { check, validationResult } = require("express-validator");

 /* GET setting listing. */
exports.getSetting = async (req, res) => {
 	try {
 		const userId = await User.findOne();
	    const setting = await Setting.findOne({user:userId});
		res.status(200).json({data:setting});
 	 } catch (err) {
		res.status(500).json({ message: err.message })
  	}
};


/* Setting create*/
exports.createSetting = async (req, res) => {
 	try {
 		const errors = validationResult(req);
	 	if (!errors.isEmpty()) {
		    const err = {};
		    errors.array().forEach(error => {
		      err[error.param] = error.msg;
		    });
		    return res.status(422).json({ errors: err });
		}
		const userId = await User.findOne();
		const { gst_number, pan_number, company_name, contact, company_address, priceCode, taxable } = req.body;
		
	    const newSetting = new Setting({
	    	user:userId,
			gst_number: gst_number,
			pan_number: pan_number,
			company_name: company_name,
			contact: contact,
			company_address: company_address,
			priceCode: priceCode,
			taxable:taxable,
	  	});
  	 	const saveSetting = await newSetting.save();

		res.status(201).json({
			category:saveSetting,
			message:"Created Successfully",
			success:true
		});
  	} catch (err) {
		res.status(500).json({ errors: err.message })
  	}
};

/* setting edit*/
exports.editSetting = async (req, res) => {
	try{
	  	const setting = await Setting.findById(req.params.id);
		res.json({data:setting});

	} catch (err) {
		res.status(500).json({ errors: err.message })
  	}
};

/* setting update*/
exports.updateSetting = async (req, res) => {
	try{
		const errors = validationResult(req);
	 	if (!errors.isEmpty()) {
		    const err = {};
		    errors.array().forEach(error => {
		      err[error.param] = error.msg;
		    });
		    return res.status(422).json({ errors: err });
		}
		const userId = await User.findOne();
		const { gst_number, pan_number, company_name, contact, company_address, priceCode, taxable } = req.body;
		
		Setting.findById(req.params.id, function (err, setting) {
		 	if (!setting){
		 		return next(new Error('Unable To Find Setting With This Id'));
		 	}
		 	else {
		 		setting.user = userId;
				setting.gst_number = gst_number;
				setting.pan_number = pan_number;
				setting.company_name = company_name;
				setting.contact = contact;
				setting.company_address = company_address;
				setting.priceCode = priceCode;
				setting.taxable = taxable;
			 	setting.save().then(setting => {
					res.json({
						data:setting,
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
/* setting delete*/
exports.deleteSetting = async (req, res) => {
	try{
		Setting.findByIdAndDelete({ _id: req.params.id }, function (err, setting) {
			 if (err) res.json(err);
			 else res.json('Setting Deleted Successfully');
	 	});
	} catch (err) {
		res.status(500).json({ errors: err.message })
  	}
};