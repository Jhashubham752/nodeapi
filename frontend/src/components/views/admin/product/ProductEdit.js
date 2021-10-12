import React, { useState, useEffect, useContext } from "react";
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useHistory   } from 'react-router-dom';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Code } from 'react-content-loader';
import Pagination from "react-js-pagination";

import Layout from '../../../layout/Layout';
import TextInput from '../../../shared/TextInput';
import TextAreaInput from '../../../shared/TextAreaInput';
import SelectInput from '../../../shared/SelectInput';
import TextRadio from '../../../shared/TextRadio';
import LoadingButton from '../../../shared/LoadingButton';
import ImageUploader from 'react-images-upload';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Modal from 'react-awesome-modal';
import swal from 'sweetalert';
import AuthContext from '../../../../context/AuthContext';
import NumberFormat from 'react-number-format';

const ProductEdit = (props) => {
	//pagination
	const [activePage, setActivePage] = useState(1);
	const [totalItemsCount, setTotalItemsCount] = useState(0);
	const [itemsCountPerPage, setItemsCountPerPage] = useState(0);

	//setindex
	const [tabIndex, setTabIndex] = useState(0);
	//history
	const history = useHistory();
	//sending
	const [sending, setSending] = useState(false);

	//modal
	const [modal, setModal] = useState(false);

	const [ values, setValues] = useState({
		subcat_id:"",
		title:"",
		description:"",
		price:"",
		quantity:"",
		status:"",
	});
	//productid
	const [ productid, setProductid ] = useState({});
	//setEditVarKey
	const [ editVarKey, setEditVarKey ] = useState([]);

	//priceCode
	const { priceCode, getCodeIcon } = useContext(AuthContext);

	//images
	const [ images, setImages] = useState([]);

	//variants multiple values
	const [inputList, setInputList] = useState([{var_title: "", var_value: "" }]);

	//variants values
	const [variantvalue, setVariantvalue] = useState({
		product_id: "", 
		var_name: "", 
		var_price: "",
		var_quantity:"", 
	});
	//allvariants
	const [ variants, setVariants] = useState([]);
	
	//open modal variants
	const openModal=()=>{
		setEditVarKey([]);
        setVariantvalue({
        	product_id: "", 
			var_name: "", 
			var_price: "",
			var_quantity:"", 
        });
        setInputList([{var_title:"", var_value:""}]);
        setError({});
        setModal(true);
    }

    //edit variants
  	const openEditModal = item => {
  		try {
			 axios.get('/api/variant/edit/'+item).then((res) => {
				setEditVarKey(item);
				setVariantvalue(res.data.data);
				setInputList(JSON.parse(res.data.data.data));
			});
		}
		catch(err) {
		  		//console.log(err.response.data.errors);
	    	 err.response.data.errors && setError(err.response.data.errors);
	    }
    	setModal(true);
    	setError({});
  	}

    //close modal
    const closeModal=()=>{
        setModal(false);
    }

	//error
	const [error, setError] = useState({});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setValues({
			...values,
			[name]: value
		});
 	};

 	//variant
 	const handleChangevar = (e) => {
		const { name, value } = e.target;
		setVariantvalue({
			...variantvalue,
			[name]: value
		});
 	};

 	//variants
	const handleChangeVariant = (i, e) => {
	  const { name, value } = e.target;
	  const values = [...inputList];
	  values[i][name] = value;
	  setInputList(values);
	};

	const handleRemoveClick = i => {
	  const values = [...inputList];
	  values.splice(i, 1);
	  setInputList(values);
	};

	const handleAddClick = () => {
	  setInputList([...inputList, { var_title: "", var_value: "" }]);
	};

 	//images
	const Images = (picture, base64, type) => {
        setImages(base64);
    }
    //subcategories
    const [subcategories, setSubCategories] = useState([]);

	useEffect(() => {
		getData();
		getAllsubcategory();
		getAllvariants();
 	}, [activePage]);

 	
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

	//pagination
 	const handlePageChange = (page) => {
    	setActivePage(page);
 	}

	//getAllvariants
	async function getAllvariants(){
		try {
			setSending(true);
			await axios.get('/api/variants/'+props.match.params.id+'?page='+activePage).then((res) => {
				setSending(false);
				setVariants(res.data.data);
				setItemsCountPerPage(res.data.per_page);
				setTotalItemsCount(res.data.total);
			});
		}
		catch(err) {
			setSending(false);
			if(err && err.response && err.response.data && err.response.data.status=='denied'){
				history.push("/dashboard");
			}
	    	err.response.data.errors && setError(err.response.data.errors);
	    }	
	}

	//products
	async function getData(){
		try {
			await axios.get('/api/product/edit/'+props.match.params.id, values).then((res) => {				
			//	console.log(res.data.images);
				setValues(res.data.data);
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

	//handleSubmitproduct
	async function handleSubmitproduct(e) {
		e.preventDefault();
		try{
			setSending(true);
			values['images'] = images;
			await axios.put('/api/product/update/'+props.match.params.id, values).then((res) => {
				//console.log(res);
			 	setSending(false);
			 	setProductid(res.data.data._id);
				setTabIndex(1);
			});
		}catch(err) {
			setSending(false);
			if(err && err.response && err.response.data && err.response.data.status=='denied'){
				history.push("/dashboard");
			}
	  		err.response.data.errors && setError(err.response.data.errors);
	    }
	}

	//delete variants
  	const popupDelete = (item) =>{
  		try {
			swal({
				title: "Are you sure?",
				text: "Are you sure to Delete?",
				icon: "warning",
				buttons: true,
				dangerMode: true,
			})
			.then(willDelete => {
				if (willDelete) {
				  	axios.post('/api/variant/delete/'+item).then((res) => {
						//console.log(res);
						getAllvariants();
						setTabIndex(1);
						 setVariantvalue({
				        	product_id: "", 
							var_name: "", 
							var_price: "",
							var_quantity:"", 
				        });
				        setInputList([{var_title:"", var_value:""}]);
						swal("Deleted!", "Product Variant has been deleted!", "success");
					});
				}
			});
		
		}
		catch(err) {
			swal("Oops!", "Something went wrong!", "error");
		  	if(err && err.response && err.response.data && err.response.data.status=='denied'){
				history.push("/dashboard");
			}
	    	err.response.data.errors && setError(err.response.data.errors);
	    }
  	}

	//handleSubmitvariant
	async function handleSubmitvariant(e) {
		e.preventDefault();
		try{
			setSending(true);
			variantvalue['product_id'] = props.match.params.id;
			variantvalue['data'] = inputList; 
			if(editVarKey.length>0){
				await axios.put('/api/variant/update/'+editVarKey, variantvalue).then((res) => {
					setSending(false);
					setModal(false);
				 	setTabIndex(1);
			 		getAllvariants();
				});
			}
			else{
				await axios.post('/api/variant/create', variantvalue).then((res) => {
					setSending(false);
					setModal(false);
				 	setTabIndex(1);
				 	getAllvariants();
				});
			}
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

	//product form
	const renderProductform = () => {
		return(
			<div className="card">
          		<form onSubmit={handleSubmitproduct}>
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
									className="btn btn-primary"
									loading={sending}
								>
									Update
								</LoadingButton>
							</div>
						</div>
					</div>
				</form>
			</div>
		)
	}

	//modal variant form
	const renderFormModal = () => {
		return(
			<div className="row">
	          	<div className="col-md-6">
		          	<div className="card">
		                <Modal visible={modal} width="600" height="450" effect="fadeInUp">
		                 	<div className="scrollmodal">
		                 	<section className="content-header">
			      				<div className="container-fluid">
							        <div className="row">
							          <div className="col-md-12">
							            <h3>Variant {editVarKey.length>0 ? 'Edit' : 'Create'}
							           		<div className="pull-right">
												<button className="closeModal" onClick={closeModal}><span className="close-icon">x</span></button>
											</div>
							            </h3>
							          </div>
							        </div>
					  		 	</div>
			  			 	</section>
			          			{renderVariantfields()}
		                    </div>
		                </Modal>
            		</div>
            	</div>
          </div>
		)
	}

	const renderVariantfields = () => {
		return(
			<form onSubmit={handleSubmitvariant}>
          		<div className="card-body">
          			<div className="row">
						<div className="col-12">
							<TextInput
								label="Name"
								type="text"
								placeholder="Name"
								name="var_name"
								value={variantvalue.var_name}
								onChange={handleChangevar}
								errors={error.var_name}
							/>
							<div className="row">
								<div className="col-md-6">
									<TextInput
										label="Price (per item)"
										type="number"
										placeholder="Price"
										name="var_price"
										value={variantvalue.var_price}
										onChange={handleChangevar}
										errors={error.var_price}
									/>
								</div>
								<div className="col-md-6">
									<TextInput
										label="Quantity"
										type="number"
										placeholder="Quantity"
										name="var_quantity"
										value={variantvalue.var_quantity}
										onChange={handleChangevar}
										errors={error.var_quantity}
									/>
								</div>
							</div>
							{inputList.map((field, i) => {
								return(
									<div className="row" key={i}>
										<div className="col-md-5">
											<TextInput
												label="Title"
												type="text"
												placeholder="Title"
												name="var_title"
												data-id={i}
												required
												value={field.var_title}
												onChange={(e) => handleChangeVariant(i, e)}
												errors={error.var_title}
											/>
										</div>
										<div className="col-md-5">
											<TextInput
												label="Value"
												type="text"
												placeholder="Value"
												name="var_value"
												data-id={i}
												required
											 	value={field.var_value}
												onChange={(e)=> handleChangeVariant(i, e)}
												errors={error.var_value}
											/>
										</div>
									 	
										<div className="col-md-2 fields_array">
										{i==0 &&
									 		<span className="btn btn-primary" title="Add" onClick={handleAddClick}>
									 			<i className="fa fa-plus" aria-hidden="true"></i>
									 		</span>
									 	
									 	}	
								 	 	{i>0 &&
										 	<span className="btn btn-danger" title="Delete" onClick={() => handleRemoveClick(i)}>
								            	<i className="far fa-trash-alt" aria-hidden="true"></i>
							            	</span>
							            }
							            </div>
									</div>
								);
					 	 	})}
							<LoadingButton
								type="submit"
								className="btn btn-success"
								loading={sending}
							>
								{editVarKey.length>0 ? 'Update' : 'Submit'}
							</LoadingButton>
						</div>
					</div>
				</div>
			</form>
		)
	}

	//variant form
	const renderVariantform = () =>{
		return(
			<div className="card">
				{renderVariantfields()}
      		</div>
		)
	}

	const renderVariantTabledata = () =>{
		return(
	    	<div className="col-md-12">
	    		{renderFormModal()}
	   		
	            <div className="card">
	             	<div className="card-header">
	               		<h3 className="card-title">Variants list</h3>
	                	<div className="card-tools">
	                 		<Link className="btn btn-success" onClick={openModal}>+ Add Variant</Link>
	                	</div>
	              	</div>

	              	<div className="card-body p-0">
		                <table className="table table-striped projects">
		                  <thead>
		                    <tr>
		                      <th>Name</th>
		                      <th>Price</th>
		                      <th>Quantity</th>
		                      <th>Action</th>
		                    </tr>
		                  </thead>
		                  	{sending &&
			              		<Code  
								   	style={{ width: '100%', padding: 10, }} 
					            	speed={2}
								    backgroundColor="#f3f3f3"
								    foregroundColor="#c1c5c7"
			           			/>
		              		} 
		                  <tbody>
		                  	{!sending && variants.length>0 && variants.map((item, i) => {
		                  		return(
		                  			<tr key={i}>
		                  				<td>{item.var_name}</td>
		                  				<td>
              								{priceCode && priceCode=='in' ?
											<span>&#8377;</span>
											:
											<span>$</span>
											}
											<NumberFormat value={item.var_price} displayType={'text'} thousandSeparator={true} />
										</td>
		                  				<td>{item.var_quantity}</td>
		                  				<td>
		                  					<button className="btn btn-info btn-sm" title="Edit" onClick={() => openEditModal(item._id)}>
					                      		<i className="fas fa-pencil-alt"></i>
					                      	</button>
									      	<button className="btn btn-danger btn-sm" title="Delete" onClick={() => popupDelete(item._id)}>
												<i className="fas fa-trash" aria-hidden="true"></i>
											</button>
		                  				</td>
		                  			</tr>
								)
	                  		})}
		                  </tbody>
	                  	</table>
	             	</div>
	            </div>
	            <div className="pagination-box">
					{(totalItemsCount>itemsCountPerPage) &&
						<Pagination
							activePage={activePage}
							itemsCountPerPage={itemsCountPerPage}
							totalItemsCount={totalItemsCount}
							pageRangeDisplayed={5}
							onChange={(page) => handlePageChange(page)}
							itemClass='page-item'
							linkClass='page-link'
				 		/>
					} 
				</div>
          	</div>
		)
	}
	
	return(
		<Layout>
	  		<Helmet title="Product Edit" />
	  		<section className="content-header">
		      <div className="container-fluid">
		        <div className="row mb-2">
		          <div className="col-sm-6">
		            <h1>Product Edit</h1>
		          </div>
		        </div>
		      </div>
		    </section>
		     <div className="col-md-12">
				<div className="card">
				 <Tabs selectedIndex={tabIndex} onSelect={index => setTabIndex(index)}>
					<div className="card-header p-2">
						<TabList>
							<Tab>Product</Tab>
      						<Tab>Variants</Tab>
					 	</TabList>
					</div>
					<div className="card-body">
						<div className="tab-content">
						  <TabPanel>
							<div className="tab-pane">
								{renderProductform()}
							</div>
						  	</TabPanel>
						    <TabPanel>
							<div className="tab-pane">
							{variants.length==0 &&
								<>
								{renderVariantform()}
								</>
							}
							{variants.length>0 &&	
							<>
								{renderVariantTabledata()}
							</>
							}
							</div>
						  	</TabPanel>
						</div>
					</div>
				</Tabs>
				</div>
			</div>
	    </Layout>
	);
}

export default ProductEdit;