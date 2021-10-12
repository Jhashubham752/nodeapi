const { check, validationResult } = require("express-validator");
const User = require('../models/userModel');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); 
const nodemailer = require('nodemailer');


/* accountVerify */
exports.accountVerify = async (req, res) => {
	try{
		User.findOne({ resetToken: req.params.token }).then(user => {
	      if (user == null) {
	         res.json('Account verfiy link is invalid or has expired');
	      } else {

	      	user.resetToken = "";
			user.email_verified_at = Date.now();
		  	user.save().then((saveData) => {
				res.status(200).send({
				   success:true,
		           message: 'Account verified',
	        	 })
		  	});
	     }
	   })

	}catch (err) {
   		res.status(500).json({ errors: err.message });
	}
};
