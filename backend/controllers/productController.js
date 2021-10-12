const Product = require('../models/productModel');
const Variant = require('../models/variantModel');
const { check, validationResult } = require("express-validator");
const slugify = require("slugify");
const fs = require('fs');
const path = require('path');

/* GET products listing. */
exports.getAllproduct = async (req, res) => {
 	try {
 		const PAGE_SIZE = parseInt(process.env.PAGE_NUMBER);
		const page = parseInt(req.query.page || 1);
		const total = await Product.countDocuments({});

		const products = await Product.find().populate("subcat_id")
	    .limit(PAGE_SIZE).skip((page - 1) * PAGE_SIZE);
	  
		let newImages = [];
	    products.forEach(product => {
	    	const string = product.images.split(",");
    		const dir = process.env.APP_URL+'images';
    		const ig = dir+'/'+string[0];

    		newImages.push({
			    product,
			    img: ig,
			});
	    });

		res.status(200).json({
			totalPages: Math.ceil(total / PAGE_SIZE),
			total:total,
			current_page:page,
			per_page:PAGE_SIZE,
			data:newImages,
		});
 	 } catch (err) {
		res.status(500).json({ message: err.message })
  	}
};

/* products create*/
exports.createProduct = async (req, res) => {
 	try {
 		const errors = validationResult(req);
	 	if (!errors.isEmpty()) {
		    const err = {};
		    errors.array().forEach(error => {
		      err[error.param] = error.msg;
		    });
		    return res.status(422).json({ errors: err });
		}
	
		const { subcat_id, title, description, price, quantity, images, status } = req.body;
		
		//console.log(images);
		let newImg = '';
		images.forEach(image => {
			if(image.includes('data:')){
			  const imgName = Math.floor(Math.random() * 100)+Date.now()+'.png'
		      const imgPath = 'public/images/'+imgName;
	 			if(newImg){
	 				newImg = newImg + ','+ imgName;
	 			}
	 			else {
	 				newImg = imgName;
	 			}
	 
	        	let base64Data = image.split(';base64,').pop();
		        fs.writeFile(imgPath, base64Data,  {encoding: 'base64'}, function(error, data){
		        	if(error){
		        		console.log(error);
		        	}
		        	else{
		        		console.log('done');
		        	}
		 		});
		    }
		    else{
		    	const allimage = image.split('images/');
		    	//console.log('allimage', allimage[1]);
		    	if(newImg){
	 				newImg = newImg + ','+ allimage[1];
	 			}
	 			else {
	 				newImg = allimage[1];
	 			}
		    }
		});
		//slug
		const nameSlug = slugify(title, { lower: true, strict: true });

	    const newProduct = new Product({
			subcat_id:subcat_id,
			title: title,
			slug:nameSlug,
			description: description,
			price: price,
			quantity: quantity,
			images: newImg,
			status: status,
	  	});
  	 	const saveProduct = await newProduct.save();

		res.status(201).json({
			product:saveProduct,
			message:"Created Successfully",
			success:true
		});
  	} catch (err) {
		res.status(500).json({ errors: err.message })
  	}
};

/* product edit*/
exports.editProduct = async (req, res) => {
	try{
	  	const products = await Product.findById(req.params.id);
		const allimages = products.images.split(",");
		let newImages = [];
	    
	    allimages.forEach(item => {
    		const dir = process.env.APP_URL+'images';
    		const ig = dir+'/'+item;
	       newImages.push(ig);
	    });

		res.json({
			data:products,
			images:newImages
		});

	} catch (err) {
		res.status(500).json({ errors: err.message })
  	}
};

/* product duplicate*/
exports.duplicateProduct = async (req, res) => {
	try{
	  	const products = await Product.findById(req.params.id);
		const allimages = products.images.split(",");
		let newImages = [];
	    
	    allimages.forEach(item => {
    		const dir = process.env.APP_URL+'images';
    		const ig = dir+'/'+item;
	       newImages.push(ig);
	    });

		res.json({
			data:products,
			images:newImages
		});

	} catch (err) {
		res.status(500).json({ errors: err.message })
  	}
};

/* product show*/
exports.showProduct = async (req, res) => {
	try{
	const products = await Product.findById(req.params.id).populate('subcat_id');
	const allimages = products.images.split(",");
		let newImages = [];
	    
	    allimages.forEach(item => {
    		const dir = process.env.APP_URL+'images';
    		const ig = dir+'/'+item;
	       newImages.push(ig);
	    });

		res.json({
			data:products,
			images:newImages
		});
	} catch (err) {
		res.status(500).json({ errors: err.message })
  	}
};

/* product update*/
exports.updateProduct = async (req, res) => {
	try{
		const errors = validationResult(req);
	 	if (!errors.isEmpty()) {
		    const err = {};
		    errors.array().forEach(error => {
		      err[error.param] = error.msg;
		    });
		    return res.status(422).json({ errors: err });
		}
		const { subcat_id, title, description, price, quantity, images, status } = req.body;
		//console.log(images);

		let newImg = '';
		images.forEach(image => {
			if(image.includes('data:')){
				const imgName = Math.floor(Math.random() * 100)+Date.now()+'.png'
		    	const imgPath = 'public/images/'+imgName;
	 			if(newImg){
	 				newImg = newImg + ','+ imgName;
	 			}
	 			else {
	 				newImg = imgName;
	 			}
	 
	        	let base64Data = image.split(';base64,').pop();
		        fs.writeFile(imgPath, base64Data,  {encoding: 'base64'}, function(error, data){
		        	if(error){
		        		console.log(error);
		        	}
		        	else{
		        		console.log('done');
		        	}
		 		});
		    }
		    else{
		    	const allimage = image.split('images/');
		    	//console.log('allimage', allimage[1]);
		    	if(newImg){
	 				newImg = newImg + ','+ allimage[1];
	 			}
	 			else {
	 				newImg = allimage[1];
	 			}
 			}
		});
		
		Product.findById(req.params.id, function (err, product) {
		 	if (!product){
		 		return next(new Error('Unable To Find Product With This Id'));
		 	}
		 	else {
		 		product.subcat_id = subcat_id;
		 		product.title = title;
		 		product.description = description;
				product.price = price;
				product.quantity = quantity;
				product.images = newImg;
				product.status = status;
			 	product.save().then(product => {
					res.json({
						data:product,
						success:true,
						message: "Updated successfully", 
					})
				});
			}
		});

	} catch (err) {
		res.status(500).json({ errors: err.message })
  	}
};

/* Products delete*/
exports.deleteProducts = async (req, res) => {
	try{
		Product.findByIdAndDelete({ _id: req.params.id }, function (err, product) {
			 if (err) res.json(err);
			 else res.json('Product Deleted Successfully');
	 	});
	} catch (err) {
		res.status(500).json({ errors: err.message })
  	}
};
