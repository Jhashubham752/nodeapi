import React, { useState, useEffect} from "react";
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useHistory   } from 'react-router-dom';
import swal from 'sweetalert';
import Modal from 'react-awesome-modal';
import Pagination from "react-js-pagination";

import TextInput from '../../../shared/TextInput';
import TextRadio from '../../../shared/TextRadio';
import LoadingButton from '../../../shared/LoadingButton';
import Layout from '../../../layout/Layout';
import { Code } from 'react-content-loader';

const Category = (props) => {
	const history = useHistory();

	//pagination
	const [activePage, setActivePage] = useState(1);
	const [totalItemsCount, setTotalItemsCount] = useState(0);
	const [itemsCountPerPage, setItemsCountPerPage] = useState(0);

	//categories
	const [categories, setCategories] = useState([]);
	//modal
	const [modal, setModal] = useState(false);

	const [sending, setSending] = useState(false);

	//edit key
	const [editkey, setEditkey] = useState({});

	//error
	const [error, setError] = useState({});

	const [ values, setValues] = useState({
		name:"",
		cgst:"",
		sgct:"",
		cess:"",
		status:"",
	});

	//open modal
	const openModal=()=>{
		setEditkey('');
		setValues({
			name:"",
			cgst:"",
			sgct:"",
			cess:"",
			status:"",
		});
		setError({});
        setModal(true);
    }

    //close modal
    const closeModal=()=>{
        setModal(false);
    }

    //edit modal
    const openEditModal = item => {
    	try {
			 axios.get('/api/category/edit/'+item).then((res) => {
				//console.log(res)
				setEditkey(item);
				setValues(res.data.data);
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

	const handleChange = (e) => {
		const { name, value } = e.target;
		setValues({
			...values,
			[name]: value
		});
 	};

 	//submit
 	async function handleSubmit(e) {
		e.preventDefault();
		try{
			setSending(true);
			if(editkey){
				await axios.put('/api/category/update/'+editkey, values).then((res) => {
					setSending(false);
				 	setModal(false);
				 	getAllcategory();
				});
			}
			else{
				await axios.post('/api/category/create', values).then((res) => {
				// console.log(res);
					setSending(false);
					setModal(false);
					getAllcategory();
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


	useEffect(() => {
		getAllcategory();
 	}, [activePage]);

	//pagination
 	const handlePageChange = (page) => {
    	setActivePage(page);
 	}

	//get all categories
 	async function getAllcategory(){
		try {
			setSending(true);
			await axios.get('/api/categories?page='+activePage).then((res) => {
				//console.log(res.data);
				setSending(false);
				setCategories(res.data.data);
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

	//delete categories
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
				  	axios.post('/api/category/delete/'+id).then((res) => {
						//console.log(res);
						getAllcategory();
						swal("Deleted!", "Category has been deleted!", "success");
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
		                <Modal visible={modal} width="650" height="450" effect="fadeInUp">
		                 	<div className="scrollmodal">
		                 	<section className="content-header">
			      				<div className="container-fluid">
							        <div className="row">
							          <div className="col-md-12">
							            <h3>Category {editkey ? 'Edit' : 'Create'}
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
									<TextInput
										label="Name"
										type="text"
										placeholder="Name"
										name="name"
										value={values.name}
										onChange={handleChange}
										errors={error.name}
									/>
									<div className="row">
										<div className="col-md-4">
											<TextInput
												label="CGST"
												type="number"
												placeholder="CGST"
												name="cgst"
												value={values.cgst}
												onChange={handleChange}
												errors={error.cgst}
											/>
										</div>
										<div className="col-md-4">
											<TextInput
												label="SGCT"
												type="number"
												placeholder="SGCT"
												name="sgct"
												value={values.sgct}
												onChange={handleChange}
												errors={error.sgct}
											/>
										</div>
										<div className="col-md-4">
											<TextInput
												label="CESS"
												type="number"
												placeholder="CESS"
												name="cess"
												value={values.cess}
												onChange={handleChange}
												errors={error.cess}
											/>
										</div>
									</div>
									<div className="form-group">
									<label htmlFor="status">Status:</label>
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
	  		<Helmet title="Category" />
	  		<section className="content-header">
		      <div className="container-fluid">
		        <div className="row mb-2">
		          <div className="col-sm-6">
		            <h1>Category Details</h1>
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
				               		<h3 className="card-title">Category list</h3>
				                	<div className="card-tools">
				                 		<Link className="btn btn-success" onClick={openModal}>+ Add Category</Link>
				                	</div>
				              	</div>
				        
				              	<div className="card-body p-0">
					                <table className="table table-striped projects">
					                  <thead>
					                    <tr>
					                      <th>Name</th>
					                      <th>CGST</th>
					                      <th>SGST/UTGST</th>
					                      <th>CESS</th>
					                      <th>Status</th>
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
					                  	{!sending && categories.length>0  && categories.map((item, i) => {
	                  						return(
							                    <tr key={i}>
							                      <td>{item.name}</td>
							                      <td>{item.cgst ? item.cgst : '0'}%</td>
							                      <td>{item.sgct ? item.sgct : '0'}%</td>
							                      <td>{item.cess ? item.cess : '0'}%</td>
							                      <td>
							                      	{item.status=='active' &&
							                      		<span className="badge bg-success">Active</span>
							                      	}
							                      	{item.status=='inactive' &&
							                      		<span className="badge bg-danger">Inactive</span>
							                      	}

							                      </td>
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
export default Category;