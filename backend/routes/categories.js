var express = require('express');
var router = express.Router();
const auth  = require('../middleware/auth');
const { check, validationResult } = require("express-validator");
const Category = require('../models/categoryModel');
const { getAllcategory, activeCategory, createCategory, editCategory, updateCategory, deleteCategory } = require("../controllers/categoryController");
const permission = require('../middleware/permission');
 /* GET Category listing. */
router.get("/categories", auth, permission("category"), getAllcategory);
 
/* active category. */
router.get("/category/active", auth, permission("category"), activeCategory);

/* Create Categories */
let validationCategoryCreate = [
  check("name", 'The name is required')
    .not()
      .isEmpty()
      .trim()
      .custom(async (value, {req}) => {
        return Category.find({name:value}).then(category => {
          category.forEach(exist => {
            if (exist.id!=req.body._id) {
              throw new Error('Name already in use')
            }
          });
        });
      }),

  check("status", 'Status is required').notEmpty(),  
];

router.post("/category/create", auth, permission("category"), validationCategoryCreate, createCategory);

 /* Edit category. */
router.get("/category/edit/:id", auth, permission("category"), editCategory);

 /* Update category. */
let validationCategoryUpdate = [
	check("name", 'The name is required')
    .not()
      .isEmpty()
      .trim()
       .custom(async (value, {req}) => {
        return Category.find({name:value}).then(category => {
          category.forEach(exist => {
            if (exist.id!=req.body._id) {
              throw new Error('Name already in use')
            }
          });
        });
      }),
       
  check("status", 'Status is required').notEmpty(),  
];

router.put("/category/update/:id", validationCategoryUpdate, auth, permission("category"), updateCategory);

 /* Delete category. */
router.post("/category/delete/:id", auth, permission("category"), deleteCategory);

module.exports = router;