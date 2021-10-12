const Role = require('../models/roleModel');
const { check, validationResult } = require("express-validator");

 /* GET roles listing. */
exports.getAllrole = async (req, res) => {
 	try {
 		const PAGE_SIZE = parseInt(process.env.PAGE_NUMBER);
		const page = parseInt(req.query.page || 1);
		const total = await Role.countDocuments({});

		const roles = await Role.find()
	    .limit(PAGE_SIZE).skip((page - 1) * PAGE_SIZE);

		res.status(200).json({
			totalPages: Math.ceil(total / PAGE_SIZE),
			total:total,
			current_page:page,
			per_page:PAGE_SIZE,
			data:roles
		});
 	 } catch (err) {
		res.status(500).json({ message: err.message })
  	}
};

 /* single role get. */
exports.getOnerole = async (req, res) => {
 	try {
	    const data = await Role.findOne({role:req.params.name});
	 	res.status(200).json({
			data:data
		});
 	 } catch (err) {
		res.status(500).json({ message: err.message })
  	}
};


/* Role create*/
exports.createRole = async (req, res) => {
 	try {
 		const errors = validationResult(req);
	 	if (!errors.isEmpty()) {
		    const err = {};
		    errors.array().forEach(error => {
		      err[error.param] = error.msg;
		    });
		    return res.status(422).json({ errors: err });
		}
		const { role, permission } = req.body;
	    const newRole = new Role({
			role: role,
			permission:JSON.stringify(permission),
	  	});
  	 	const saveRole = await newRole.save();

		res.status(201).json({
			user:saveRole,
			message:"Created Successfully",
			success:true
		});
  	} catch (err) {
		res.status(500).json({ errors: err.message })
  	}
};

/* Role edit*/
exports.editRole = async (req, res) => {
	try{
	  	const roles = await Role.findById(req.params.id);
		res.json({data:roles});

	} catch (err) {
		res.status(500).json({ errors: err.message })
  	}
};

/* Role update*/
exports.updateRole = async (req, res) => {
	try{
		const errors = validationResult(req);
	 	if (!errors.isEmpty()) {
		    const err = {};
		    errors.array().forEach(error => {
		      err[error.param] = error.msg;
		    });
		    return res.status(422).json({ errors: err });
		}
		const { role, permission } = req.body;

		Role.findById(req.params.id, function (err, dataRole) {	
		 	if (!dataRole){
		 		return next(new Error('Unable To Find Role With This Id'));
		 	}
		 	else {
				dataRole.role = role;
				dataRole.permission = JSON.stringify(permission);
			 	dataRole.save().then(data => {
					res.json({
						data:data,
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
/* role delete*/
exports.deleteRole = async (req, res) => {
	try{
		Role.findByIdAndDelete({ _id: req.params.id }, function (err, role) {
			 if (err) res.json(err);
			 else res.json('Role Deleted Successfully');
	 	});
	} catch (err) {
		res.status(500).json({ errors: err.message })
  	}
};