import React, { useState, useEffect } from "react";
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useHistory   } from 'react-router-dom';
/*import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';*/
import { Redirect } from 'react-router';

import Layout from '../../../layout/Layout';
import TextInput from '../../../shared/TextInput';
import TextAreaInput from '../../../shared/TextAreaInput';
import SelectInput from '../../../shared/SelectInput';
import TextRadio from '../../../shared/TextRadio';
import LoadingButton from '../../../shared/LoadingButton';
import ImageUploader from 'react-images-upload';

const ProductDuplicate = (props) => {
	const history = useHistory();
	const [sending, setSending] = useState(false);

	const [ values, setValues] = useState({
		subcat_id:"",
		title:"",
		description:"",
		price:"",
		quantity:"",
		status:"",
	});

	const [ images, setImages] = useState([]);

	//error
	const [error, setError] = useState({});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setValues({
			...values,
			[name]: value
		});
 	};

 	const [product, setProduct] = useState({});

 	//images
	const Images = (picture, base64, type) => {
        setImages(base64);
    }
    //setSuccess
    const [success, setSuccess] = useState(false);

    const [subcategories, setSubCategories] = useState([]);

	useEffect(() => {
		getData();
		getAllsubcategory();
 	}, []);

 	async function getAllsubcategory(){
		try {
			await axios.get('/api/subcategory/active').then((res) => {
				setSubCategories(res.data.data);
			});
		}
		catch(err) {
		  	if(err && err.response && err.response.data && err.response.data.status=='denied'){
				history.push("/dashboard");
			}
	    	err.response.data.errors && setError(err.response.data.errors);
	    }	
	}

	//products
	async function getData(){
		try {
			await axios.get('/api/product/create/duplicate/'+props.match.params.id, values).then((res) => {				
			//	console.log(res.data.images);
				//setValues(res.data.data);
				values['subcat_id'] = res.data.data.subcat_id;
				values['description'] = res.data.data.description;
				values['price'] = res.data.data.price;
				values['quantity'] = res.data.data.quantity;
				values['status'] = res.data.data.status;
				setImages(res.data.images)
			});
		}
		catch(err) {
		  	if(err && err.response && err.response.data && err.response.data.status=='denied'){
				history.push("/dashboard");
			}
	    	err.response.data.errors && setError(err.response.data.errors);
	    }	
	}

	//renderimages
	const renderImages = (name, buttonText) => {
		let defaultImage = images;
		return(
				<>
				<ImageUploader
					name={name}
					withIcon={false}
					withPreview={true}
					singleImage={false}
					onChange={(picture, base64) => Images(picture, base64, name)}
					imgExtension={[".jpg", ".gif", ".png", ".jpeg"]}
					maxFileSize={1240000}
					fileSizeError="file size is too big"
					accept="accept=image/*"
					label={buttonText}
					defaultImages={ defaultImage }
					className={` ${error ? 'is-invalid' : ''}`}
				/>
				<div className="invalid-feedback">{error.images}</div>
				</>
		)
	}

	async function handleSubmit(e) {
		e.preventDefault();
		try{
			setSending(true);
			values['images'] = images;
			await axios.post('/api/product/create', values).then((res) => {
				setProduct(res.data.product);
			 	setSending(false);
			 	setSuccess(true);
			});
		}catch(err) {
			setSending(false);
			//console.log(err.response.data);
	  		err.response.data.errors && setError(err.response.data.errors);
	    }
	}
	
	return(
		<Layout>
		{success==true &&
		 <Redirect to={`/admin/product/edit/${product._id}`}/>
		}
	  		<Helmet title="Product Duplicate" />
	  		<section className="content-header">
		      <div className="container-fluid">
		        <div className="row mb-2">
		          <div className="col-sm-6">
		            <h1>Create Duplicate Product</h1>
		          </div>
		        </div>
		      </div>
		    </section>
		    <section className="content">
		      	<div className="container-fluid">
			        <div className="row">
			          	<div className="col-md-12">
				          	<div className="card">
				          		<form onSubmit={handleSubmit}>
					          		<div className="card-body">
					          			<SelectInput
											label="SubCategory"
											placeholder="SubCategory"
											name="subcat_id"
											errors={error.subcat_id}
											value={values.subcat_id}
											onChange={handleChange}
											>
											<option value="">Select SubCategory</option>
											{subcategories.length>0 && subcategories.map((subcategory, key) => {
												return(
													<option key={key} value={subcategory._id} selected={subcategory.name==subcategory.name}>
														{subcategory.name}
													</option>
												);
											})}
										</SelectInput>
										<TextInput
											label="Title"
											type="text"
											placeholder="Title"
											name="title"
											value={values.title}
											onChange={handleChange}
											errors={error.title}
										/>
										
										<TextAreaInput
											label="Description"
											type="text"
											placeholder="Description"
											name="description"
											value={values.description}
											onChange={handleChange}
											errors={error.description}
										/>

										<TextInput
											label="Price (per item)"
											type="number"
											placeholder="Price"
											name="price"
											value={values.price}
											onChange={handleChange}
											errors={error.price}
										/>

										<TextInput
											label="Quantity"
											type="number"
											placeholder="Quantity"
											name="quantity"
											value={values.quantity}
											onChange={handleChange}
											errors={error.quantity}
										/>

										<div className="form-group">
											<div className="col-md-12">
												<div className="images_boxs">
													{renderImages('images', 'Choose Images')}
												</div>
											</div>
										</div>
						
										<div className="form-group">
										<label htmlFor="status">Status</label>
											<div className="row">
												<div className="col-md-6">
													Active
													<TextRadio
														type="radio"
														name="status"
														value="active"
														checked={values.status=='active'} 
														onChange={handleChange}
														errors={error.status}
													/>
												</div>
												<div className="col-md-6">
													Inactive
													<TextRadio
														type="radio"
														value="inactive"
														name="status"
														checked={values.status=='inactive'}
														onChange={handleChange}
													/>
												</div>
											</div>
										</div>
										<div className="row">
											<div className="col-12">
												<LoadingButton
													type="submit"
													className="btn btn-primary btn-block"
													loading={sending}
												>
													Submit
												</LoadingButton>
											</div>
										</div>
									</div>
								</form>
							</div>
          	  			</div>
	          	  	</div>
          		</div>
          	</section>
	    </Layout>
	);
}

export default ProductDuplicate;