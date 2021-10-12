var express = require('express');
var router = express.Router();
const { check, validationResult } = require("express-validator");
const Customer = require('../models/customerModel');
const auth = require('../middleware/auth');
const permission = require('../middleware/permission');
const { getProduct, createInvoice, getCustomer } = require("../controllers/invoiceController");
 
 /* get suggest product. */
router.get("/auto-suggest", auth, permission("invoice"), getProduct);

 /* get customer. */
router.get("/customers", auth, permission("invoice"), getCustomer);

 /* create customer. */
 let validationCreate = [
  check("name", 'The name is required')
    .not()
      .isEmpty(),
      //.trim(),
      /*.custom(async (value, {req}) => {
        return Customer.find({name:value}).then(customer => {
          customer.forEach(exist => {
            if (exist.id!=req.body._id) {
              throw new Error('Name already in use')
            }
          });
        });
      }),*/

     check("contact", "The phone must have at least 10 characters")
      .notEmpty()
      .isNumeric()
      .isLength({ min: 10, max: 10 })
      .custom(async (value, {req}) => {
        return Customer.find({contact:value}).then(customer => {
          customer.forEach(exist => {
            if (exist.id!=req.body._id) {
              throw new Error('This number already in use')
            }
          });
        });
      }),
];
router.post("/invoice/create", auth, permission("invoice"), validationCreate, createInvoice);

module.exports = router;