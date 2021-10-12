const Customer = require('../models/customerModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const { check, validationResult } = require("express-validator");

 /* GET product listing. */
exports.getProduct = async (req, res) => {
 	try {
 		const { keywords } = req.query;
	    const products = await Product.find({title: new RegExp(keywords)});
		res.status(200).json({
			data:products
		});
 	 } catch (err) {
		res.status(500).json({ message: err.message })
  	}
};

 /* GET customer listing. */
exports.getCustomer = async (req, res) => {
 	try {
 		const { contact } = req.query;
 		let customers = [];
 		if(contact){
	    	customers = await Customer.findOne({contact:contact}); 		
 		}
		res.status(200).json({
			data:customers
		});
 	 } catch (err) {
		res.status(500).json({ message: err.message })
  	}
};

/* invoice create*/
exports.createInvoice = async (req, res) => {
 	try {
 		const errors = validationResult(req);
	 	if (!errors.isEmpty()) {
		    const err = {};
		    errors.array().forEach(error => {
		      err[error.param] = error.msg;
		    });
		    return res.status(422).json({ errors: err });
		} 
		const { contact, name, email, gst_number, address, cust_id, product_name, quantity, available_quantity, total_price } = req.body;
		
	  if(!name)
			return res
			.status(400)
			.json({errors: "Name is required."});

			const dataCust = await Customer.findOne({contact:contact});
	   		//customer info
	   		let newCustomer = [];
		   	if(dataCust && dataCust.contact){
		 		dataCust.contact = contact;
		 		dataCust.name = name;
		 		dataCust.email = email;
				dataCust.gst_number = gst_number;
				dataCust.address = address;
			 	dataCust.save().then(dataCust => {
					newCustomer.push({dataCust});
				});
			}
			else{
				const newCustomer = new Customer({
					contact: contact,
					name: name,
					email: email,
					gst_number: gst_number,
					address: address,
		  		});
	  	 		const saveCustomer = await newCustomer.save();
  	 			newCustomer.push({saveCustomer});
			}
			
  	 	//order info 
  	 	const newOrder = new Order({
			cust_id: cust_id,
			product_name: product_name,
			quantity: quantity,
			available_quantity: available_quantity,
			total_price: total_price,
	  	});
  	 	const saveOrder = await newOrder.save();

		res.status(201).json({
			customer:newCustomer,
			order:saveOrder,
			message:"Created Successfully",
			success:true
		});
  	} catch (err) {
		res.status(500).json({ errors: err.message })
  	}
};