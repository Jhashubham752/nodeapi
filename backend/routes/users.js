var express = require('express');
var router = express.Router();
const auth = require('../middleware/auth');
const permission = require('../middleware/permission');
const { accountVerify } = require("../controllers/accountverifyController");
const { check, validationResult } = require("express-validator");
const User = require('../models/userModel');

const { getAlluser, getUser, createUser, editUser, updateUser, deleteUser} = require("../controllers/userController");

/* check accountVerify */
router.post("/account-verify/:token", permission(), accountVerify);

 /* GET users listing. */
router.get("/users", auth, permission("user"), getAlluser);

 /* GET single user. */
router.get("/user", auth, permission(), getUser);

/* create user. */
let validationUserCreate = [
   check("name", 'The name is required')
    .not()
      .isEmpty()
      .trim()
      .custom(async (value, {req}) => {
        return User.find({name:value}).then(user => {
          user.forEach(exist => {
            if (exist.id!=req.body._id) {
              throw new Error('Name already in use')
            }
          });
        });
      }),

  check("email", 'Email is required')
    .isEmail()
    .trim()
    .custom(async (value, {req}) => {
      return User.find({email:value}).then(user => {
          user.forEach(exist => {
            if (exist.id!=req.body._id) {
              throw new Error('Email already in use')
            }
          });
        });
      }),

    check("contact_number", "The phone must have at least 10 characters")
      .notEmpty()
      .isNumeric()
      .isLength({ min: 10, max: 10 })
      .custom(async (value, {req}) => {
        return User.find({contact_number:value}).then(user => {
          user.forEach(exist => {
            if (exist.contact_number==req.body.contact_number) {
              throw new Error('This number is already in use')
            }
          });
        });
      }),

    check("role", 'Role is required')
    .notEmpty(),
   
    check("status", 'Status is required').notEmpty(),
    
]; 
router.post("/user/create", validationUserCreate, auth, permission("user"), createUser);

 /* Edit user. */
router.get("/user/edit/:id", auth, permission("user"), editUser);

 /* Update user. */
 let validationUserUpdate = [
   check("name", 'The name is required')
    .not()
      .isEmpty()
      .trim()
      .custom(async (value, {req}) => {
        return User.find({name:value}).then(user => {
          user.forEach(exist => {
            if (exist.id!=req.body._id) {
              throw new Error('Name already in use')
            }
          });
        });
      }),
    

  check("email", 'Email is required')
    .isEmail()
    .trim()
     .custom(async (value, {req}) => {
        return User.find({email:value}).then(user => {
            user.forEach(exist => {
              if (exist.id!=req.body._id) {
                throw new Error('Email already in use')
              }
            });

        });
    }),
   
    check("contact_number", 'The phone must have at least 10 characters')
    .not()
      .isEmpty()
      .isNumeric()
      .trim()
      .isLength({ min: 10, max: 10 })
      .custom(async (value, {req}) => {
        return User.find({contact_number:value}).then(user => {
          user.forEach(exist => {
            if (exist.id!=req.body._id) {
              throw new Error('This number already in use')
            }
          });
        });
      }),
 //.isMobilePhone()
    check("role", 'Role is required')
    .notEmpty(),
    
    check("status", 'Status is required').notEmpty(),
    
];
router.put("/user/update/:id", validationUserUpdate, auth, permission("user"), updateUser);

 /* Delete user. */
router.post("/user/delete/:id", auth, permission("user"), deleteUser);

module.exports = router;
