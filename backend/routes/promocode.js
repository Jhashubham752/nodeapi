var express = require('express');
var router = express.Router();
const auth  = require('../middleware/auth');
const permission = require('../middleware/permission');
const { check, validationResult } = require("express-validator");
const Promocode = require('../models/promocodeModel');

const { getAllpromocode, createCode, editPromocode, updatePromocode, deletePromocode } = require("../controllers/promocodeController");

 /* GET Category listing. */
router.get("/promocode", auth, permission("promocode"), getAllpromocode);
 
/* Create promocode */
let validationCreate = [
  check("title", 'The Title is required')
    .not()
      .isEmpty()
      .trim()
      .custom(async (value, {req}) => {
        return Promocode.find({title:value}).then(promocode => {
          promocode.forEach(exist => {
            if (exist.id!=req.body._id) {
              throw new Error('Title already in use')
            }
          });
        });
      }),

  	check("promocode", 'The Promocode is required')
    .not()
      .isEmpty()
      .trim()
      .custom(async (value, {req}) => {
        return Promocode.find({promocode:value}).then(promocode => {
          promocode.forEach(exist => {
            if (exist.id!=req.body._id) {
              throw new Error('Promocode already in use')
            }
          });
        });
      }),

 	check("type", 'Type is required').notEmpty(),  

  	check("discount", 'Discount is required').notEmpty(), 

  	//check("from_date", 'From Date is required').notEmpty(),

  	//check("to_date", 'To Date is required').notEmpty(),
];

router.post("/promocode/create", auth, permission("promocode"), validationCreate, createCode);

 /* Edit promocode. */
router.get("/promocode/edit/:id", auth, permission("promocode"), editPromocode);

 /* Update promocode. */
router.put("/promocode/update/:id", auth, permission("promocode"), validationCreate, updatePromocode);

 /* Delete promocode. */
router.post("/promocode/delete/:id", auth, permission("promocode"), deletePromocode);

module.exports = router;
