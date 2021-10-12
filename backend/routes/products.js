var express = require('express');
var router = express.Router();
const { check, validationResult } = require("express-validator");
const Product = require('../models/productModel');
const auth = require('../middleware/auth');
const permission = require('../middleware/permission');
const { getAllproduct, createProduct, editProduct, duplicateProduct, showProduct, updateProduct, deleteProducts } = require("../controllers/productController");

 /* GET Products listing. */
router.get("/products", auth, permission("product"), getAllproduct);

/* Create products */
let validationProductCreate = [
 check("subcat_id", 'SubCategory is required')
    .not()
      .isEmpty(),

  check("title", 'The Title is required')
    .not()
      .isEmpty()
      .custom(async (value, {req}) => {
        return Product.find({title:value}).then(item => {
          item.forEach(exist => {
            if (exist.id!=req.body._id) {
              throw new Error('Title already in use')
            }
          });
        });
      }),
       
 check("description", 'Description is required')
  .not()
      .isEmpty(),

  check("price", 'Price is required')
  .isNumeric()
  .notEmpty(),

  check("quantity", 'Quantity is required')
  .isNumeric()
  .notEmpty(),

  check("images", 'Images is required')
  .notEmpty(),
  
  check("status", 'Status is required').notEmpty(),  
];

router.post("/product/create", auth, permission("product"), validationProductCreate, createProduct);

 /* Edit Products. */
router.get("/product/edit/:id", auth, permission("product"), editProduct);

 /* duplicate Product. */
router.get("/product/create/duplicate/:id", auth, permission("product"), duplicateProduct);

 /* showProduct Products. */
router.get("/product/show/:id", auth, permission("product"), showProduct);

/* Update products */
let validationProductUpdate = [
 check("subcat_id", 'SubCategory is required')
    .not()
      .isEmpty(),

  check("title", 'The Title is required')
    .not()
      .isEmpty()
      .custom(async (value, {req}) => {
        return Product.find({title:value}).then(item => {
          item.forEach(exist => {
            if (exist.id!=req.body._id) {
              throw new Error('Title already in use')
            }
          });
        });
      }),
       
 check("description", 'Description is required')
  .not()
    .isEmpty(),

  check("price", 'Price is required')
  .isNumeric()
  .notEmpty(),

  check("quantity", 'Quantity is required')
  .isNumeric()
  .notEmpty(),

  check("images", 'Images is required')
  .notEmpty(),

  check("status", 'Status is required').notEmpty(),  
];
router.put("/product/update/:id", auth, permission("product"), validationProductUpdate, updateProduct);

 /* Delete product. */
router.post("/product/delete/:id", auth, permission("product"), deleteProducts);

module.exports = router;