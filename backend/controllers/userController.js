const User = require('../models/userModel');
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Role = require('../models/roleModel');

 /* GET users listing. */
exports.getAlluser = async (req, res) => {
 	try {
 		const roles = await Role.distinct("role");
 		const PAGE_SIZE = parseInt(process.env.PAGE_NUMBER);
		const page = parseInt(req.query.page || 1);
		const total = await User.countDocuments({role:roles});

		const users = await User.find({role:roles})
	    .limit(PAGE_SIZE).skip((page - 1) * PAGE_SIZE);
	    //console.log(users);
		res.status(200).json({
			totalPages: Math.ceil(total / PAGE_SIZE),
			total:total,
			current_page:page,
			per_page:PAGE_SIZE,
			data:users,
		})
 	 } catch (err) {
		res.status(500).json({ message: err.message })
  	}
};

/* user find with their id */
exports.getUser = async (req, res) => {
 	try {
	    const users = await User.findById(req.user);
		res.json(users);
  	} catch (err) {
		res.status(500).json({ message: err.message })
  	}
};

/* user create*/
exports.createUser = async (req, res) => {
 	try {
 		const errors = validationResult(req);
	 	if (!errors.isEmpty()) {
		    const err = {};
		    errors.array().forEach(error => {
		      err[error.param] = error.msg;
		    });
		    return res.status(422).json({ errors: err });
		}
		const {  name, email, role, contact_number, status} = req.body;
		//hash the password
		const salt = bcrypt.genSaltSync(8);
		const passwordHash = bcrypt.hashSync("123456", salt);

	    const newUser = new User({
			name: name,
			email: email,
			role: role,
			password:passwordHash,
			contact_number:contact_number,
			status: status,
	  	});
  	 	const saveUser = await newUser.save();

		res.status(201).json({
			user:saveUser,
			message:"Created Successfully",
			success:true
		});
  	} catch (err) {
		res.status(500).json({ errors: err.message })
  	}
};

/* user edit*/
exports.editUser = async (req, res) => {
	try{
	  	const users = await User.findById(req.params.id);
		res.json({data:users});

	} catch (err) {
		res.status(500).json({ errors: err.message })
  	}
};

/* user update*/
exports.updateUser = async (req, res) => {
	try{
		const errors = validationResult(req);
	 	if (!errors.isEmpty()) {
		    const err = {};
		    errors.array().forEach(error => {
		      err[error.param] = error.msg;
		    });
		    return res.status(422).json({ errors: err });
		}
		const {  name, email, role, contact_number, status} = req.body;
	
		const salt = bcrypt.genSaltSync(8);
		const passwordHash = bcrypt.hashSync("123456", salt);

		User.findById(req.params.id, function (err, user) {
		 	if (!user){
		 		return next(new Error('Unable To Find User With This Id'));
		 	}
		 	else {
				user.name = name;
				user.password = user.password;
				user.email = email;
				user.role = role;
				user.contact_number = contact_number;
				user.status = status;
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
/* user delete*/
exports.deleteUser = async (req, res) => {
	try{
		User.findByIdAndDelete({ _id: req.params.id }, function (err, user) {
			 if (err) res.json(err);
			 else res.json('User Deleted Successfully');
	 	});
	} catch (err) {
		res.status(500).json({ errors: err.message })
  	}
};