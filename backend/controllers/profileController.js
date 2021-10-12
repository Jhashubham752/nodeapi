const User = require('../models/userModel');
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

/* updateProfile update*/
exports.updateProfile = async (req, res) => {
	try{
		const errors = validationResult(req);
	 	if (!errors.isEmpty()) {
		    const err = {};
		    errors.array().forEach(error => {
		      err[error.param] = error.msg;
		    });
		    return res.status(422).json({ errors: err });
		}
		const { name, role, email, contact_number } = req.body;
		User.findById(req.params.id, function (err, user) {	
		 	if (!user){
		 		return next(new Error('Unable To Find User With This Id'));
		 	}
		 	else {
		 		user.name = name;
		 		user.role = role;
		 		user.email = email;
				user.contact_number = contact_number;
			 	user.save().then(user => {
					res.json({
						data:user,
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

/* changePassword update*/
exports.upadtePassword = async (req, res) => {
	try{
		const errors = validationResult(req);
	 	if (!errors.isEmpty()) {
		    const err = {};
		    errors.array().forEach(error => {
		      err[error.param] = error.msg;
		    });
		    return res.status(422).json({ errors: err });
		}
		const { new_password } = req.body;
		
		//hash the password
		const salt = bcrypt.genSaltSync(8);
		const passwordHash = bcrypt.hashSync(new_password, salt);

		User.findById(req.params.id, function (err, user) {	
		 	if (!user){
		 		return next(new Error('Unable To Find User With This Id'));
		 	}
		 	else {
		 		user.password = passwordHash;
			 	user.save().then(user => {
					res.json({
						data:user,
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
