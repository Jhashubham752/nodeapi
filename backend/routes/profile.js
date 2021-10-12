var express = require('express');
var router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require('../models/userModel');
const bcrypt = require("bcryptjs");
const auth = require('../middleware/auth');
const { updateProfile, upadtePassword  } = require("../controllers/profileController");

/* update profile. */
let validation = [
    check("contact_number", "The phone must have at least 10 characters")
      .notEmpty()
      .isNumeric()
      .isLength({ min: 10, max: 10 })
      .custom(async (value, {req}) => {
        return User.find({contact_number:value}).then(user => {
          user.forEach(exist => {
            if (exist._id!=req.body._id) {
              throw new Error('This number is already in use')
            }
          });
        });
      }),
];

router.put("/profile/:id", validation, auth, updateProfile);

/*changepassword*/
let validationPassword = [
  check("new_password", 'The password must have at least 6 characters')
    .isLength({ min: 6 }),
    

  check("confirm_password", 'The password must have at least 6 characters')
    .isLength({ min: 6 })
    .custom((value , { req }) => {
      if (value !== req.body.new_password) {
          throw new Error('Password confirmation is incorrect');
      } 
      return true;
    }),

  check("old_password", "The password must have at least 6 characters")
    .isLength({ min: 6 })
    .custom(async (value, {req}) => {
      const existingUser = await User.findById(req.params.id)
      //check password
      const passwordCorrect = await bcrypt.compare(value, existingUser.password);
        if (!passwordCorrect) {
          throw new Error("Old Password doesn't match");
        } 
        return true;
    }),

];
router.put("/changepassword/:id", auth, validationPassword, upadtePassword);

module.exports = router;

