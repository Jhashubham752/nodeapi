var express = require('express');
var router = express.Router();
const { check, validationResult } = require("express-validator");
const Variant = require('../models/variantModel');
const auth = require('../middleware/auth');
const permission = require('../middleware/permission');
const { createVariant, singleVariant, getAllvariant, editVariant, updateVariant, deleteVariant } = require("../controllers/variantController");

 /* GET Products listing. */
router.get("/variants/:id", auth, permission("product"), getAllvariant);

/*GET single variant*/
router.get("/variant/single/:id", auth, permission("product"), singleVariant);

 /* create Variant. */
let validationValidate = [
  check("var_name", 'Name is required')
    .not()
      .isEmpty()
      .trim()
      .custom(async (value, {req}) => {
        return Variant.find({var_name:value}).then(variant => {
          variant.forEach(exist => {
            if (exist.id!=req.body._id) {
              throw new Error('Name already in use')
            }
          });
        });
      }),
  
  check("var_price", "Price is not less than zero")
    .isNumeric()
    .notEmpty()
  .isInt({ min: 0 }),
 
  check("var_quantity", "Quantity is not less than zero")
    .isNumeric()
    .notEmpty()
    .isInt({ min: 0 }),
];

router.post("/variant/create", auth, permission("product"), validationValidate, createVariant);

 /* Edit Products Variants. */
router.get("/variant/edit/:id", auth, permission("product"), editVariant);

/*Update product variants*/

router.put("/variant/update/:id", auth, permission("product"), validationValidate, updateVariant);

 /* Delete product variant. */
router.post("/variant/delete/:id", auth, permission("product"), deleteVariant);

module.exports = router;