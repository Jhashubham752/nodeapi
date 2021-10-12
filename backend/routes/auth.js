var express = require('express');
var router = express.Router();
const { register, login, logout, loggedIn, tokenIsValid, forgotPassword, resetPassword, accountVerify} = require("../controllers/authController");
const { check, validationResult } = require("express-validator");
const User = require('../models/userModel');

let validationsRegister = [
 check("name")
 	.not()
    .isEmpty()
    .withMessage("The name is required "),

  check("email", 'Email is required')
    .isEmail()
    .trim()
    .custom(async (email) => {
            const existingUser = 
              await User.findOne({ email })
                
          if (existingUser) {
              throw new Error('Email already in use')
          }
      }),

  check("password", 'The password must have at least 6 characters')
    .isLength({ min: 6 }),

  check("password_confirmation")
    .isLength({ min: 6 })
    .withMessage("The password must have at least 6 characters")
    .custom((value , { req }) => {
	    if (value !== req.body.password) {
	        throw new Error('Password confirmation is incorrect');
	    } 
	    return true;
	}),
]; 
/* Register */
router.post("/register", validationsRegister, register);

let validationLogin = [
  check("email")
    //.isEmpty()
    .isEmail()
    .withMessage('Email is required')
    .trim(),
    
  check("password", 'The password must have at least 6 characters')
    .isLength({ min: 6 })
    .custom((value , { req }) => {
	    if (value !== req.body.password) {
	        throw new Error('Password confirmation is incorrect');
	    } 
	    return true;
	}),
]; 
/* Login */
router.post("/login", validationLogin, login);

/* Logout */
router.get("/logout", logout);

/* check loggedIn user */
router.get("/loggedIn", loggedIn);

/* check tokenIsValid */
router.post("/tokenIsValid", tokenIsValid);

/* check ForgotPassword */
router.post("/forgot-password", forgotPassword);

/* check resetPassword */
router.post("/reset-password/:token", resetPassword);

module.exports = router;