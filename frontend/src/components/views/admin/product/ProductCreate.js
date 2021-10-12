import React, { useState, useEffect, useContext } from "react";
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useHistory   } from 'react-router-dom';
import { Redirect } from 'react-router';
/*import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
*/
import Layout from '../../../layout/Layout';
import TextInput from '../../../shared/TextInput';
import TextAreaInput from '../../../shared/TextAreaInput';
import SelectInput from '../../../shared/SelectInput';
import TextRadio from '../../../shared/TextRadio';
import LoadingButton from '../../../shared/LoadingButton';
import ImageUploader from 'react-images-upload';
import AuthContext from '../../../../context/AuthContext';

const ProductCreate = (props) => {
	//history
	const history = useHistory();
	//sending
	const [sending, setSending] = useState(false);

	//priceCode
	const { priceCode, getCodeIcon } = useContext(AuthContext);

	const [ values, setValues] = useState({
		subcat_id:"",
		title:"",
		description:"",
		price:"",
		quantity:"",
		status:"",
	});

	//success
	const [success, setSuccess] = useState(false);

	//productid
	const [ productid, setProductid ] = useState({});

	//images
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

 	//images
	const Images = (picture, base64, type) => {
        setImages(base64);
    }

    //get subcategories
	const [subcategories, setSubCategories] = useState([]);

	useEffect(() => {
		getAllsubcategory();
 	}, []);

	//getAllsubcategory
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


	//productSubmit
	async function handleSubmit(e){
		e.preventDefault();
		try{
			//setTabIndex(1);
			setSending(true);
			values['images'] = images;
			await axios.post('/api/product/create', values).then((res) => {
				// console.log(res);
				setProductid(res.data.product._id);
			 	setSending(false);
			 	setSuccess(true);
			});
		}catch(err) {
			setSending(false);
			if(err && err.response && err.response.data && err.response.data.status=='denied'){
				history.push("/dashboard");
			}
	  		err.response.data.errors && setError(err.response.data.errors);
	    }
	}
		
	//renderimages
	const renderImages = (name, buttonText) => {
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
				label="Images"
				className={` ${error ? 'is-invalid' : ''}`}
			/>
			<div className="invalid-feedback">{error.images}</div>
			</>
		)
	}
	
	return(
		<Layout>
		{success==true &&
		 	<Redirect to={`/admin/product/edit/${productid}`}/>
		}
	  		<Helmet title="Product Create" />
	  		<section className="content-header">
		      <div className="container-fluid">
		        <div className="row mb-2">
		          <div className="col-sm-6">
		            <h1>Product Create</h1>
		          </div>
		        </div>
		      </div>
		    </section>
		    
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
										<option key={key} value={subcategory._id}>
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
							<div className="row">
								<div className="col-md-6">

									<TextInput
										label="Price (per item)"
										type="number"
										placeholder="Price"
										name="price"
										value={values.price}
										onChange={handleChange}
										errors={error.price}
									/>
								</div>
								<div className="col-md-6">
									<TextInput
										label="Quantity"
										type="number"
										placeholder="Quantity"
										name="quantity"
										value={values.quantity}
										onChange={handleChange}
										errors={error.quantity}
									/>
								</div>
							</div>
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
											onChange={handleChange}
										/>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-12">
									<LoadingButton
										type="submit"
										className="btn btn-primary"
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
	    </Layout>
	);
}

export default ProductCreate;