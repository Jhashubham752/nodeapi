import React, { useState, useEffect} from "react";
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useHistory   } from 'react-router-dom';
import swal from 'sweetalert';
import Modal from 'react-awesome-modal';
import Pagination from "react-js-pagination";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Code } from 'react-content-loader';

import TextInput from '../../../shared/TextInput';
import SelectInput from '../../../shared/SelectInput';
import LoadingButton from '../../../shared/LoadingButton';
import Layout from '../../../layout/Layout';


const Promocode = (props) => {
	const history = useHistory();
	//modal
	const [modal, setModal] = useState(false);

	const [promocode, setPromocode] = useState([]);

	//pagination
	const [activePage, setActivePage] = useState(1);
	const [totalItemsCount, setTotalItemsCount] = useState(0);
	const [itemsCountPerPage, setItemsCountPerPage] = useState(0);

	//get categories
	const [categories, setCategories] = useState([]);

	//get subcategories
	const [subcategories, setSubCategories] = useState([]);

	//selected category base subcategories
	const [newsubcategory, setNewsubcategory] = useState([]);
	//date
	const [fromDate, setFromDate] = useState(new Date());

	const [toDate, setToDate] = useState(new Date());

	const [sending, setSending] = useState(false);
	//error
	const [error, setError] = useState({});

	//edit key
	const [editkey, setEditkey] = useState({});
	//maincatid
	const [maincatid, setMaincatid] = useState({});
	//show subcategory
	const [showsubcat, setShowsubcat] = useState(false);

	const [ values, setValues] = useState({
		cat_id:"",
		subcat_id:"",
		title:"",
		type:"",
		promocode:"",
		discount:"",
	});

	//open modal
	const openModal=()=>{
		setEditkey('');
		setValues({
			cat_id:"",
			subcat_id:"",
			title:"",
			type:"",
			promocode:"",
			discount:"",
		});
		setError({});
        setModal(true);
    }

     //close modal
    const closeModal=()=>{
        setModal(false);
    }

    const handleChange = (e) => {
		const { name, value } = e.target;
		setValues({
			...values,
			[name]: value
		});
 	};

 	const handleChangeCategory = (e) => {
 		//console.log(e.target.value);
 		const { name, value } = e.target;
 		findSubcategories(value);
 		setValues({
			...values,
			subcat_id:"",
			[name]: value,
		});
 	}; 
 	
 	
 	const findSubcategories = (id) => {
 		let data = [];
 		for (const item of subcategories) {
 			if(item.cat_id == id){
 				data.push(item);
 				setShowsubcat(true);
 			}
 		}
 		setNewsubcategory(data);
 	};

 	useEffect(() => {
 		getAllpromocode();
		getAllcategory();
		getAllsubcategory();
 	}, [activePage]);

 	const fromDateonChange = (date) => {
		setFromDate(date);
	};
	
	const toDateonChange = (date) => {
		setToDate(date);
	};

	//pagination
 	const handlePageChange = (page) => {
    	setActivePage(page);
 	}

	//get all getAllpromocode
 	async function getAllpromocode(){
		try {
			setSending(true);
			await axios.get('/api/promocode?page='+activePage).then((res) => {
				//console.log(res.data);
				setSending(false);
				setPromocode(res.data.data);
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
	
   //edit modal
    const openEditModal = item => {
    	try {
			 axios.get('/api/promocode/edit/'+item).then((res) => {
				setEditkey(item);
				setValues(res.data.data);
				findSubcategories(res.data.data.cat_id);
				setShowsubcat(true);
				setFromDate(new Date(res.data.data.from_date));
				setToDate(new Date(res.data.data.to_date));
			});
		}
		catch(err) {
		  	if(err && err.response && err.response.data && err.response.data.status=='denied'){
				history.push("/dashboard");
			}
	    	err.response.data.errors && setError(err.response.data.errors);
	    }
    	setModal(true);
    	setError({});
    }


 	//get categories
	async function getAllcategory(){
		try {
			await axios.get('/api/category/active').then((res) => {
				setCategories(res.data.data);
			});
		}
		catch(err) {
		  	if(err && err.response && err.response.data && err.response.data.status=='denied'){
				history.push("/dashboard");
			}
	    	err.response.data.errors && setError(err.response.data.errors);
	    }	
	}

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

 	//submit
 	async function handleSubmit(e) {
		e.preventDefault();
		try{
			setSending(true);
			values['from_date'] = fromDate;
			values['to_date'] = toDate;
			if(editkey){
				await axios.put('/api/promocode/update/'+editkey, values).then((res) => {
					setSending(false);
				 	setModal(false);
				 	getAllpromocode();
				});
			}
			else{
				await axios.post('/api/promocode/create', values).then((res) => {
					// console.log(res);
					setSending(false);
					setModal(false);
					getAllpromocode();
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

	//delete promocode
	const popupDelete = id =>{
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
				  	axios.post('/api/promocode/delete/'+id).then((res) => {
						//console.log(res);
						getAllpromocode();
						swal("Deleted!", "Promocode has been deleted!", "success");
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

	//modal form
	const renderFormModal = () => {
		return(
			<div className="row">
	          	<div className="col-md-6">
		          	<div className="card">
		                <Modal visible={modal} width="650" height="500" effect="fadeInUp">
		                 	<div className="scrollmodal">
		                 	<section className="content-header">
			      				<div className="container-fluid">
							        <div className="row">
							          <div className="col-md-12">
							            <h3>Promocode {editkey ? 'Edit' : 'Create'}
							           		<div className="pull-right">
												<button className="closeModal" onClick={closeModal}><span className="close-icon">x</span></button>
											</div>
							            </h3>
							          </div>
							        </div>
					  		 	</div>
			  			 	</section>
		                   	<form onSubmit={handleSubmit}>
				          		<div className="card-body">
				          			<SelectInput
										label="Select Category"
										placeholder="Category"
										name="cat_id"
										value={values.cat_id}
										onChange={handleChangeCategory}
										>
										<option value="">Select Category</option>
										{categories.length>0 && categories.map((category, key) => {
											return(
												<option key={key} value={category._id} selected={category.name==category.name}>
													{category.name}
												</option>
											);
										})}
									</SelectInput>

									{showsubcat==true &&
									<SelectInput
										label="Select SubCategory"
										placeholder="SubCategory"
										name="subcat_id"
										value={values.subcat_id}
										onChange={handleChange}
										>
										<option value="">Select SubCategory</option>
										{newsubcategory.length>0 && newsubcategory.map((subcategory, key) => {
											return(
												<option key={key} value={subcategory._id} selected={subcategory.name==subcategory.name}>
													{subcategory.name}
												</option>
											);
										})}
									</SelectInput>
									}
									
									<TextInput
										label="Title"
										type="text"
										placeholder="Title"
										name="title"
										value={values.title}
										onChange={handleChange}
										errors={error.title}
									/>

									<TextInput
										label="Promocode"
										type="text"
										placeholder="Promocode"
										name="promocode"
										value={values.promocode}
										onChange={handleChange}
										errors={error.promocode}
									/>

									<SelectInput
										label="Type"
										placeholder="Type"
										name="type"
										errors={error.type}
										value={values.type}
										onChange={handleChange}
										>
										<option value="">Select Type</option>
										<option value="fixed">Fixed</option>
										<option value="percentage">Percentage</option>
									</SelectInput>

									<TextInput
										label="Discount"
										type="number"
										placeholder="Discount"
										name="discount"
										value={values.discount}
										onChange={handleChange}
										errors={error.discount}
									/>
									
									<div className="form-group">
										<div className="row">
											<div className="col-md-6">
												<label>From Date</label>
												<DatePicker
													selected={fromDate}
													onChange={fromDateonChange}
													className="form-control"
													//className={`form-control ${error ? 'is-invalid' : ''}`}
													fromDate={fromDate}
													toDate={toDate}
													selectsFrom
													maxDate={toDate}
												/>
											</div>
											<div className="col-md-5">
												<label>To Date</label>
												<DatePicker
													selected={toDate}
													onChange={toDateonChange}
													className="form-control"
													fromDate={fromDate}
													toDate={toDate}
													selectsTo
													minDate={fromDate}
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
												{editkey ? 'Update' : 'Submit'}
											</LoadingButton>
										</div>
									</div>
		                    	</div>
		                    </form>
		                    </div>
		                </Modal>
            		</div>
            	</div>
          </div>
		)
	}


	return (
	  	<Layout>
	  		<Helmet title="Promocode" />
	  		<section className="content-header">
		      <div className="container-fluid">
		        <div className="row mb-2">
		          <div className="col-sm-6">
		            <h1>Promocode Details</h1>
		          </div>
		        </div>
		      </div>
		    </section>
		    {renderFormModal()}
		     <section className="content">
		      	<div className="container-fluid">
			        <div className="row">
			          	<div className="col-md-12">
				            <div className="card">
				             	<div className="card-header">
				               		<h3 className="card-title">Promocode list</h3>
				                	<div className="card-tools">
				                 		<button className="btn btn-success" onClick={openModal}>+ Add Code</button>
				                	</div>
				              	</div>
				              	<div className="card-body p-0">
					                <table className="table table-striped projects">
					                  <thead>
					                    <tr>
					                      <th>Name</th>
					                      <th>Type</th>
					                      <th>Promocode</th>
					                      <th>Discount</th>
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
					                  	{!sending && promocode.length>0  && promocode.map((item, i) => {
	                  						return(
							                    <tr key={i}>
							                      	<td>{item.title}</td>
							                     	<td>{item.type}</td>
							                       	<td>{item.promocode}</td>
							                       	<td>{item.discount}</td>
							                        <td className="project-actions">
							                        	<div className="dropdown">
														  	<button className="btn btn-info dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
														   	 Action
														  	</button>
													  		<div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
													    	 	<button className="dropdown-item btn btn-info btn-sm" title="Edit" onClick={() => openEditModal(item._id)}>
										                      		<i className="fas fa-pencil-alt"></i> Edit
										                      	</button>
														      	<button className="dropdown-item btn btn-danger btn-sm" title="Delete" onClick={() => popupDelete(item._id)}>
																	<i className="fas fa-trash" aria-hidden="true"></i> Delete
																</button>
									                      	</div>
														</div>
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
		          	</div>
          		</div>
          	</section>
		</Layout>	
  	);
}
export default Promocode;