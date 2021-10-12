const { check, validationResult } = require("express-validator");
const User = require('../models/userModel');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); 
const nodemailer = require('nodemailer');

/* Register */
 exports.register = async (req, res, next) => {
 	try {
 		const errors = validationResult(req);
	 	if (!errors.isEmpty()) {
		    const err = {};
		    errors.array().forEach(error => {
		      err[error.param] = error.msg;
		    });
		    return res.status(422).json({ errors: err });
		}
		const {  name, email, password, role, password_confirmation, status} = req.body;
		/* check existing users */
		const existUser = await User.findOne({ email });
		if(existUser)
			return res
			.status(400)
			.json({errors: "Already Exist this email"});

		//hash the password
		const salt = bcrypt.genSaltSync(8);
		const passwordHash = bcrypt.hashSync(password, salt);

	 	const newUser = new User({
			name: name,
			email: email,
			role: role ? role : 'super_admin',
			password: passwordHash,
			status:status,
	  	});

	  	const saveUser = await newUser.save();

	  	//sign in token
	    const token = jwt.sign({
				user: saveUser._id,
			}, 
			process.env.JWT_SECRET,
		);

		saveUser.resetToken = token;
		//saveUser.email_verified_at = Date.now();
	  	saveUser.save();


		const transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			service: 'gmail',
			secure: true,
			auth:{
				user: process.env.GMAIL_EMAIL,
				pass: process.env.GMAIL_PASS,
			},
		});
		const mailOptions = {
		   from: process.env.GMAIL_EMAIL,
		   to: saveUser.email,
		   subject: 'Email verification',
		   html: `<a href="http://localhost:3000/account-verify/${token}" target="_blank">click here to activate your account</a>`
		}; 
		
		transporter.sendMail(mailOptions, (err, data)=>{
			if(err){
				//console.log('error', err);
				res
				.status(400)
				.json({"success": false , message: "Email not send"});
			}
			else{
				//console.log('response', data);
				res
				.status(201)
				.json ({
					"success": true,
					message: "Email send successfully",
				});
			}
		});

		//send token HTTP only cookie
		res
			.cookie("token", token, {
				httpOnly:true,
			})
			.status(201).json({token, 
				user:saveUser,
				message: "Registeration successful",
			})
			.send();

	} catch (err) {
	    console.error(err);
	    res.status(500).send();
  	}

};

/* Login */
exports.login = async (req, res, next) => {
	try {
		const errors = validationResult(req);
 	 	if (!errors.isEmpty()) {
		    const err = {};
		    errors.array().forEach(error => {
		      err[error.param] = error.msg;
		    });
		    return res.status(422).json({ errors: err });
	  	}	
		 const { email, password } = req.body;

		//check exist user	
		const existingUser = await User.findOne({ email });
		if(!existingUser)
			return res
				.status(401)
				.json({
					errors: "Invaild Credentials."
				});

		//check password
		const passwordCorrect = await bcrypt.compare(password, existingUser.password);

		if(!passwordCorrect)
			return res.status(401).json({errors: "Invaild Credentials"});

		//sign the user
		const token = jwt.sign({
			id: existingUser._id,
		}, 
		process.env.JWT_SECRET,
		{expiresIn: 86400 }
		);

		//send token HTTP only cookie
		res
			.cookie("token", token, {
				httpOnly:true,
			})
			.status(201).json({token, 
			user:{
				id: existingUser._id,
				email: existingUser.email,
				role: existingUser.role
			},
			message: "Login successfully",
			})
			.send();

	} catch (err) {
	  	console.error(err);
	   	res.status(500).send();
	}
};

/* Logout */
exports.logout = async (req, res) => {

	res
		.cookie("token", "", {
			httpOnly:true,
			expire: new Date(0),

		})
		.status(201).json({
			message: "Logout successfully",
		})
		.send();
};


/* Check Loggedin User */
exports.loggedIn = async (req, res) => {
	try {
   		const token = req.cookies.token;
		if (!token) return res.json(false);

		jwt.verify(token, process.env.JWT_SECRET);
		return res.json(true);
	} catch (err) {
		console.error(err);
   		res.json(false);
	}
};

/* check tokenIsValid */
exports.tokenIsValid = async (req, res) => {
	try {
   		const token = req.cookies.token;
		if (!token) return res.json(false);

		const verified = jwt.verify(token, process.env.JWT_SECRET);
    	if (!verified) return res.json(false);

    	const user = await User.findById(verified.id);
  		if (!user) return res.json(false);

  		return res.json(true);
	} catch (err) {
   		res.status(500).json({ errors: err.message });
	}
};


/* forgot password */
exports.forgotPassword = async (req, res) => {
	try {
		const {email} = req.body;
		const checkEmail = await User.findOne({email});
		if(!checkEmail)
		return res
			.status(400)
			.json({errors: "User with this email doesn't exist."});
		
		const token = jwt.sign({id:checkEmail._id}, 
			process.env.JWT_SECRET,
			{expiresIn: 86400 }
		);

		checkEmail.resetToken = token;
		checkEmail.resetExpires = Date.now() + 86400;
	  	checkEmail.save();

		const transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			service: 'gmail',
			secure: true,
			auth:{
				user: process.env.GMAIL_EMAIL,
				pass: process.env.GMAIL_PASS,
			},
		});
		const mailOptions = {
		   from: process.env.GMAIL_EMAIL,
		   to: checkEmail.email,
		   subject: 'Reset Password Link',
		   html: `<a href="http://localhost:3000/reset-password/${token}" target="_blank">click here to reset your password</a>`
		}; 
		
		transporter.sendMail(mailOptions, (err, data)=>{
			if(err){
				//console.log('error', err);
				res
				.status(400)
				.json({"success": false , message: "Email not send"});
			}
			else{
				//console.log('response', data);
				res
				.status(201)
				.json ({
					"success": true,
					message: "Email send successfully",
				});
			}
		});
	}catch (err) {
   		res.status(500).json({ errors: err.message });
	}
};

/* resetPassword */
exports.resetPassword = async (req, res) => {
	try{
		User.findOne({ resetToken: req.params.token }).then(user => {
	      if (user == null) {
	         res.json('Password link is invalid or has expired');
	      } else {

	      	//hash the password
			const salt = bcrypt.genSaltSync(8);
			const passwordHash = bcrypt.hashSync(req.body.password, salt);

	      	user.password = passwordHash;
	      	user.resetToken = "";
			user.resetExpires = "";
		  	user.save().then((saveData) => {
				res.status(200).send({
				   success:true,
		           username: user.email,
		           message: 'Password link accepted',
	        	 })
		  	});
	     }
	   })

	}catch (err) {
   		res.status(500).json({ errors: err.message });
	}
};

