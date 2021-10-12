const User = require('../models/userModel');
const Role = require('../models/roleModel');

module.exports = permission;

function permission(route='') {
    return [
        // authorize based on user role
       async (req, res, next) => {
        	const user = await User.findOne({_id:req.user});
        	const authPermission = await Role.findOne({role:user.role});

       	 	if (user.role!=='super_admin' && authPermission && authPermission.permission && authPermission.permission.length && !authPermission.permission.includes(route)) {
                // user's role is not authorized
                return res.status(401).json({ 
                	status: 'denied',
                	message: 'Permission Denied'
                });
            } 

            // authentication and authorization successful
            next();
        }
    ];
}