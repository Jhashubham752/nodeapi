var express = require('express');
var router = express.Router();
const { check, validationResult } = require("express-validator");
const SubCategory = require('../models/subcategoryModel');
const auth = require('../middleware/auth');
const { getAllsubCategory, activeSubCategory, createSubCategory, editSubCategory, updateSubCategory, deleteSubCategory } = require("../controllers/subcategoryController");
const permission = require('../middleware/permission');
 /* GET SubCategory listing. */
router.get("/subcategories", auth, permission("subcategory"), getAllsubCategory);

/* active category. */
router.get("/subcategory/active", auth, permission("subcategory"), activeSubCategory);


/* Create Subcategories */
let validationSubCategoryCreate = [
 check("cat_id", 'Category is required')
    .not()
      .isEmpty(),

  check("name", 'The name is required')
    .not()
      .isEmpty()
      .custom(async (value, {req}) => {
        return SubCategory.find({name:value}).then(subcategory => {
          subcategory.forEach(exist => {
            if (exist.id!=req.body._id) {
              throw new Error('Name already in use')
            }
          });
        });
      }),

  check("status", 'Status is required').notEmpty(),  
];

router.post("/subcategory/create", auth, permission("subcategory"), validationSubCategoryCreate, createSubCategory);

 /* Edit subcategory. */
router.get("/subcategory/edit/:id", auth, permission("subcategory"), editSubCategory);

 /* Update subcategory. */
let validationSubCategoryUpdate = [
 check("cat_id", 'Category is required')
    .not()
      .isEmpty(),

  check("name", 'The name is required')
    .not()
      .isEmpty()
       .custom(async (value, {req}) => {
        return SubCategory.find({name:value}).then(subcategory => {
          subcategory.forEach(exist => {
            if (exist.id!=req.body._id) {
              throw new Error('Name already in use')
            }
          });
        });
      }),
      
  check("status", 'Status is required').notEmpty(),  
];
router.put("/subcategory/update/:id", auth, permission("subcategory"), validationSubCategoryUpdate, updateSubCategory);

 /* Delete subcategory. */
router.post("/subcategory/delete/:id", auth, permission("subcategory"), deleteSubCategory);

module.exports = router;