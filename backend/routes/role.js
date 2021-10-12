var express = require('express');
var router = express.Router();
const { check, validationResult } = require("express-validator");
const Role = require('../models/roleModel');
const auth = require('../middleware/auth');
const { getOnerole, getAllrole, createRole, editRole, updateRole, deleteRole } = require("../controllers/roleController");
const permission = require('../middleware/permission');
 /* GET roles listing. */
router.get("/roles", auth, permission("role"), getAllrole);

/*single role get*/
router.get("/role/:name", auth, permission(), getOnerole);

/* create role. */
let validationCreate = [
	check("role", 'The Role is required')
    .not()
      .isEmpty()
      .trim()
      .custom(async (value, {req}) => {
        return Role.find({role:value}).then(role => {
          role.forEach(exist => {
            if (exist.role==req.body.role) {
              throw new Error('Role already in use')
            }
          });
        });
      }),
]; 

router.post("/role/create", auth, permission("role"), validationCreate, createRole);

 /* Edit role. */
router.get("/role/edit/:id", auth, permission("role"), editRole);

 /* Update role. */
 let validationUpdate = [
  check("role", 'The Role is required')
    .not()
      .isEmpty()
      .trim()
      .custom(async (value, {req}) => {
        return Role.find({role:value}).then(data => {
          data.forEach(exist => {
            if (exist._id!=req.body._id) {
              throw new Error('Role already in use')
            }
          });
        });
      }),
];

router.put("/role/update/:id", auth, validationUpdate, permission("role"), updateRole);

 /* Delete role. */
router.post("/role/delete/:id", auth, permission("role"), deleteRole);

module.exports = router;

