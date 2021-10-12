var express = require('express');
var router = express.Router();
const { check, validationResult } = require("express-validator");
const Setting = require('../models/settingModel');
const auth = require('../middleware/auth');
const permission = require('../middleware/permission');
const { getSetting, createSetting, editSetting, updateSetting, deleteSetting } = require("../controllers/settingController");

 /* GET setting listing. */
router.get("/setting", auth, permission("setting"), getSetting);

 /* create setting listing. */
let validationCreate = [
  	check("gst_number", 'Gst Number is required')
    .not()
      .isEmpty()
      .custom(async (value, {req}) => {
        return Setting.find({gst_number:value}).then(item => {
          item.forEach(exist => {
            if (exist.id!=req.body._id) {
              throw new Error('This number is already in use')
            }
          });
        });
      }),

  	check("pan_number", 'Pan Number is required')
    .not()
      .isEmpty()
      .custom(async (value, {req}) => {
        return Setting.find({pan_number:value}).then(item => {
          item.forEach(exist => {
            if (exist.id!=req.body._id) {
              throw new Error('This number is already in use')
            }
          });
        });
      }),

   	check("contact", "The phone must have at least 10 characters")
	   .not()
      .isEmpty()
      .isNumeric()
      .trim()
	    .isNumeric()
      .isLength({ min: 10, max: 10 })
      .custom(async (value, {req}) => {
        return Setting.find({contact:value}).then(setting => {
          setting.forEach(exist => {
            if (exist.id!=req.body._id) {
              throw new Error('This number already in use')
            }
          });
        });
      }),
 

  	check("company_name", 'Company Name is required')
    .not()
      .isEmpty(),

    check("taxable", 'Taxable is required')
    .not()
      .isEmpty(),

    check("priceCode", 'priceCode is required').notEmpty(),

  	check("company_address", 'Company Address is required')
    .not()
      .isEmpty(),
    
];

router.post("/setting/create", auth, permission("setting"), validationCreate, createSetting);

 /* edit setting listing. */
router.get("/setting/edit/:id", auth, permission("setting"), editSetting);

/* update setting*/
router.put("/setting/update/:id", auth, permission("setting"), validationCreate, updateSetting);

 /* Delete setting. */
router.post("/setting/delete/:id", auth, permission("setting"), deleteSetting);

module.exports = router;